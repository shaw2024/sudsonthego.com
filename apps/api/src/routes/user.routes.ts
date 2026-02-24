import { UserRole } from "@prisma/client";
import { PushTokenInputSchema, WasherProfileInputSchema } from "@suds/shared";
import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authRequired, roleRequired } from "../middleware/auth";
import { validate } from "../middleware/validate";

export const userRouter = Router();

userRouter.use(authRequired);

userRouter.post("/push-tokens", validate(PushTokenInputSchema), async (req, res) => {
  const user = req.user!;
  const { token, platform } = req.body;

  const saved = await prisma.pushToken.upsert({
    where: { token },
    update: { userId: user.id, platform },
    create: {
      userId: user.id,
      token,
      platform
    }
  });

  res.status(201).json({ data: saved });
});

userRouter.post(
  "/washers/profile",
  roleRequired(UserRole.WASHER),
  validate(WasherProfileInputSchema),
  async (req, res) => {
    const user = req.user!;
    const { radiusMiles, availabilityJson, isActive } = req.body;

    const profile = await prisma.washerProfile.upsert({
      where: { userId: user.id },
      update: { radiusMiles, availabilityJson, isActive },
      create: {
        userId: user.id,
        radiusMiles,
        availabilityJson,
        isActive
      }
    });

    res.status(201).json({ data: profile });
  }
);

userRouter.get("/washers/earnings", roleRequired(UserRole.WASHER), async (req, res) => {
  const user = req.user!;

  const completedBookings = await prisma.booking.findMany({
    where: { washerId: user.id, status: "COMPLETED" },
    include: { service: true, tip: true },
    orderBy: { scheduledAt: "desc" }
  });

  const jobsTotalCents = completedBookings.reduce((sum, b) => sum + b.totalCents, 0);
  const tipsTotalCents = completedBookings.reduce((sum, b) => sum + (b.tip?.amountCents ?? 0), 0);

  res.json({
    data: {
      jobs: completedBookings,
      totals: {
        jobsTotalCents,
        tipsTotalCents,
        grandTotalCents: jobsTotalCents + tipsTotalCents
      }
    }
  });
});