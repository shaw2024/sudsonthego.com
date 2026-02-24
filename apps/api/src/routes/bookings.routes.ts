import { BookingStatus, Prisma, UserRole } from "@prisma/client";
import {
  AssignBookingInputSchema,
  CreateBookingInputSchema,
  NearbyBookingsQuerySchema,
  UpdateBookingStatusInputSchema
} from "@suds/shared";
import { Router } from "express";
import createHttpError from "http-errors";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { calculatePriceBreakdown } from "../lib/pricing";
import { sendPushToUser } from "../lib/push";
import { stripe } from "../lib/stripe";
import { authRequired, roleRequired } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { milesBetween } from "../lib/geo";

const IdParamSchema = z.object({ id: z.string().uuid() });

export const bookingsRouter = Router();

bookingsRouter.use(authRequired);

bookingsRouter.post("/", roleRequired(UserRole.CUSTOMER), validate(CreateBookingInputSchema), async (req, res) => {
  const user = req.user!;
  const { serviceId, scheduledAt, addressText, lat, lng } = req.body;

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    throw createHttpError(404, "Service not found");
  }

  const customer = await prisma.user.findUnique({ where: { id: user.id } });
  if (!customer) {
    throw createHttpError(404, "User not found");
  }

  let stripeCustomerId = customer.stripeCustomerId;
  if (!stripeCustomerId) {
    const stripeCustomer = await stripe.customers.create({
      email: customer.email,
      name: customer.name,
      phone: customer.phone ?? undefined,
      metadata: { userId: customer.id }
    });
    stripeCustomerId = stripeCustomer.id;
    await prisma.user.update({ where: { id: customer.id }, data: { stripeCustomerId } });
  }

  const pricing = calculatePriceBreakdown(service.priceCents, lat, lng);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: pricing.totalCents,
    currency: "usd",
    customer: stripeCustomerId,
    automatic_payment_methods: { enabled: true },
    metadata: {
      kind: "booking",
      customerId: customer.id,
      serviceId
    }
  });

  const setupIntent = await stripe.setupIntents.create({
    customer: stripeCustomerId,
    automatic_payment_methods: { enabled: true },
    metadata: {
      kind: "tip_setup",
      customerId: customer.id
    }
  });

  const booking = await prisma.booking.create({
    data: {
      customerId: user.id,
      serviceId,
      scheduledAt: new Date(scheduledAt),
      addressText,
      lat,
      lng,
      totalCents: pricing.totalCents,
      paymentIntentId: paymentIntent.id,
      setupIntentId: setupIntent.id,
      paymentStatus: "PENDING"
    },
    include: {
      service: true
    }
  });

  res.status(201).json({
    data: {
      booking,
      pricing,
      paymentIntentClientSecret: paymentIntent.client_secret,
      setupIntentClientSecret: setupIntent.client_secret
    }
  });
});

bookingsRouter.get("/", async (req, res) => {
  const user = req.user!;

  if (user.role === UserRole.CUSTOMER) {
    const bookings = await prisma.booking.findMany({
      where: { customerId: user.id },
      include: { service: true, tip: true, rating: true },
      orderBy: { scheduledAt: "desc" }
    });
    res.json({ data: bookings });
    return;
  }

  const parsedQuery = NearbyBookingsQuerySchema.safeParse(req.query);
  const hasCoordinates = parsedQuery.success;

  const washerProfile = await prisma.washerProfile.findUnique({ where: { userId: user.id } });

  const where: Prisma.BookingWhereInput = {
    OR: [{ washerId: null, status: BookingStatus.SCHEDULED }, { washerId: user.id }]
  };

  const bookings = await prisma.booking.findMany({
    where,
    include: { service: true, customer: true },
    orderBy: { scheduledAt: "asc" }
  });

  if (!hasCoordinates || !washerProfile) {
    res.json({ data: bookings });
    return;
  }

  const { lat, lng } = parsedQuery.data;
  const filtered = bookings.filter((booking) => {
    const miles = milesBetween(lat, lng, booking.lat, booking.lng);
    return miles <= washerProfile.radiusMiles;
  });

  res.json({ data: filtered });
});

bookingsRouter.get("/:id", validate(IdParamSchema, "params"), async (req, res) => {
  const user = req.user!;
  const { id } = req.params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: true,
      tip: true,
      rating: true,
      customer: true,
      washer: true
    }
  });

  if (!booking) {
    throw createHttpError(404, "Booking not found");
  }

  const isOwner = booking.customerId === user.id || booking.washerId === user.id;
  if (!isOwner) {
    throw createHttpError(403, "Forbidden");
  }

  res.json({ data: booking });
});

bookingsRouter.post(
  "/:id/assign",
  roleRequired(UserRole.WASHER),
  validate(IdParamSchema, "params"),
  validate(AssignBookingInputSchema),
  async (req, res) => {
    const user = req.user!;
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw createHttpError(404, "Booking not found");
    }

    if (booking.washerId && booking.washerId !== user.id) {
      throw createHttpError(409, "Booking already assigned");
    }

    const conflict = await prisma.booking.findFirst({
      where: {
        washerId: user.id,
        id: { not: id },
        scheduledAt: booking.scheduledAt,
        status: { in: [BookingStatus.WASHER_ASSIGNED, BookingStatus.EN_ROUTE, BookingStatus.ARRIVED, BookingStatus.IN_PROGRESS] }
      }
    });

    if (conflict) {
      throw createHttpError(409, "Time-slot conflict: washer already booked at this time");
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        washerId: user.id,
        status: BookingStatus.WASHER_ASSIGNED
      }
    });

    await sendPushToUser(
      booking.customerId,
      "Washer assigned",
      "Your washer has been assigned and will arrive at the scheduled time.",
      { bookingId: updated.id }
    );

    res.json({ data: updated });
  }
);

const allowedStatusProgression: Record<BookingStatus, BookingStatus[]> = {
  SCHEDULED: [BookingStatus.WASHER_ASSIGNED, BookingStatus.CANCELLED],
  WASHER_ASSIGNED: [BookingStatus.EN_ROUTE, BookingStatus.CANCELLED],
  EN_ROUTE: [BookingStatus.ARRIVED, BookingStatus.CANCELLED],
  ARRIVED: [BookingStatus.IN_PROGRESS, BookingStatus.CANCELLED],
  IN_PROGRESS: [BookingStatus.COMPLETED],
  COMPLETED: [],
  CANCELLED: []
};

bookingsRouter.post(
  "/:id/status",
  validate(IdParamSchema, "params"),
  validate(UpdateBookingStatusInputSchema),
  async (req, res) => {
    const user = req.user!;
    const { id } = req.params;
    const { status } = req.body;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw createHttpError(404, "Booking not found");
    }

    const isWasher = user.role === UserRole.WASHER && booking.washerId === user.id;
    const isCustomer = user.role === UserRole.CUSTOMER && booking.customerId === user.id;

    if (!isWasher && !isCustomer) {
      throw createHttpError(403, "Forbidden");
    }

    if (isCustomer && status !== BookingStatus.CANCELLED) {
      throw createHttpError(403, "Customers can only cancel bookings");
    }

    const allowedNext = allowedStatusProgression[booking.status] || [];
    if (!allowedNext.includes(status)) {
      throw createHttpError(409, `Invalid status transition from ${booking.status} to ${status}`);
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status }
    });

    if (status === BookingStatus.COMPLETED) {
      await sendPushToUser(
        booking.customerId,
        "Job completed",
        "Your wash is complete. Tip and rate your washer now.",
        { bookingId: booking.id, action: "tip_rate" }
      );
    }

    res.json({ data: updated });
  }
);