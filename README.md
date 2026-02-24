# SudsOnTheGo MVP

Production-ready MVP monorepo for an on-demand mobile car wash platform.

## Stack

- Mobile: Expo + React Native + TypeScript
- API: Node.js + Express + TypeScript
- Shared contracts: TypeScript + Zod
- Database: Postgres + Prisma
- Auth: Supabase Auth
- Payments: Stripe (booking PaymentIntent + SetupIntent for post-job tips)
- Maps: Google Places API + map coordinates in booking flow
- Notifications: Expo push notifications

## Monorepo structure

```
apps/
	api/
	mobile/
packages/
	shared/
```

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Start Postgres:

```bash
docker compose up -d postgres
```

3. Configure environment variables:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
```

4. Run Prisma migrations and seed:

```bash
npm run prisma:migrate -w apps/api
npm run prisma:seed -w apps/api
```

5. Start API:

```bash
npm run dev -w apps/api
```

6. Start mobile app:

```bash
npm run dev -w apps/mobile
```

## Stripe webhook local testing

1. Install Stripe CLI and login.
2. Forward events to local API:

```bash
stripe listen --forward-to localhost:4000/webhooks/stripe
```

3. Copy generated webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

## API endpoints

- `GET /services`
- `POST /bookings`
- `GET /bookings/:id`
- `GET /bookings`
- `POST /bookings/:id/assign`
- `POST /bookings/:id/status`
- `POST /tips`
- `POST /ratings`
- `POST /push-tokens`
- `POST /washers/profile`
- `POST /webhooks/stripe`

## Notes

- Booking flow returns both `paymentIntentClientSecret` and `setupIntentClientSecret`.
- Tips can be charged with saved payment method (off-session) or a new payment intent.
- Washer assignment checks time-slot conflicts to prevent double-booking.

## GitHub Pages site

This repo includes a minimal static site in `docs/` and a workflow at `.github/workflows/pages.yml`.

To publish it:

1. Go to **GitHub → Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually).

The site deploys from `docs/` and will be available at:

- `https://shaw2024.github.io/sudsonthego.com/`