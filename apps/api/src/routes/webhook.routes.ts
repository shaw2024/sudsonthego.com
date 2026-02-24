import { PaymentStatus, TipStatus } from "@prisma/client";
import { Router } from "express";
import createHttpError from "http-errors";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";
import { stripe } from "../lib/stripe";

export const webhookRouter = Router();

webhookRouter.post("/", async (req, res) => {
  const signature = req.headers["stripe-signature"];
  if (!signature || typeof signature !== "string") {
    throw createHttpError(400, "Missing stripe signature");
  }

  const event = stripe.webhooks.constructEvent(
    req.body,
    signature,
    env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;

    await prisma.booking.updateMany({
      where: { paymentIntentId: intent.id },
      data: { paymentStatus: PaymentStatus.SUCCEEDED }
    });

    await prisma.tip.updateMany({
      where: { stripePaymentIntentId: intent.id },
      data: { status: TipStatus.SUCCEEDED }
    });
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object;

    await prisma.booking.updateMany({
      where: { paymentIntentId: intent.id },
      data: { paymentStatus: PaymentStatus.FAILED }
    });

    await prisma.tip.updateMany({
      where: { stripePaymentIntentId: intent.id },
      data: { status: TipStatus.FAILED }
    });
  }

  if (event.type === "payment_intent.requires_action") {
    const intent = event.data.object;
    await prisma.booking.updateMany({
      where: { paymentIntentId: intent.id },
      data: { paymentStatus: PaymentStatus.REQUIRES_ACTION }
    });
  }

  res.json({ received: true });
});