import { env } from "../config/env";
import { milesBetween } from "./geo";

export function calculatePriceBreakdown(
  servicePriceCents: number,
  lat: number,
  lng: number
) {
  const distanceMiles = milesBetween(env.DEFAULT_LAT, env.DEFAULT_LNG, lat, lng);
  const travelFeeCents = Math.round(env.TRAVEL_FEE_BASE_CENTS + distanceMiles * env.TRAVEL_FEE_PER_MILE_CENTS);
  const subtotalCents = servicePriceCents + travelFeeCents;
  const taxCents = Math.round(subtotalCents * env.TAX_RATE);
  const totalCents = subtotalCents + taxCents;

  return {
    distanceMiles,
    servicePriceCents,
    travelFeeCents,
    taxCents,
    totalCents
  };
}