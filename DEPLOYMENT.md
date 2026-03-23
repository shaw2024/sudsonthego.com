# 🚀 Suds On The Go - Deployment Guide

Complete guide to deploying your car wash booking platform with secure database and hosting.

## 📋 Table of Contents
1. [Quick Start](#quick-s
tart)
2. [Supabase Setup](#supabase-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Configuration](#configuration)

---

## 🎯 Quick Start

Your app has two parts:
- **Frontend**: Static HTML site (already on GitHub Pages)
- **Backend**: Express API with Prisma + Supabase

### What You Need
1. [Supabase Account](https://supabase.com) - Free PostgreSQL database + Auth
2. [Stripe Account](https://stripe.com) - Payment processing
3. Hosting for backend (choose one):
   - [Railway](https://railway.app) - Easiest (Recommended)
   - [Render](https://render.com) - Free tier available
   - [Vercel](https://vercel.com) - Serverless option
   - [Fly.io](https://fly.io) - Modern, Docker-based

---

## 🔐 Supabase Setup

### Step 1: Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click **New Project**
3. Choose:
   - Organization (create if needed)
   - Name: `sudsonthego`
   - Database Password: **Save this securely!**
   - Region: Choose closest to your users

### Step 2: Get Credentials
Once project is created, go to **Settings → API**:

```bash
# Project URL
https://your-project-ref.supabase.co

# Anon/Public Key (safe for frontend)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (SECRET! Backend only)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Go to **Settings → Database** for connection string:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Step 3: Enable Email Auth
1. Go to **Authentication → Settings**
2. Enable **Email** provider
3. Configure email templates (optional)
4. Set site URL: `https://shaw2024.github.io/sudsonthego.com`

### Step 4: Configure Auth
In SQL Editor, run:
```sql
-- Allow users to read their own data
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid() = id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

---

## 🚀 Backend Deployment

### Option A: Railway (Recommended - Easiest)

#### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

#### 2. Login and Initialize
```bash
cd /workspaces/sudsonthego.com
railway login
railway init
```

#### 3. Set Environment Variables
```bash
# Copy your Supabase credentials here
railway variables set DATABASE_URL="postgresql://postgres:..."
railway variables set SUPABASE_URL="https://your-project.supabase.co"
railway variables set SUPABASE_ANON_KEY="eyJ..."
railway variables set SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Stripe (get from stripe.com/dashboard)
railway variables set STRIPE_SECRET_KEY="sk_test_..."
railway variables set STRIPE_WEBHOOK_SECRET="whsec_..."

# App config
railway variables set NODE_ENV="production"
railway variables set API_PORT="4000"
```

#### 4. Deploy
```bash
railway up
```

#### 5. Get Your API URL
```bash
railway domain
# Example output: sudsonthego-api.railway.app
```

---

### Option B: Render

#### 1. Push Code to GitHub (Already Done ✓)

#### 2. Create Web Service
1. Go to [render.com](https://render.com)
2. Click **New → Web Service**
3. Connect your GitHub repo: `shaw2024/sudsonthego.com`

#### 3. Configure Build
```yaml
Name: sudsonthego-api
Environment: Node
Region: Oregon (US West)
Branch: main
Root Directory: apps/api
Build Command: npm install && npm run prisma:generate && npm run build
Start Command: npm run prisma:migrate && npm start
```

#### 4. Add Environment Variables
In Render dashboard, add all the same variables from Railway section above.

#### 5. Deploy
Click **Create Web Service** - Render will auto-deploy.

---

### Option C: Vercel (Serverless)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Deploy
```bash
cd /workspaces/sudsonthego.com
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: sudsonthego
# - Directory: ./
```

#### 3. Set Environment Variables
```bash
vercel env add DATABASE_URL production
vercel env add SUPABASE_URL production
# ... add all other variables
```

#### 4. Deploy Production
```bash
vercel --prod
```

---

## 🌐 Frontend Configuration

### Step 1: Update Auth Credentials

Edit `/docs/auth.js`:
```javascript
class SupabaseAuth {
  constructor() {
    // Replace with YOUR actual values
    this.SUPABASE_URL = 'https://your-actual-project.supabase.co';
    this.SUPABASE_ANON_KEY = 'eyJhbGci...'; // Your anon key
    this.API_URL = 'https://your-api.railway.app'; // Your deployed backend
    
    this.session = null;
    this.loadSession();
  }
  // ... rest stays the same
}
```

### Step 2: Test Locally
```bash
cd docs
python3 -m http.server 8080
```

Open http://localhost:8080 and test:
1. Click "Sign In"
2. Try creating account (will use Supabase)
3. Sign in with created account
4. View account page

### Step 3: Deploy to GitHub Pages
```bash
git add .
git commit -m "Configure Supabase authentication"
git push origin main
```

Your site will update at: https://shaw2024.github.io/sudsonthego.com/

---

## 🔧 Configuration Files

### Frontend Environment (`docs/auth.js`)
```javascript
SUPABASE_URL = 'https://your-project.supabase.co'
SUPABASE_ANON_KEY = 'your-anon-key'
API_URL = 'https://your-api.railway.app'
```

### Backend Environment (`apps/api/.env`)
```bash
NODE_ENV=production
API_PORT=4000
DATABASE_URL="postgresql://postgres:..."
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..." # Keep secret!
STRIPE_SECRET_KEY="sk_live_..." # Use test keys for development
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

## ✅ Testing Authentication

### 1. Create Test User
Go to Supabase Dashboard → Authentication → Users → Add User:
```
Email: test@example.com
Password: TestPassword123!
```

### 2. Test Sign In
1. Visit your site
2. Click "Sign In"
3. Enter test credentials
4. Should redirect to account page

### 3. Test API Connection
Open browser console on account page:
```javascript
// Should see your bookings (or empty array if none)
console.log('Auth token:', auth.getToken());
```

---

## 🔒 Security Checklist

- [ ] Environment variables set on hosting platform
- [ ] Database connection uses SSL (Supabase does by default)
- [ ] CORS configured in backend (already done in app.ts)
- [ ] Rate limiting enabled (already configured)
- [ ] Never commit .env files to Git
- [ ] Use Stripe test keys for development
- [ ] Enable Row Level Security in Supabase
- [ ] Set up Stripe webhooks for production

---

## 🐛 Troubleshooting

### "Invalid auth token" Error
- Check Supabase credentials in `auth.js`
- Verify SUPABASE_SERVICE_ROLE_KEY on backend
- Clear browser localStorage: `localStorage.clear()`

### Backend Won't Start
- Check all environment variables are set
- Verify DATABASE_URL connects to Supabase
- Run migrations: `npm run prisma:migrate`

### CORS Errors
Backend already has CORS enabled. If issues persist:
```javascript
// In apps/api/src/app.ts
app.use(cors({
  origin: 'https://shaw2024.github.io',
  credentials: true
}));
```

### Payment Failures
- Verify Stripe keys are correct
- Set up webhook endpoint in Stripe dashboard
- Point to: `https://your-api.railway.app/webhooks/stripe`

---

## 📚 Next Steps

1. **Database**: Run migrations on production
   ```bash
   # On Railway/Render/etc
   cd apps/api && npx prisma migrate deploy
   ```

2. **Stripe Webhooks**: Configure in Stripe Dashboard
   - Endpoint: `https://your-api.railway.app/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.failed`

3. **Email Templates**: Customize in Supabase Dashboard
   - Go to Authentication → Email Templates
   - Edit confirmation, reset password emails

4. **Custom Domain**: 
   - Frontend: Configure in GitHub Pages settings
   - Backend: Add custom domain in Railway/Render settings

5. **Monitoring**: Set up error tracking
   - Add Sentry or similar service
   - Monitor API health endpoint: `/health`

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

## 🎉 You're Done!

Your site now has:
- ✅ Secure PostgreSQL database (Supabase)
- ✅ User authentication with JWT
- ✅ Deployed backend API
- ✅ Stripe payment processing
- ✅ Static frontend on GitHub Pages

**Live URLs:**
- Frontend: https://shaw2024.github.io/sudsonthego.com/
- Backend: https://your-api-domain.com
- Database: Managed by Supabase

Need help? Check the troubleshooting section or review deployment logs!
