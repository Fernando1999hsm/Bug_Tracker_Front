const env = (typeof window !== 'undefined' && window.__SUPABASE_ENV__) || {};

const CONFIG = {
  SUPABASE_URL: env.SUPABASE_URL || 'PENDING',
  SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY || 'PENDING',
  TABLES: {
    APPS: 'aplication',
    BUGS: 'issue'
  }
};