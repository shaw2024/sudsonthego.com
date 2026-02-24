export const config = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:4000",
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
  stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  googlePlacesApiKey: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ?? ""
};