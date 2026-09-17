/* ============================================================================
 * tripStore.js — data layer for the Tesla Road Trip Charging Tracker
 *
 * This is the ONLY place that touches storage. Today it persists to the
 * browser's localStorage. When your backend is ready, you only have to
 * rewrite the bodies of the methods below — every method is already async
 * (returns a Promise) and the UI never assumes synchronous data, so swapping
 * localStorage for `fetch()` calls requires NO changes anywhere else.
 *
 * ── HOW TO CONNECT A BACKEND ────────────────────────────────────────────────
 * Replace the localStorage reads/writes with fetch, e.g.:
 *
 *   async list() {
 *     const r = await fetch(`${API}/entries`);
 *     return r.json();
 *   },
 *   async save(entry) {
 *     const method = entry.id ? 'PUT' : 'POST';
 *     const url = entry.id ? `${API}/entries/${entry.id}` : `${API}/entries`;
 *     const r = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(entry) });
 *     return r.json();
 *   },
 *   async remove(id)  { await fetch(`${API}/entries/${id}`, { method:'DELETE' }); },
 *   async getRates()  { return (await fetch(`${API}/rates`)).json(); },
 *   async setRates(o) { await fetch(`${API}/rates`, {method:'PUT', body: JSON.stringify(o)}); },
 *
 * The entry shape (see DEFAULT_SEED) is the contract your API should honour.
 * ========================================================================== */

(function () {
  const ENTRIES_KEY = 'tt_entries_v1';
  const RATES_KEY   = 'tt_rates_v1';
  const SEED_FLAG   = 'tt_seeded_v1';

  // Local currency units per 1 EUR. Editable in-app (Settings → Exchange rates).
  const DEFAULT_RATES = {
    EUR: 1,
    TRY: 48.0,     // Turkish lira
    BGN: 1.9558,   // Bulgarian lev (pegged to EUR)
    RSD: 117.2,    // Serbian dinar
    HUF: 398.0     // Hungarian forint
    // Croatia, Slovenia & Italy all use EUR.
  };

  // Realistic sample stops along the outbound route so the app isn't empty on
  // first open. Remove them anytime from Settings → "Clear sample data".
  const DEFAULT_SEED = [
    { id:'s1', city:'Çorlu',   country:'TR', location:'TEM Otoyolu',  network:'ZES',                plugshareUrl:'https://www.plugshare.com/', datetime:'2026-06-08T07:02', kwh:42.0, pricePerKwh:8.50, totalCost:357,   currency:'TRY', durationMin:28, battStart:18, battEnd:62, powerKw:120, distanceKm:135, notes:'First top-up leaving İstanbul.' },
    { id:'s2', city:'Edirne',  country:'TR', location:'İpsala Yolu',  network:'Trugo',              plugshareUrl:'https://www.plugshare.com/', datetime:'2026-06-08T09:18', kwh:38.0, pricePerKwh:9.00, totalCost:342,   currency:'TRY', durationMin:25, battStart:30, battEnd:70, powerKw:150, distanceKm:145, notes:'Last charge before the Bulgarian border.' },
    { id:'s3', city:'Sofia',   country:'BG', location:'Sopharma Mall',network:'Tesla Supercharger', plugshareUrl:'https://www.plugshare.com/', datetime:'2026-06-08T13:04', kwh:51.2, pricePerKwh:0.79, totalCost:40.45, currency:'BGN', durationMin:32, battStart:15, battEnd:80, powerKw:170, distanceKm:240, notes:'Lunch stop. Fast and cheap.' },
    { id:'s4', city:'Niš',     country:'RS', location:'Delta Planet', network:'Tesla Supercharger', plugshareUrl:'https://www.plugshare.com/', datetime:'2026-06-09T11:20', kwh:44.0, pricePerKwh:33.0, totalCost:1452,  currency:'RSD', durationMin:27, battStart:22, battEnd:75, powerKw:150, distanceKm:175, notes:'' },
    { id:'s5', city:'Belgrade',country:'RS', location:'Ada Mall',     network:'Tesla Supercharger', plugshareUrl:'https://www.plugshare.com/', datetime:'2026-06-09T15:40', kwh:43.5, pricePerKwh:35.0, totalCost:1523,  currency:'RSD', durationMin:26, battStart:25, battEnd:80, powerKw:168, distanceKm:240, notes:'Overnight in Belgrade.' },
    { id:'s6', city:'Pécs',    country:'HU', location:'Árkád',        network:'Ionity',             plugshareUrl:'https://www.plugshare.com/', datetime:'2026-06-10T12:10', kwh:47.0, pricePerKwh:235.0,totalCost:11045, currency:'HUF', durationMin:29, battStart:18, battEnd:78, powerKw:175, distanceKm:320, notes:'Crossed into Hungary.' }
  ];

  function read(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function uid() { return 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  function ensureSeed() {
    if (!localStorage.getItem(SEED_FLAG)) {
      write(ENTRIES_KEY, DEFAULT_SEED);
      write(SEED_FLAG, '1');
    }
  }

  window.TripStore = {
    // ── Entries ──────────────────────────────────────────────────────────
    async list() {
      ensureSeed();
      return read(ENTRIES_KEY, []);
    },
    async save(entry) {
      const all = read(ENTRIES_KEY, []);
      if (entry.id) {
        const i = all.findIndex(e => e.id === entry.id);
        if (i >= 0) all[i] = entry; else all.push(entry);
      } else {
        entry.id = uid();
        all.push(entry);
      }
      write(ENTRIES_KEY, all);
      return entry;
    },
    async remove(id) {
      write(ENTRIES_KEY, read(ENTRIES_KEY, []).filter(e => e.id !== id));
    },

    // ── Exchange rates (local units per 1 EUR) ─────────────────────────────
    async getRates() {
      return Object.assign({}, DEFAULT_RATES, read(RATES_KEY, {}));
    },
    async setRates(rates) {
      write(RATES_KEY, rates);
      return rates;
    },

    // ── Maintenance ────────────────────────────────────────────────────────
    async clearAll() {
      write(ENTRIES_KEY, []);
      write(SEED_FLAG, '1'); // prevent sample data from re-seeding after a clear
    },
    async resetSample() {
      write(ENTRIES_KEY, DEFAULT_SEED.map(e => Object.assign({}, e)));
      write(SEED_FLAG, '1');
    }
  };
})();
