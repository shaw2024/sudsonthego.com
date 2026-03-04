import "express-async-errors";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { existsSync } from "node:fs";
import path from "node:path";
import { env } from "./config/env";
import { bookingsRouter } from "./routes/bookings.routes";
import { paymentsRouter } from "./routes/payments.routes";
import { servicesRouter } from "./routes/services.routes";
import { userRouter } from "./routes/user.routes";
import { webhookRouter } from "./routes/webhook.routes";
import { errorHandler } from "./middleware/error";

export function createApp() {
  const app = express();
  const docsPath = path.resolve(__dirname, "../../../docs");

  app.use(cors());
  app.use(morgan("dev"));
  app.use(
    rateLimit({
      windowMs: 60_000,
      max: 120,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.use("/webhooks/stripe", express.raw({ type: "application/json" }), webhookRouter);
  app.use(express.json());

  if (existsSync(docsPath)) {
    app.use(express.static(docsPath));
  }

  app.get("/health", (_req, res) => {
    res.json({ ok: true, environment: env.NODE_ENV });
  });

  app.use("/services", servicesRouter);
  app.use("/bookings", bookingsRouter);
  app.use("/", paymentsRouter);
  app.use("/", userRouter);

  app.use(errorHandler);

  return app;
}