/* ==========================================================================
   EL AUSTRAL CONSULTANT — DEMO DATABASE
   While EA_MODE is 'demo', every sign-up, sign-in and order is recorded here,
   exactly as the live system will record it, but in separate DEMO tables.

   Where the data lives: in this browser (localStorage), shared by every page
   of the site opened the same way (always by double-click, or always through
   localhost — not a mix). Admin > Demo Data shows the tables, exports them to
   English/Data/Demo/*.csv and clears them.

   AT LAUNCH: Admin > Demo Data > "Clear all demo data", then change EA_MODE
   below to 'live' once the backend is connected.
   ========================================================================== */
(function () {
  window.EA_MODE = 'demo';

  const STORE = 'ea_demo_db_v1';
  const SCHEMA = {
    clients: ['user_id', 'status', 'company_name', 'business_type', 'location_qty', 'poc_name', 'poc_email_address',
              'poc_phone_number', 'address_street_name', 'address_number', 'address_zip', 'referred_by', 'referral_id',
              'marketing_opt_in', 'password_salt', 'password_hash', 'creation_date', 'environment'],
    orders: ['order_id', 'user_id', 'created_at', 'service_key', 'service_name', 'database_qty', 'database_names',
             'file_names', 'answers_json', 'price_total', 'price_term', 'keep_cleaned_data', 'monthly_terms_accepted',
             'status', 'environment'],
    activity: ['activity_id', 'user_id', 'activity_type', 'description', 'occurred_at', 'environment']
  };

  function load() {
    try { const d = JSON.parse(localStorage.getItem(STORE) || 'null'); if (d && d.clients) return d; } catch (e) {}
    return { clients: [], orders: [], activity: [] };
  }
  function save(d) { localStorage.setItem(STORE, JSON.stringify(d)); }   // throws if storage is blocked
  const pad = (n, l = 2) => String(n).padStart(l, '0');
  const nowIso = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };

  async function sha256Hex(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  function randomSalt() { return [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, '0')).join(''); }

  function nextSeq(rows, col, prefix, width) {
    const max = rows.reduce((m, r) => Math.max(m, Number(String(r[col] || '').replace(/\D/g, '')) || 0), 0);
    return prefix + String(max + 1).padStart(width, '0');
  }

  const API = {
    SCHEMA,
    available() { try { localStorage.setItem('__ea_t', '1'); localStorage.removeItem('__ea_t'); return !!(window.crypto && crypto.subtle); } catch (e) { return false; } },
    all() { return load(); },
    table(name) { return load()[name] || []; },

    // Pre-customer ID: P-YYYYMMDD-### (same format as customer_signup.html)
    nextUserId() {
      const d = new Date(), ymd = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
      let max = 0;
      load().clients.forEach(c => { const m = /^[PC]-(\d{8})-(\d{3})$/.exec(c.user_id); if (m && m[1] === ymd) max = Math.max(max, Number(m[2])); });
      return 'P-' + ymd + '-' + pad(max + 1, 3);
    },
    emailInUse(email) { return load().clients.some(c => (c.poc_email_address || '').toLowerCase() === email.toLowerCase()); },

    async createClient(info, password) {
      const d = load();
      const user_id = API.nextUserId();
      const salt = randomSalt();
      const row = Object.assign(Object.fromEntries(SCHEMA.clients.map(c => [c, ''])), info, {
        user_id, status: 'pre-customer', password_salt: salt, password_hash: await sha256Hex(salt + password),
        creation_date: today(), environment: 'Demo'
      });
      d.clients.push(row);
      d.activity.push({ activity_id: nextSeq(d.activity, 'activity_id', 'ACT-', 6), user_id, activity_type: 'sign_up',
                        description: 'Pre-customer account created', occurred_at: nowIso(), environment: 'Demo' });
      save(d);
      return row;
    },

    async signIn(userId, password) {
      const d = load();
      const c = d.clients.find(x => x.user_id === userId.trim().toUpperCase());
      if (!c || await sha256Hex(c.password_salt + password) !== c.password_hash) return null;
      d.activity.push({ activity_id: nextSeq(d.activity, 'activity_id', 'ACT-', 6), user_id: c.user_id, activity_type: 'sign_in',
                        description: 'Signed in to place an order', occurred_at: nowIso(), environment: 'Demo' });
      save(d);
      return c;
    },

    addOrder(order) {
      const d = load();
      const row = Object.assign(Object.fromEntries(SCHEMA.orders.map(c => [c, ''])), order, {
        order_id: nextSeq(d.orders, 'order_id', 'ORD-', 6), created_at: nowIso(), status: 'submitted', environment: 'Demo'
      });
      d.orders.push(row);
      d.activity.push({ activity_id: nextSeq(d.activity, 'activity_id', 'ACT-', 6), user_id: row.user_id, activity_type: 'order_submitted',
                        description: row.order_id + ': ' + row.service_name + ' (' + row.database_qty + ' database' + (row.database_qty == 1 ? '' : 's') + ')',
                        occurred_at: nowIso(), environment: 'Demo' });
      save(d);
      return row;
    },

    log(userId, type, description) {
      const d = load();
      d.activity.push({ activity_id: nextSeq(d.activity, 'activity_id', 'ACT-', 6), user_id: userId, activity_type: type,
                        description, occurred_at: nowIso(), environment: 'Demo' });
      save(d);
    },

    toCSV(name) {
      const cols = SCHEMA[name], esc = v => { v = v == null ? '' : String(v); return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
      return [cols.join(',')].concat(API.table(name).map(r => cols.map(c => esc(r[c])).join(','))).join('\r\n') + '\r\n';
    },
    clearAll() { localStorage.removeItem(STORE); }
  };
  window.EA_DB = API;
})();
