import { Router } from "express";
import { prisma } from "../lib/prisma";

export const servicesRouter = Router();

servicesRouter.get("/", async (_req, res) => {
  const services = await prisma.service.findMany({ orderBy: { priceCents: "asc" } });
  res.json({ data: services });
});