#!/bin/bash

# Suds On The Go - Quick Setup Script
# This script helps you configure your Supabase credentials

set -e

echo "🫧 Suds On The Go - Setup Wizard"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Please run this script from the project root directory"
  exit 1
fi

echo "📝 This script will help you configure:"
echo "   1. Supabase credentials"
echo "   2. Frontend authentication"
echo "   3. Backend environment"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  exit 0
fi

echo ""
echo "🔐 Step 1: Supabase Configuration"
echo "===================================="
echo ""
echo "Get these from: https://supabase.com/dashboard"
echo "Your Project → Settings → API"
echo ""

read -p "Supabase Project URL (https://xxx.supabase.co): " SUPABASE_URL
read -p "Supabase Anon Key: " SUPABASE_ANON_KEY
read -sp "Supabase Service Role Key: " SUPABASE_SERVICE_ROLE_KEY
echo ""
echo ""

echo "📊 Step 2: Database Connection"
echo "================================"
echo ""
echo "Get from: Settings → Database → Connection String"
echo ""
read -p "Database URL (postgresql://...): " DATABASE_URL
echo ""

echo "💳 Step 3: Stripe Configuration (Optional - Skip for now)"
echo "=========================================================="
read -p "Stripe Secret Key (or press Enter to skip): " STRIPE_SECRET_KEY
if [ -z "$STRIPE_SECRET_KEY" ]; then
  STRIPE_SECRET_KEY="sk_test_placeholder"
fi

read -p "Stripe Webhook Secret (or press Enter to skip): " STRIPE_WEBHOOK_SECRET
if [ -z "$STRIPE_WEBHOOK_SECRET" ]; then
  STRIPE_WEBHOOK_SECRET="whsec_placeholder"
fi
echo ""

echo "🚀 Step 4: API Endpoint"
echo "======================="
read -p "Backend API URL (http://localhost:4000 for local): " API_URL
if [ -z "$API_URL" ]; then
  API_URL="http://localhost:4000"
fi
echo ""

# Create backend .env
echo "📝 Creating backend .env file..."
cat > apps/api/.env << EOF
NODE_ENV=development
API_PORT=4000

DATABASE_URL="${DATABASE_URL}"

SUPABASE_URL="${SUPABASE_URL}"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY}"
SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY}"
STRIPE_WEBHOOK_SECRET="${STRIPE_WEBHOOK_SECRET}"
STRIPE_CURRENCY="usd"

TRAVEL_FEE_BASE_CENTS=299
TRAVEL_FEE_PER_MILE_CENTS=125
DEFAULT_LAT=40.7128
DEFAULT_LNG=-74.0060
TAX_RATE=0.085

EXPO_ACCESS_TOKEN=""
EOF

echo "✅ Backend .env created"

# Update frontend auth.js
echo "📝 Updating frontend auth.js..."

cat > docs/auth.js << EOF
// Supabase Authentication Library for Frontend
class SupabaseAuth {
  constructor() {
    this.SUPABASE_URL = '${SUPABASE_URL}';
    this.SUPABASE_ANON_KEY = '${SUPABASE_ANON_KEY}';
    this.API_URL = '${API_URL}';
    
    this.session = null;
    this.loadSession();
  }

  loadSession() {
    const stored = localStorage.getItem('supabase.auth.token');
    if (stored) {
      try {
        this.session = JSON.parse(stored);
      } catch (e) {
        localStorage.removeItem('supabase.auth.token');
      }
    }
  }

  async signUp(email, password, name) {
    try {
      const response = await fetch(\`\${this.SUPABASE_URL}/auth/v1/signup\`, {
        method: 'POST',
        headers: {
          'apikey': this.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          data: { name }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.access_token) {
        this.session = {
          access_token: data.access_token,
          user: data.user
        };
        localStorage.setItem('supabase.auth.token', JSON.stringify(this.session));
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async signIn(email, password) {
    try {
      const response = await fetch(\`\${this.SUPABASE_URL}/auth/v1/token?grant_type=password\`, {
        method: 'POST',
        headers: {
          'apikey': this.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.access_token) {
        this.session = {
          access_token: data.access_token,
          user: data.user
        };
        localStorage.setItem('supabase.auth.token', JSON.stringify(this.session));
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async signOut() {
    if (this.session?.access_token) {
      try {
        await fetch(\`\${this.SUPABASE_URL}/auth/v1/logout\`, {
          method: 'POST',
          headers: {
            'apikey': this.SUPABASE_ANON_KEY,
            'Authorization': \`Bearer \${this.session.access_token}\`
          }
        });
      } catch (error) {
        console.error('Sign out error:', error);
      }
    }
    
    this.session = null;
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
  }

  getUser() {
    return this.session?.user || null;
  }

  getToken() {
    return this.session?.access_token || null;
  }

  isAuthenticated() {
    return !!this.session?.access_token;
  }

  async apiRequest(endpoint, options = {}) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(\`\${this.API_URL}\${endpoint}\`, {
      ...options,
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (response.status === 401) {
      this.signOut();
      window.location.href = '/signin.html';
      throw new Error('Session expired');
    }

    return response;
  }
}

const auth = new SupabaseAuth();
EOF

# Copy to root
cp docs/auth.js auth.js
echo "✅ Frontend auth.js updated"

echo ""
echo "=============================================="
echo "✅ Setup Complete!"
echo "=============================================="
echo ""
echo "📦 Next Steps:"
echo ""
echo "1. Install dependencies:"
echo "   cd apps/api && npm install"
echo ""
echo "2. Run database migrations:"
echo "   cd apps/api && npm run prisma:migrate"
echo ""
echo "3. Start the backend:"
echo "   cd apps/api && npm run dev"
echo ""
echo "4. In another terminal, start frontend:"
echo "   cd docs && python3 -m http.server 8080"
echo ""
echo "5. Visit: http://localhost:8080"
echo ""
echo "📚 For deployment instructions, see DEPLOYMENT.md"
echo ""
