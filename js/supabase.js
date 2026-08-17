const SupabaseService = (() => {
  let _client = null;

  function _isConfigured() {
    return CONFIG.SUPABASE_URL !== 'PENDING' && CONFIG.SUPABASE_ANON_KEY !== 'PENDING';
  }

  function _normalizeUrl(url) {
    return url.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  }

  function init() {
    if (!_isConfigured()) {
      throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in js/config.js');
    }
    const baseUrl = _normalizeUrl(CONFIG.SUPABASE_URL);
    _client = window.supabase.createClient(baseUrl, CONFIG.SUPABASE_ANON_KEY);
  }

  async function fetchApps() {
    const { data, error } = await _client
      .from(CONFIG.TABLES.APPS)
      .select('*');

    if (error) throw error;
    return data || [];
  }

  async function fetchBugs() {
    const { data, error } = await _client
      .from(CONFIG.TABLES.BUGS)
      .select('*');

    if (error) throw error;
    return data || [];
  }

  async function fetchAll() {
    const [apps, bugs] = await Promise.all([fetchApps(), fetchBugs()]);
    return { apps, bugs };
  }

  return { init, fetchApps, fetchBugs, fetchAll, isConfigured: _isConfigured };
})();