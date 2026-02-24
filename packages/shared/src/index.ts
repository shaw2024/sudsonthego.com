import { z } from "zod";

export const UserRoleSchema = z.enum(["CUSTOMER", "WASHER"]);

export const BookingStatusSchema = z.enum([
  "SCHEDULED",
  "WASHER_ASSIGNED",
  "EN_ROUTE",
  "ARRIVED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED"
]);

export const PaymentStatusSchema = z.enum([
  "PENDING",
  "REQUIRES_ACTION",
  "SUCCEEDED",
  "FAILED"
]);

export const CreateBookingInputSchema = z.object({
  serviceId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  addressText: z.string().min(5),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180)
});

export const AssignBookingInputSchema = z.object({
  washerId: z.string().uuid().optional()
});

export const UpdateBookingStatusInputSchema = z.object({
  status: BookingStatusSchema
});

export const CreateTipInputSchema = z.object({
  bookingId: z.string().uuid(),
  amountCents: z.number().int().min(50),
  savedPaymentMethodId: z.string().optional()
});

export const CreateRatingInputSchema = z.object({
  bookingId: z.string().uuid(),
  stars: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional()
});

export const PushTokenInputSchema = z.object({
  token: z.string().min(10),
  platform: z.enum(["ios", "android", "web"])
});

export const WasherProfileInputSchema = z.object({
  radiusMiles: z.number().min(1).max(50),
  availabilityJson: z.record(z.any()),
  isActive: z.boolean().default(true)
});

export const NearbyBookingsQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180)
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type BookingStatus = z.infer<typeof BookingStatusSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type CreateBookingInput = z.infer<typeof CreateBookingInputSchema>;
export type UpdateBookingStatusInput = z.infer<typeof UpdateBookingStatusInputSchema>;
export type CreateTipInput = z.infer<typeof CreateTipInputSchema>;
export type CreateRatingInput = z.infer<typeof CreateRatingInputSchema>;
export type PushTokenInput = z.infer<typeof PushTokenInputSchema>;
export type WasherProfileInput = z.infer<typeof WasherProfileInputSchema>;