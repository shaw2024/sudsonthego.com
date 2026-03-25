// Supabase Authentication Library for Frontend
// Simple configuration - add your credentials after setting up Supabase

class SupabaseAuth {
  constructor() {
    // TODO: Replace with your actual Supabase credentials
    // Get these from https://supabase.com/dashboard → Your Project → Settings → API
    this.SUPABASE_URL = 'https://your-project-ref.supabase.co';
    this.SUPABASE_ANON_KEY = 'your-anon-key-here';
    this.API_URL = 'http://localhost:4000'; // Change to your deployed API URL
    
    this.session = null;
    this.loadSession();
  }

  // Initialize - load existing session
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

  // Sign up new user
  async signUp(email, password, name) {
    try {
      const response = await fetch(`${this.SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'apikey': this.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          data: { name } // User metadata
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

  // Sign in existing user
  async signIn(email, password) {
    try {
      const response = await fetch(`${this.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
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

  // Sign out
  async signOut() {
    if (this.session?.access_token) {
      try {
        await fetch(`${this.SUPABASE_URL}/auth/v1/logout`, {
          method: 'POST',
          headers: {
            'apikey': this.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${this.session.access_token}`
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

  // Get current user
  getUser() {
    if (this.session?.user) return this.session.user;
    // Demo mode fallback
    const email = sessionStorage.getItem('userEmail');
    if (email) return { email };
    return null;
  }

  // Get access token for API calls
  getToken() {
    return this.session?.access_token || null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.session?.access_token || sessionStorage.getItem('isAuthenticated') === 'true';
  }

  // Make authenticated API request
  async apiRequest(endpoint, options = {}) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (response.status === 401) {
      // Token expired or invalid
      this.signOut();
      window.location.href = '/signin.html';
      throw new Error('Session expired');
    }

    return response;
  }
}

// Export singleton instance
const auth = new SupabaseAuth();
