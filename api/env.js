module.exports = function (req, res) {
  const payload = JSON.stringify({
    SUPABASE_URL: process.env.SUPABASE_URL || 'PENDING',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'PENDING'
  });
  res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
  res.send('window.__SUPABASE_ENV__ = ' + payload + ';');
};