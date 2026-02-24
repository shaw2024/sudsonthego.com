import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_CURRENCY: z.string().default("usd"),
  TRAVEL_FEE_BASE_CENTS: z.coerce.number().default(299),
  TRAVEL_FEE_PER_MILE_CENTS: z.coerce.number().default(125),
  DEFAULT_LAT: z.coerce.number().default(40.7128),
  DEFAULT_LNG: z.coerce.number().default(-74.006),
  TAX_RATE: z.coerce.number().default(0.085),
  EXPO_ACCESS_TOKEN: z.string().optional()
});

export const env = EnvSchema.parse(process.env);