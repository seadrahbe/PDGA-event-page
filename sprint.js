
// FEATURED EVENTS + MAPS + LOGO DISPLAY SECTION (Seadrah)

document.addEventListener('DOMContentLoaded', function () {

  const scrollContainer = document.querySelector('.featured-scroll-container');
  const emptyDiv = document.querySelector('#featured_events');
  if (!scrollContainer || !emptyDiv) return;
  const hasFeatured = scrollContainer.querySelector('.featured-tile') !== null;
  if (!hasFeatured) {
    emptyDiv.style.display = 'none';
  } else {
    emptyDiv.style.display = 'block';
  }
  
  const mapContainer = document.querySelector('.map');
  const courseMap = document.querySelector('.course');
  
    if (courseMap.src === "") {
      courseMap.src = "https://operaparallele.org/wp-content/uploads/2023/09/Placeholder_Image.png"
  }
  
  if (courseMap.src === "https://operaparallele.org/wp-content/uploads/2023/09/Placeholder_Image.png" || coursemap.src === "") {
     mapContainer.style.display = 'none';
  } else {
     mapContainer.style.display = 'block';
  }

  const logo = document.querySelector('#event_logo');
  const header = document.querySelector('#event_header');
  
  if (logo.src === "") {
      logo.src = "https://datastory.greenriverdev.com/SDEV280/image/placeholder_logo.png";
  }
  
  if (logo.src === "https://datastory.greenriverdev.com/SDEV280/image/placeholder_logo.png" || logo.src === "../image/placeholder_logo.png" || logo.src === "") {
      logo.style.display = 'none';
      header.style.textAlign = 'center';
      console.log("none logo");
  } else {
      logo.style.display = 'block';
      header.style.textAlign = 'left';
      console.log('block logo');
  }
  
});

// end of featured/maps/logo !




document.addEventListener("DOMContentLoaded", function () {
  // === LeaderBoard Toggle ===
  const toggleHeader = document.getElementById("toggleTable");
  const tableBody = document.getElementById("tableBody");
  tableBody.style.display = "none";

  toggleHeader.addEventListener("click", function () {
    tableBody.style.display =
      tableBody.style.display === "none" || tableBody.style.display === ""
        ? "table-row-group"
        : "none";
  });

  // === Past Events Toggle ===
  const togglePast = document.getElementById("togglePast");
  const pastBody = document.getElementById("pastBody");
  pastBody.style.display = "none";

  togglePast.addEventListener("click", function () {
    pastBody.style.display =
      pastBody.style.display === "none" || pastBody.style.display === ""
        ? "table-row-group"
        : "none";
  });
});

// header js 
// 3 bar additonal button
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.menu-toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', e => {
      const wrapper = e.target.closest('.menu-wrapper');
      const isOpen = wrapper.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  // close when clicking outside
  document.addEventListener('click', e => {
    document.querySelectorAll('.menu-wrapper.active').forEach(menu => {
      if (!menu.contains(e.target)) menu.classList.remove('active');
    });
  });

  // close with Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.menu-wrapper.active').forEach(menu => menu.classList.remove('active'));
    }
  });
});


// search bar 
// Search toggle
document.addEventListener("DOMContentLoaded", () => {
  const searchToggle = document.getElementById("searchToggle");
  const searchBox = document.querySelector(".search-box");

  if (searchToggle && searchBox) {
    searchToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      searchBox.classList.toggle("active");
      if (searchBox.classList.contains("active")) {
        searchBox.querySelector("input").focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (!searchBox.contains(e.target) && !searchToggle.contains(e.target)) {
        searchBox.classList.remove("active");
      }
    });
  }
});

// COLLAPSIBLE TABLES

document.addEventListener('DOMContentLoaded', () => {
  // All target tables (add more ids if you create more later)
  const tables = document.querySelectorAll(
    '#events, #usdgc_champions,#series_champions, #past, #winner_counts, .dbwinnertable table'
  );

  tables.forEach(table => {
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    if (!thead || !tbody) return;

    // 1) Wrap in scroll container once
    const alreadyWrapped = table.closest('.table-scroll, .tableWrap');
    if (!alreadyWrapped) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }

    // 2) Header is a toggle target
    thead.style.cursor = 'pointer';
    thead.setAttribute('tabindex', '0');
    thead.style.position = 'relative';

    // 3) Add arrow once
    let arrow = thead.querySelector('.outside-arrow');
    if (!arrow) {
      arrow = document.createElement('div');
      arrow.className = 'outside-arrow';
      thead.appendChild(arrow);
    }

    // 4) Start state: open by default, or closed if table has .start-closed
    function setOpen(open) {
      tbody.style.display = open ? 'table-row-group' : 'none';
      table.classList.toggle('open', open);
    }
    setOpen(!table.classList.contains('start-closed'));

    // 5) Toggle function
    const toggle = () => setOpen(!(tbody.style.display !== 'none'));

    // Click/keyboard on header (and arrow)
    thead.addEventListener('click', toggle);
    arrow.addEventListener('click', e => { e.stopPropagation(); toggle(); });
    thead.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  // 6) Optional external toggles: any .table-toggle that sits right before a table
  document.querySelectorAll('.table-toggle').forEach(toggleEl => {
    const table = toggleEl.nextElementSibling?.matches?.('table, .table-scroll')
      ? (toggleEl.nextElementSibling.matches('table')
        ? toggleEl.nextElementSibling
        : toggleEl.nextElementSibling.querySelector('table'))
      : null;
    if (!table) return;

    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    const setOpen = (open) => {
      tbody.style.display = open ? 'table-row-group' : 'none';
      table.classList.toggle('open', open);
      toggleEl.classList.toggle('active', open);
    };

    const isOpen = table.classList.contains('open') || tbody.style.display !== 'none';
    setOpen(isOpen);

    toggleEl.addEventListener('click', () => setOpen(!(tbody.style.display !== 'none')));
  });
});


// nadia - scalable tables
// ---------- tiny DOM + safe-HTML helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

// Allow columns to opt into innerHTML (for links)
function setCell(td, value, { html } = {}) {
  if (html) td.innerHTML = value ?? '';
  else td.textContent = value ?? '';
}

// ---------- CSV loader ----------
function loadCSV(path, { header = true } = {}) {
  return new Promise((resolve, reject) => {
    Papa.parse(path, {
      download: true,
      header,
      skipEmptyLines: true,
      complete: (res) => resolve(res.data),
      error: reject
    });
  });
}

// ---------- generic table renderer ----------
/**
 * columns: [{ key, label, format?:(v,row)=>string, html?:boolean }]
 */
function renderTable(tableId, columns, rows) {
  const table = document.getElementById(tableId);
  if (!table) return console.warn('Table not found:', tableId);

  // THEAD
  const thead = table.tHead || table.createTHead();
  thead.innerHTML = '';
  const trh = thead.insertRow();
  for (const col of columns) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = col.label;
    trh.appendChild(th);
  }

  // TBODY
  let tbody = table.tBodies[0];
  if (!tbody) tbody = table.createTBody();
  tbody.innerHTML = '';

  for (const row of rows) {
    const tr = document.createElement('tr');
    for (const col of columns) {
      const td = document.createElement('td');
      const raw = row[col.key];
      const val = col.format ? col.format(raw, row) : raw;
      setCell(td, val, { html: col.html });
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

// ---------- formatters ----------
const fmtMoney = n => (n == null || isNaN(n)) ? '' : `$${Number(n).toLocaleString()}`;
const fmtYear = s => s ? String(s).slice(0, 4) : '';
const cleanNumber = s => {
  if (s == null) return NaN;
  const num = String(s).replace(/[\$,]/g, '').trim();
  const v = Number(num);
  return Number.isFinite(v) ? v : NaN;
};

// ---------- BUILD: USDGC Events with Total Purse ----------
async function buildUsdgcEventsTable() {
  // paths are from /SDEV280/USDGC/page.html → go up one level to /data
  const events = await loadCSV('../data/events.csv');
  const results = await loadCSV('../data/event_results.csv');

  // Identify USDGC events by name (covers “United States Disc Golf Championship” and “USDGC”)
  const isUsdgc = (name = '') => /united states disc golf championship|^usdgc\b/i.test(String(name));

  const usdgcEvents = events.filter(e => isUsdgc(e.event_name));
  const usdgcIds = new Set(usdgcEvents.map(e => String(e.pdga_event_id)));

  // Sum total purse per event from event_results.csv (sum of `cash`)
  const purseByEvent = {};
  for (const r of results) {
    const id = String(r.pdga_event_id || '');
    if (!usdgcIds.has(id)) continue;
    const cash = cleanNumber(r.cash);
    if (!isNaN(cash)) {
      purseByEvent[id] = (purseByEvent[id] || 0) + cash;
    }
  }

  // Build rows for render
  const rows = usdgcEvents.map(e => {
    const id = String(e.pdga_event_id || '');
    const purseFromResults = purseByEvent[id];

    // Fallbacks if results had no cash values (sometimes CSVs are sparse)
    const fallbackCols = ['purse', 'pro_purse', 'total_purse', 'payout']; // try common names
    let fallback = null;
    for (const k of fallbackCols) {
      if (e[k] != null && e[k] !== '') {
        const n = cleanNumber(e[k]);
        if (!isNaN(n)) { fallback = n; break; }
      }
    }
    const purse = (purseFromResults ?? fallback) ?? null;

    const eventUrl = id ? `https://www.pdga.com/tour/event/${id}` : null;

    return {
      year: e.start_date ? e.start_date.slice(0, 4) : '',
      event_name: e.event_name || 'USDGC',
      dates: e.start_date && e.end_date ? `${e.start_date} – ${e.end_date}` : (e.start_date || ''),
      purse_num: purse, // keep numeric for sorting
      purse_fmt: purse == null ? '—' : fmtMoney(purse),
      link_html: eventUrl ? `<a href="${eventUrl}" target="_blank" rel="noopener">Link</a>` : ''
    };
  })
    // remove duplicates if any, then sort by year desc
    .filter((r, i, arr) => arr.findIndex(x => x.year === r.year) === i)
    .sort((a, b) => Number(b.year) - Number(a.year));

  renderTable('events', [
    { key: 'year', label: 'Year' },
    { key: 'event_name', label: 'Event' },
    { key: 'dates', label: 'Dates' },
    { key: 'purse_fmt', label: 'Total Purse' },
    { key: 'link_html', label: 'PDGA', html: true },
  ], rows);
  initCollapsibleArrows('#events');
}

// ---------- BUILD: USDGC Champions (place = 1, 1999–2025) ----------
async function buildUsdgcChampions() {
  // CSV paths relative to this page
  const events = await loadCSV('../data/events.csv');
  const results = await loadCSV('../data/event_results.csv');
  const players = await loadCSV('../data/players.csv');

  const isUsdgc = (name = '') =>
    /united states disc golf championship|^usdgc\b/i.test(String(name));

  // 1) Find USDGC event ids and year
  const usdgcById = new Map(); // id -> year
  for (const e of events) {
    if (!isUsdgc(e.event_name)) continue;

    let year = null;
    if (e.start_date) {
      const y = new Date(e.start_date).getFullYear();
      if (!Number.isNaN(y)) year = y;
    }
    if (!year && e.year && !Number.isNaN(parseInt(e.year))) year = parseInt(e.year);

    const id = String(e.pdga_event_id || '').trim();
    if (id && year >= 1999 && year <= 2025) usdgcById.set(id, year);
  }

  // 2) player lookups
  const byPdga = new Map(); // "12345" -> {first,last,full}
  const byId = new Map(); // "player_id" -> {first,last,full,pdga}
  for (const p of players) {
    const first = String(p.first_name ?? '').trim();
    const last = String(p.last_name ?? '').trim();
    const full = String(p.player_name ?? '').trim() || [first, last].filter(Boolean).join(' ');
    const pdga = String(p.pdga_number ?? '').trim();
    const pid = String(p.player_id ?? '').trim();
    const v = { first, last, full, pdga };
    if (pdga) byPdga.set(pdga, v);
    if (pid) byId.set(pid, v);
  }

  // 3) winners (place=1) from event_results for those event ids
  const champsAll = [];
  for (const r of results) {
    const eventId = String(r.pdga_event_id ?? '').trim();
    if (!usdgcById.has(eventId)) continue;

    // Keep MPO only; remove this block if you want all divisions
    const div = String(r.division ?? '').toUpperCase();
    if (div && div !== 'MPO') continue;

    const place = String(r.place ?? '').toLowerCase().trim();
    if (!(place === '1' || place === '1st')) continue;

    const pdgaNum = String(r.pdga_number ?? '').trim();
    const playerId = String(r.player_id ?? '').trim();

    let name = '';
    if (pdgaNum && byPdga.has(pdgaNum)) {
      const p = byPdga.get(pdgaNum);
      name = p.full || [p.first, p.last].filter(Boolean).join(' ');
    } else if (playerId && byId.has(playerId)) {
      const p = byId.get(playerId);
      name = p.full || [p.first, p.last].filter(Boolean).join(' ');
    } else {
      name = String(r.player_name ?? '').trim() || '(name unavailable)';
    }

    // totals/payouts vary by CSV schema—try common field names
    const total = String(r.total_score ?? r.total ?? r.score ?? '').trim();
    const cash = cleanNumber(r.cash ?? r.payout);

    champsAll.push({
      year: usdgcById.get(eventId),
      winner: name,
      pdga: pdgaNum || (byId.get(playerId)?.pdga ?? ''),
      total: total,
      cash_fmt: (cash == null || Number.isNaN(cash)) ? '' : fmtMoney(cash),
      pdga_link_html: eventId ? `<a href="https://www.pdga.com/tour/event/${eventId}" target="_blank" rel="noopener">Link</a>` : ''
    });
  }

  // 4) one row per year (keep first if duplicates), sorted asc
  champsAll.sort((a, b) => a.year - b.year);
  const seen = new Set();
  const champs = champsAll.filter(x => (seen.has(x.year) ? false : (seen.add(x.year), true)));

  // 5) render to <table id="usdgc_champions">
  renderTable('usdgc_champions', [
    { key: 'year', label: 'Year' },
    { key: 'winner', label: 'Winner' },
    { key: 'pdga', label: 'PDGA #' },
    { key: 'total', label: 'Total' },
    { key: 'cash_fmt', label: 'Cash' },
    { key: 'pdga_link_html', label: 'PDGA', html: true },
  ], champs);
  initCollapsibleArrows('#usdgc_champions');
}
// Re-initialize collapsible arrows after tables are built
// Re-initialize collapsible arrows after tables are built
function initCollapsibleArrows(tableSelector) {
  const table = document.querySelector(tableSelector);
  if (!table) return;

  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  if (!thead || !tbody) return;

  // DON'T wrap in scroll container - keep it simple like TerRon tables

  // Header is a toggle target
  thead.style.cursor = 'pointer';
  thead.setAttribute('tabindex', '0');
  thead.style.position = 'relative';

  // Add arrow if not exists
  let arrow = thead.querySelector('.outside-arrow');
  if (!arrow) {
    arrow = document.createElement('div');
    arrow.className = 'outside-arrow';
    thead.appendChild(arrow);
  }

  // Start open
  tbody.style.display = 'table-row-group';
  table.classList.add('open');

  // Toggle function
  const toggle = () => {
    const isOpen = tbody.style.display !== 'none';
    tbody.style.display = isOpen ? 'none' : 'table-row-group';
    table.classList.toggle('open', !isOpen);
  };

  // Remove old listeners and add new ones
  const newThead = thead.cloneNode(true);
  thead.parentNode.replaceChild(newThead, thead);

  const newArrow = newThead.querySelector('.outside-arrow');
  newThead.addEventListener('click', toggle);
  newArrow.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
  newThead.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
}

// ---------- BUILD: All Events ----------
// ---- All Events: simple dashboard (Enter-to-search + 6 per page) ----
const ALL_EVENTS_PAGE_SIZE = 6;
let allEventsRows = [];
let allEventsState = { q: '', page: 1 };

async function buildAllEventsTable() {
  const msgEl = document.getElementById('all_events_msg');
  const rangeEl = document.getElementById('all_events_range');
  const qInput = document.getElementById('all_events_q');
  const prevBtn = document.getElementById('all_events_prev');
  const nextBtn = document.getElementById('all_events_next');
  const pageInfo = document.getElementById('all_events_pageinfo');

  try {
    const events = await loadCSV('../data/events.csv');

    allEventsRows = events
      .filter(e => e.event_name)
      .map(e => {
        const id = String(e.pdga_event_id || '').trim();
        const url = id ? `https://www.pdga.com/tour/event/${id}` : '';
        return {
          year: (e.start_date ? e.start_date.slice(0, 4) : (e.year || '')).toString(),
          event_name: e.event_name || '',
          city: e.city || '',
          state: e.state || '',
          country: e.country || '',
          tier: (e.tier || '').toUpperCase(),
          link_html: url ? `<a href="${url}" target="_blank" rel="noopener">Link</a>` : ''
        };
      })
      .sort((a, b) => Number(b.year) - Number(a.year));
  } catch (err) {
    console.error(err);
    if (msgEl) msgEl.textContent = 'Failed to load events. Check your CSV path.';
    return;
  }

  function applyFilter(rows, q) {
    if (!q) return rows;
    const s = q.toLowerCase();
    return rows.filter(r =>
      r.event_name.toLowerCase().includes(s) ||
      r.city.toLowerCase().includes(s) ||
      r.state.toLowerCase().includes(s) ||
      r.country.toLowerCase().includes(s) ||
      r.tier.toLowerCase().includes(s) ||
      String(r.year).includes(s)
    );
  }

  function render() {
    const filtered = applyFilter(allEventsRows, allEventsState.q);
    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / ALL_EVENTS_PAGE_SIZE));
    if (allEventsState.page > pages) allEventsState.page = pages;

    const start = (allEventsState.page - 1) * ALL_EVENTS_PAGE_SIZE;
    const end = Math.min(start + ALL_EVENTS_PAGE_SIZE, total);
    const slice = filtered.slice(start, end);

    renderTable('all_events', [
      { key: 'year', label: 'Year' },
      { key: 'event_name', label: 'Event' },
      { key: 'city', label: 'City' },
      { key: 'state', label: 'State' },
      { key: 'country', label: 'Country' },
      { key: 'tier', label: 'Tier' },
      { key: 'link_html', label: 'PDGA', html: true },
    ], slice);

    if (rangeEl) rangeEl.textContent = total ? `Showing ${start + 1}–${end} of ${total}` : 'No results';
    pageInfo.textContent = `Page ${allEventsState.page} / ${pages}`;
    prevBtn.disabled = allEventsState.page <= 1;
    nextBtn.disabled = allEventsState.page >= pages;
  }

  // Search on Enter
  qInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      allEventsState.q = e.target.value.trim();
      allEventsState.page = 1;
      render();
    }
  });

  // Prev/Next
  prevBtn.addEventListener('click', () => { allEventsState.page--; render(); });
  nextBtn.addEventListener('click', () => { allEventsState.page++; render(); });

  render(); // first draw
}



/* This code overrides the php and applies usdgc csv on all series event table 
/* ---------- DOMContentLoaded handler ----------
document.addEventListener('DOMContentLoaded', () => {
  buildUsdgcEventsTable();   // events table
  buildUsdgcChampions();     //champions table
  buildAllEventsTable();      //all events (now the dashboard)
});
*/

document.addEventListener('DOMContentLoaded', () => {
  const isUsdgcPage = document.body.classList.contains('usdgc-page');
  if (!isUsdgcPage) {
    console.log('Skipping USDGC CSV builders on this page.');
    return;
  }

  buildUsdgcEventsTable();   // events table (USDGC)
  buildUsdgcChampions();     // champions table (USDGC)
  buildAllEventsTable();     // all events dashboard (USDGC)
});


// Graphs: parameterized builder so the same function can create charts for any event set
async function buildEventCharts(options = {}) {
  const {
    eventsCsv = '../data/events.csv',
    resultsCsv = '../data/event_results.csv',
    eventMatcher = (e) => false, // function(eventRow) => boolean
    cashDomId = 'cashChart',
    scoreDomId = 'ratingChart',
    title = 'Event'
  } = options;

  try {
    const [eventResults, events] = await Promise.all([
      loadCSV(resultsCsv),
      loadCSV(eventsCsv)
    ]);

    const matchedIds = new Set();
    const eventYear = {};
    events.forEach(e => {
      if (!e) return;
      const id = String(e.pdga_event_id || '').trim();
      if (!id) return;
      if (eventMatcher(e)) matchedIds.add(id);
      const sd = e.start_date || '';
      const year = sd.length >= 4 ? sd.substring(0, 4) : (e.year || 'Unknown');
      eventYear[id] = year;
    });

    // Fallbacks: try multiple, progressively looser matching strategies using `options.title`
    if (matchedIds.size === 0 && options.title) {
      try {
        const titleClean = String(options.title || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
        const rawTokens = titleClean.split(/\s+/).filter(Boolean);
        const tokens = rawTokens.filter(t => t.length >= 2); // allow e.g. 'dgc'

        // 1) Majority-token match (prefer this)
        if (tokens.length > 0) {
          const minMatches = Math.max(1, Math.ceil(tokens.length / 2));
          events.forEach(e => {
            if (!e) return;
            const id = String(e.pdga_event_id || '').trim();
            if (!id) return;
            const name = String(e.event_name || '').toLowerCase();
            let matchCount = 0;
            for (const tok of tokens) {
              if (name.includes(tok)) matchCount++;
              // special-case common abbreviations and variations
              if (tok === 'dgc' && (name.includes('disc golf') || name.includes('championship'))) matchCount++;
              if (tok === 'dgpt' && name.includes('pro tour')) matchCount++;
              if (tok === 'usdgc' && (name.includes('united states') || name.includes('usdgc'))) matchCount++;
            }
            if (matchCount >= minMatches) matchedIds.add(id);
          });
          console.info('buildEventCharts: token-fallback', { title: options.title, tokens, minMatches, matchedCount: matchedIds.size });
        }

        // 2) Longest-token heuristic: match events that contain the longest token
        if (matchedIds.size === 0 && rawTokens.length > 0) {
          const sorted = rawTokens.slice().sort((a, b) => b.length - a.length);
          const longest = sorted.find(t => t.length >= 3);
          if (longest) {
            events.forEach(e => {
              if (!e) return;
              const id = String(e.pdga_event_id || '').trim();
              if (!id) return;
              const name = String(e.event_name || '').toLowerCase();
              if (name.includes(longest)) matchedIds.add(id);
            });
            console.info('buildEventCharts: longest-token fallback', { longest, matchedCount: matchedIds.size });
          }
        }

        // 3) alt_name / code / other fields exact-includes of full cleaned title
        if (matchedIds.size === 0) {
          const full = titleClean;
          if (full.length > 0) {
            events.forEach(e => {
              if (!e) return;
              const id = String(e.pdga_event_id || '').trim();
              if (!id) return;
              const name = String(e.event_name || '').toLowerCase();
              const alt = String(e.alt_name || '').toLowerCase();
              const code = String(e.code || '').toLowerCase();
              if (name.includes(full) || alt.includes(full) || code.includes(full)) matchedIds.add(id);
            });
            console.info('buildEventCharts: alt_name/code fallback', { full, matchedCount: matchedIds.size });
          }
        }

        // 4) Any-token OR-match: if still nothing, include events that match any token (broad, last-resort)
        if (matchedIds.size === 0 && tokens.length > 0) {
          events.forEach(e => {
            if (!e) return;
            const id = String(e.pdga_event_id || '').trim();
            if (!id) return;
            const name = String(e.event_name || '').toLowerCase();
            for (const tok of tokens) {
              if (name.includes(tok)) { matchedIds.add(id); break; }
            }
          });
          console.info('buildEventCharts: any-token fallback', { tokens, matchedCount: matchedIds.size });
        }
      } catch (err) {
        console.warn('Fallback token matching failed:', err);
      }
    }

    const perYearCash = {};
    const perYearScoreSum = {};
    const perYearCount = {};
    const perYearPlayers = {}; // will hold Sets of unique player identifiers per year

    // Initialize years from matched event IDs so we show years even when results rows are missing
    if (matchedIds.size > 0) {
      matchedIds.forEach(id => {
        const y = eventYear[id] || 'Unknown';
        if (y && y !== 'Unknown') {
          perYearCash[y] = perYearCash[y] || 0;
          perYearScoreSum[y] = perYearScoreSum[y] || 0;
          perYearCount[y] = perYearCount[y] || 0;
          perYearPlayers[y] = perYearPlayers[y] || new Set();
        }
      });
    }

    // Debug: log which IDs and years we matched (helps explain missing years)
    try {
      const matchedArray = Array.from(matchedIds);
      if (matchedArray.length === 0) {
        console.info('buildEventCharts: no matched event IDs for', title);
      } else {
        console.info('buildEventCharts: matched IDs for', title, matchedArray.slice(0, 50));
        const idYears = matchedArray.reduce((acc, id) => { acc[id] = eventYear[id] || 'Unknown'; return acc; }, {});
        console.info('buildEventCharts: matched ID -> year mapping (sample):', idYears);
      }
    } catch (e) {
      /* ignore logging errors */
    }

    (eventResults || []).forEach(row => {
      if (!row) return;
      const evId = String(row.pdga_event_id || '').trim();
      if (!evId) return;
      if (!matchedIds.has(evId)) return;
      const year = eventYear[evId] || 'Unknown';

      // Prefer a variety of fields for payout since CSVs can use different names
      const cashCandidates = row.cash ?? row.payout ?? row.payout_total ?? row.payouts ?? row.prize ?? row.prize_money ?? row.purse;
      const cash = cleanNumber(cashCandidates);
      const totalScore = parseFloat(row.total_score);
      // player identifier: prefer pdga_number, fall back to player_id, then player_name
      const playerKey = String(row.pdga_number || row.player_id || row.player_name || '').trim();

      perYearCash[year] = (perYearCash[year] || 0) + (isNaN(cash) ? 0 : cash);
      if (!isNaN(totalScore)) {
        perYearScoreSum[year] = (perYearScoreSum[year] || 0) + totalScore;
        perYearCount[year] = (perYearCount[year] || 0) + 1;
      }
      if (playerKey) {
        perYearPlayers[year] = perYearPlayers[year] || new Set();
        perYearPlayers[year].add(playerKey);
      }
    });

    // If per-year cash totals are all zero (or missing) try event-level fallbacks from events.csv
    try {
      const anyNonZero = Object.values(perYearCash).some(v => v && v > 0);
      if (!anyNonZero && matchedIds.size > 0) {
        // Build a lookup for events by id for quick access
        const eventsById = new Map();
        (events || []).forEach(e => { if (e && e.pdga_event_id) eventsById.set(String(e.pdga_event_id).trim(), e); });

        const fallbackCols = ['purse', 'pro_purse', 'total_purse', 'payout', 'prize', 'prize_money'];
        matchedIds.forEach(id => {
          const ev = eventsById.get(id);
          if (!ev) return;
          const y = eventYear[id] || 'Unknown';
          if (!y || y === 'Unknown') return;

          // try any fallback columns on the event row
          let fallback = 0;
          for (const k of fallbackCols) {
            if (ev[k] != null && String(ev[k]).trim() !== '') {
              const n = cleanNumber(ev[k]);
              if (!isNaN(n) && n > 0) { fallback = n; break; }
            }
          }
          if (fallback > 0) {
            perYearCash[y] = (perYearCash[y] || 0) + fallback;
            console.info('buildEventCharts: used event-level fallback purse for', id, 'year', y, 'amount', fallback);
          }
        });
      }
    } catch (e) {
      console.warn('buildEventCharts: event-level fallback failed', e);
    }

    // Determine years from matched events/results - INCLUDE all years even if no data
    const candidateYears = new Set();
    matchedIds.forEach(id => {
      const y = String(eventYear[id] || '').trim();
      if (/^\d{4}$/.test(y)) candidateYears.add(y);
    });
    // Defensive: include any numeric keys already present in perYearCash
    Object.keys(perYearCash).forEach(k => { if (/^\d{4}$/.test(String(k).trim())) candidateYears.add(String(k).trim()); });

    const sortedCandidates = Array.from(candidateYears).map(Number).filter(n => !Number.isNaN(n)).sort((a, b) => a - b).map(String);

    // Fill in all years between min and max (even empty years)
    if (sortedCandidates.length > 0) {
      const minYear = Math.min(...sortedCandidates.map(Number));
      const maxYear = Math.max(...sortedCandidates.map(Number));
      const allYears = [];
      for (let y = minYear; y <= maxYear; y++) {
        allYears.push(String(y));
      }
      // Make sure data objects have entries for all years
      for (const y of allYears) {
        if (!(y in perYearCash)) perYearCash[y] = 0;
        if (!(y in perYearScoreSum)) perYearScoreSum[y] = 0;
        if (!(y in perYearCount)) perYearCount[y] = 0;
        if (!(y in perYearPlayers)) perYearPlayers[y] = new Set();
      }
      var years = allYears;
    } else {
      var years = sortedCandidates;
    }

    if (years.length === 0) {
      console.info('buildEventCharts: no years found for', title, ' — nothing to plot');
      return; // nothing to render
    }

    const purseByYear = years.map(y => Math.round(perYearCash[y] || 0));
    const avgTotalScoreByYear = years.map(y => {
      const sum = perYearScoreSum[y] || 0;
      const cnt = perYearCount[y] || 0;
      return cnt > 0 ? +(sum / cnt).toFixed(2) : null;
    });

    // Players by year (unique counts)
    const playersByYear = years.map(y => (perYearPlayers[y] ? perYearPlayers[y].size : 0));

    // If ECharts isn't loaded yet (script order may vary), wait a short time for it to appear
    if (!window.echarts) {
      console.warn('ECharts not loaded yet; waiting briefly for script to load...');
      await new Promise(resolve => {
        const start = Date.now();
        const iv = setInterval(() => {
          if (window.echarts) { clearInterval(iv); resolve(); }
          else if (Date.now() - start > 2000) { clearInterval(iv); resolve(); }
        }, 100);
      });
    }

    if (window.echarts) {
      // Cash bar chart
      const cashDom = document.getElementById(cashDomId);
      if (cashDom) {
        const cashChart = echarts.init(cashDom);
        const cashOption = {
          grid: { top: 60, right: 30, bottom: 60, left: 70 },
          tooltip: {
            trigger: 'axis',
            formatter: params => {
              const v = params[0]?.data ?? 0;
              return `${params[0].axisValue}<br/>Total Purse: $${Number(v).toLocaleString()}`;
            }
          },
          xAxis: { type: 'category', data: years, axisLabel: { margin: 10 } },
          yAxis: { type: 'value', name: 'Total Purse ($)', nameGap: 30, axisLabel: { margin: 10 } },
          series: [{ type: 'bar', data: purseByYear, itemStyle: { color: 'rgba(27,119,200,0.8)' } }]
        };
        cashChart.setOption(cashOption);
      }

      // Avg total score line chart
      const scoreDom = document.getElementById(scoreDomId);
      if (scoreDom) {
        const scoreChart = echarts.init(scoreDom);
        const scoreOption = {
          grid: { top: 60, right: 30, bottom: 60, left: 70 },
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: years, axisLabel: { margin: 10 } },
          yAxis: { type: 'value', name: 'Average Total Score', nameGap: 30, axisLabel: { margin: 10 } },
          series: [{ type: 'line', data: avgTotalScoreByYear, smooth: true, areaStyle: { color: 'rgba(26,111,168,0.15)' }, lineStyle: { color: 'rgba(54,162,235,1)' } }]
        };
        scoreChart.setOption(scoreOption);
      }
      // Players bar chart
      if (options.playersDomId || document.getElementById('playersChart')) {
        const playersDom = document.getElementById(options.playersDomId || 'playersChart');
        if (playersDom) {
          const playersChart = echarts.init(playersDom);
          const playersOption = {
            grid: { top: 60, right: 30, bottom: 60, left: 70 },
            tooltip: { trigger: 'axis', formatter: p => `${p[0].axisValue}<br/>Players: ${p[0].data}` },
            xAxis: { type: 'category', data: years, axisLabel: { margin: 10 } },
            yAxis: { type: 'value', name: 'Players', nameGap: 30, axisLabel: { margin: 10 } },
            series: [{ type: 'bar', data: playersByYear, itemStyle: { color: 'rgba(27,119,200,0.8)' } }]
          };
          playersChart.setOption(playersOption);
        }
      }

      // Prize money per player average line chart
      const prizePerPlayerByYear = years.map(y => {
        const cash = perYearCash[y] || 0;
        const players = perYearPlayers[y] ? perYearPlayers[y].size : 0;
        return players > 0 ? +(cash / players).toFixed(2) : null;
      });
      if (document.getElementById('prizePerPlayerChart')) {
        const prizePerPlayerDom = document.getElementById('prizePerPlayerChart');
        const prizePerPlayerChart = echarts.init(prizePerPlayerDom);
        const prizePerPlayerOption = {
          grid: { top: 60, right: 30, bottom: 60, left: 70 },
          tooltip: {
            trigger: 'axis',
            formatter: p => `${p[0].axisValue}<br/>Avg Prize/Player: $${Number(p[0].data || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
          },
          xAxis: { type: 'category', data: years, axisLabel: { margin: 10 } },
          yAxis: { type: 'value', name: 'Avg Prize per Player ($)', nameGap: 30, axisLabel: { margin: 10 } },
          series: [{ type: 'line', data: prizePerPlayerByYear, smooth: true, areaStyle: { color: 'rgba(102,204,102,0.15)' }, lineStyle: { color: 'rgba(102,204,102,1)' } }]
        };
        prizePerPlayerChart.setOption(prizePerPlayerOption);
      }

      // Highest round rating per year (replace event count)
      // Scan results for any rating-like fields (e.g., 'rating', 'round_1_rating') and take the maximum per year
      const highestByYear = {};
      (eventResults || []).forEach(row => {
        if (!row) return;
        const evId = String(row.pdga_event_id || '').trim();
        if (!evId) return;
        if (!matchedIds.has(evId)) return;
        const y = (eventYear[evId] || '').toString();
        if (!/^\d{4}$/.test(y)) return;

        // inspect all fields for numeric rating-like values
        for (const k in row) {
          if (!k) continue;
          if (!/rating/i.test(k)) continue;
          const v = cleanNumber(row[k]);
          if (Number.isFinite(v)) {
            highestByYear[y] = Math.max(highestByYear[y] || -Infinity, v);
          }
        }
      });

      const highestRoundRatingByYear = years.map(y => {
        const v = highestByYear[y];
        return (v === undefined || v === -Infinity) ? null : +(v);
      });

      if (document.getElementById('highestRoundRatingChart')) {
        const hrDom = document.getElementById('highestRoundRatingChart');
        const hrChart = echarts.init(hrDom);
        const hrOption = {
          grid: { top: 60, right: 30, bottom: 60, left: 70 },
          tooltip: { trigger: 'axis', formatter: p => `${p[0].axisValue}<br/>Highest Round Rating: ${p[0].data ?? 'N/A'}` },
          xAxis: { type: 'category', data: years, axisLabel: { margin: 10 } },
          yAxis: { type: 'value', name: 'Highest Round Rating', nameGap: 30, axisLabel: { margin: 10 } },
          series: [{ type: 'line', data: highestRoundRatingByYear, smooth: true, itemStyle: { color: 'rgba(153,102,255,0.9)' }, lineStyle: { width: 2 } }]
        };
        hrChart.setOption(hrOption);
      }
    } else {
      console.warn('ECharts not loaded; charts cannot be rendered.');
    }

    console.log(`${title} year aggregates computed for years:`, years.length, 'playersByYear:', playersByYear || []);
  } catch (err) {
    console.error('Error building event charts', err);
  }
}

// When DOM is ready, auto-detect event pages or fall back to USDGC
document.addEventListener('DOMContentLoaded', function () {
  try {
    const evTitleEl = document.getElementById('event_title');
    if (evTitleEl && evTitleEl.textContent && evTitleEl.textContent.trim().length > 0) {
      // Use the visible event title to match events in CSV (case-insensitive, partial match)
      const raw = evTitleEl.textContent.trim().replace(/\s*[-–].*$/, '').trim();
      const needle = raw.toLowerCase();
      buildEventCharts({
        eventMatcher: (e) => String(e.event_name || '').toLowerCase().includes(needle),
        cashDomId: 'cashChart',
        scoreDomId: 'ratingChart',
        title: raw
      });
      return;
    }
  } catch (err) {
    console.warn('Auto-detect event title failed:', err);
  }

  // Fallback: USDGC charts (keeps previous behavior)
  buildEventCharts({
    eventMatcher: (e) => /united states disc golf championship|^usdgc\\b/i.test(String(e.event_name || '')),
    cashDomId: 'cashChart',
    scoreDomId: 'ratingChart',
    title: 'USDGC'
  });
});

// ✅ Auto-resize handler
window.addEventListener('resize', function () {
    if (window.echarts) {
    echarts.getInstanceByDom(document.getElementById('cashChart'))?.resize();
    echarts.getInstanceByDom(document.getElementById('ratingChart'))?.resize();
    echarts.getInstanceByDom(document.getElementById('playersChart'))?.resize();
    echarts.getInstanceByDom(document.getElementById('prizePerPlayerChart'))?.resize();
    echarts.getInstanceByDom(document.getElementById('highestRoundRatingChart'))?.resize();
  }
});




