import { CreateBookingInput, CreateRatingInput, CreateTipInput, PushTokenInput, WasherProfileInput } from "@suds/shared";
import { config } from "./config";

async function request<T>(path: string, options?: RequestInit, accessToken?: string): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options?.headers || {})
    }
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.message || "Request failed");
  }

  return payload.data as T;
}

export const api = {
  getServices: () => request<any[]>("/services"),
  createBooking: (input: CreateBookingInput, accessToken: string) =>
    request<any>("/bookings", { method: "POST", body: JSON.stringify(input) }, accessToken),
  getBookings: (accessToken: string, query?: string) =>
    request<any[]>(`/bookings${query ? `?${query}` : ""}`, undefined, accessToken),
  getBooking: (id: string, accessToken: string) => request<any>(`/bookings/${id}`, undefined, accessToken),
  assignBooking: (id: string, accessToken: string) =>
    request<any>(`/bookings/${id}/assign`, { method: "POST", body: JSON.stringify({}) }, accessToken),
  updateBookingStatus: (id: string, status: string, accessToken: string) =>
    request<any>(`/bookings/${id}/status`, { method: "POST", body: JSON.stringify({ status }) }, accessToken),
  createTip: (input: CreateTipInput, accessToken: string) =>
    request<any>("/tips", { method: "POST", body: JSON.stringify(input) }, accessToken),
  createRating: (input: CreateRatingInput, accessToken: string) =>
    request<any>("/ratings", { method: "POST", body: JSON.stringify(input) }, accessToken),
  savePushToken: (input: PushTokenInput, accessToken: string) =>
    request<any>("/push-tokens", { method: "POST", body: JSON.stringify(input) }, accessToken),
  saveWasherProfile: (input: WasherProfileInput, accessToken: string) =>
    request<any>("/washers/profile", { method: "POST", body: JSON.stringify(input) }, accessToken),
  getWasherEarnings: (accessToken: string) => request<any>("/washers/earnings", undefined, accessToken)
};