import { TipStatus, UserRole } from "@prisma/client";
import { CreateRatingInputSchema, CreateTipInputSchema } from "@suds/shared";
import { Router } from "express";
import createHttpError from "http-errors";
import { prisma } from "../lib/prisma";
import { stripe } from "../lib/stripe";
import { authRequired, roleRequired } from "../middleware/auth";
import { validate } from "../middleware/validate";

export const paymentsRouter = Router();

paymentsRouter.use(authRequired);

paymentsRouter.post("/tips", roleRequired(UserRole.CUSTOMER), validate(CreateTipInputSchema), async (req, res) => {
  const user = req.user!;
  const { bookingId, amountCents, savedPaymentMethodId } = req.body;

  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { customer: true } });
  if (!booking || booking.customerId !== user.id) {
    throw createHttpError(404, "Booking not found");
  }

  if (booking.status !== "COMPLETED") {
    throw createHttpError(409, "Tips are only allowed after completion");
  }

  const existingTip = await prisma.tip.findUnique({ where: { bookingId } });
  if (existingTip?.status === TipStatus.SUCCEEDED) {
    throw createHttpError(409, "Tip already paid");
  }

  if (!booking.customer.stripeCustomerId) {
    throw createHttpError(400, "Missing Stripe customer for tip payment");
  }

  const tipRecord =
    existingTip ||
    (await prisma.tip.create({
      data: {
        bookingId,
        customerId: user.id,
        amountCents,
        status: TipStatus.PENDING
      }
    }));

  if (savedPaymentMethodId) {
    const intent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      customer: booking.customer.stripeCustomerId,
      payment_method: savedPaymentMethodId,
      confirm: true,
      off_session: true,
      metadata: {
        kind: "tip",
        bookingId,
        tipId: tipRecord.id
      }
    });

    await prisma.tip.update({
      where: { id: tipRecord.id },
      data: {
        amountCents,
        stripePaymentIntentId: intent.id,
        status: intent.status === "succeeded" ? TipStatus.SUCCEEDED : TipStatus.PENDING
      }
    });

    res.status(201).json({
      data: {
        tipId: tipRecord.id,
        status: intent.status,
        stripePaymentIntentId: intent.id
      }
    });
    return;
  }

  const intent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: "usd",
    customer: booking.customer.stripeCustomerId,
    automatic_payment_methods: { enabled: true },
    metadata: {
      kind: "tip",
      bookingId,
      tipId: tipRecord.id
    }
  });

  await prisma.tip.update({
    where: { id: tipRecord.id },
    data: {
      amountCents,
      stripePaymentIntentId: intent.id,
      status: TipStatus.PENDING
    }
  });

  res.status(201).json({
    data: {
      tipId: tipRecord.id,
      clientSecret: intent.client_secret,
      status: intent.status,
      stripePaymentIntentId: intent.id
    }
  });
});

paymentsRouter.post("/ratings", roleRequired(UserRole.CUSTOMER), validate(CreateRatingInputSchema), async (req, res) => {
  const user = req.user!;
  const { bookingId, stars, comment } = req.body;

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.customerId !== user.id) {
    throw createHttpError(404, "Booking not found");
  }

  if (!booking.washerId) {
    throw createHttpError(409, "Cannot rate before washer assignment");
  }

  if (booking.status !== "COMPLETED") {
    throw createHttpError(409, "Ratings are only allowed after completion");
  }

  const rating = await prisma.rating.upsert({
    where: { bookingId },
    update: { stars, comment },
    create: {
      bookingId,
      customerId: user.id,
      washerId: booking.washerId,
      stars,
      comment
    }
  });

  res.status(201).json({ data: rating });
});