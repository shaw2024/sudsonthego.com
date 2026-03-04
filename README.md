# SudsOnTheGo

**Premium on-demand mobile car wash — delivered to your door.**

> 🌐 Live site: [sudsonthego.com](https://shaw2024.github.io/sudsonthego.com/)

---

## What is SudsOnTheGo?

SudsOnTheGo connects customers with vetted, top-rated mobile car washers who come to your driveway, office lot, or apartment garage. Book in under 2 minutes, track your washer in real-time, and pay securely with Stripe.

---

## Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Mobile App  | Expo · React Native · TypeScript              |
| API Server  | Node.js · Express · TypeScript                |
| Database    | PostgreSQL · Prisma ORM                       |
| Auth        | Supabase Auth (JWT)                           |
| Payments    | Stripe (PaymentIntent + SetupIntent for tips) |
| Maps        | Google Places API                             |
| Push Alerts | Expo Push Notifications                       |
| Landing     | Static HTML/CSS (served from `docs/`)         |

---

## Monorepo layout

```
apps/
  api/          → Express REST API + Prisma
  mobile/       → Expo React Native app
packages/
  shared/       → Shared TypeScript types & Zod schemas
docs/
  index.html    → Public-facing landing page (GitHub Pages)
```

---

## Quick start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the database
```bash
docker compose up -d postgres
```

### 3. Configure environment variables
```bash
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
# Edit both .env files with your credentials
```

### 4. Migrate & seed
```bash
npm run prisma:migrate -w apps/api
npm run prisma:seed -w apps/api
```

### 5. Run development servers
```bash
# API (http://localhost:4000)
npm run dev -w apps/api

# Mobile app
npm run dev -w apps/mobile
```

---

## API reference

| Method | Route                        | Description                         |
|--------|------------------------------|-------------------------------------|
| GET    | `/health`                    | Health check                        |
| GET    | `/services`                  | List available services             |
| POST   | `/bookings`                  | Create booking + payment intent     |
| GET    | `/bookings`                  | Customer's booking list             |
| GET    | `/bookings/:id`              | Single booking detail               |
| POST   | `/bookings/:id/assign`       | Washer self-assigns a booking       |
| POST   | `/bookings/:id/status`       | Advance booking status              |
| POST   | `/tips`                      | Add a tip post-wash                 |
| POST   | `/ratings`                   | Submit a rating                     |
| POST   | `/push-tokens`               | Register Expo push token            |
| POST   | `/washers/profile`           | Upsert washer profile               |
| POST   | `/webhooks/stripe`           | Stripe webhook handler              |

---

## Stripe local testing

```bash
stripe listen --forward-to localhost:4000/webhooks/stripe
# Copy the generated signing secret → STRIPE_WEBHOOK_SECRET in apps/api/.env
```

---

## Deploying the landing page

The static site (`docs/index.html`) deploys automatically via GitHub Actions to GitHub Pages.

1. Go to **Settings → Pages** → set source to **GitHub Actions**.
2. Push to `main` — the workflow publishes from `docs/`.
3. Site is live at `https://shaw2024.github.io/sudsonthego.com/`.

---

© 2026 SudsOnTheGo
