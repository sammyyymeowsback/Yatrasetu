/**
 * YatraSetu — sw.js
 * Service Worker: cache-first for static assets, network-first for
 * API routes, and offline fallback for navigations.
 *
 * Registered from base.html.
 * Install: caches all static shell assets.
 * Activate: clears old caches.
 * Fetch:
 *   - Static assets (/static/) → cache-first
 *   - Emergency directory (/safety/emergency-directory) → cache-first (offline critical)
 *   - API routes (/api/) → network-first with cache fallback
 *   - Page navigations → network-first with offline.html fallback
 */

'use strict';

var CACHE_VERSION = 'ys-v23';
var STATIC_CACHE  = CACHE_VERSION + '-static';
var DATA_CACHE    = CACHE_VERSION + '-data';

/* Assets to pre-cache on install */
var STATIC_ASSETS = [
  '/',
  '/explore',
  '/map',
  '/safety',
  '/plan',
  '/my-yatra',
  '/discover',
  '/submit',
  '/tourist/login',
  '/tourist/register',
  '/static/css/main.css',
  '/static/css/heritage.css',
  '/static/css/responsive.css',
  '/static/css/map.css',
  '/static/js/app.js',
  '/static/js/cards.js',
  '/static/js/map.js',
  '/static/js/itinerary.js',
  '/static/js/safety.js',
  '/static/js/submissions.js',
  '/static/manifest.json',
  '/static/img/logo_emblem.svg',
  '/static/img/yatrasetu_emblem_transparent.png',
  '/static/assets/favicon-32x32.png',
  '/static/assets/favicon-16x16.png',
  '/static/assets/apple-touch-icon.png',
  '/static/assets/icon-192.png',
  '/static/assets/icon-512.png',
  '/static/favicon.ico',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
];

/* API / data endpoints to cache for offline graceful degradation */
var PRECACHE_DATA = [
  '/safety/emergency-directory',
  '/safety/advisories',
];

/* ── Install ─────────────────────────────────────────────────────── */
self.addEventListener('install', function (event) {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(function (cache) {
        return cache.addAll(STATIC_ASSETS.map(function (url) {
          return new Request(url, { cache: 'reload' });
        })).catch(function (err) {
          console.warn('[SW] Some static assets failed to pre-cache:', err);
        });
      }),
      caches.open(DATA_CACHE).then(function (cache) {
        return Promise.all(PRECACHE_DATA.map(function (url) {
          return fetch(url)
            .then(function (resp) {
              if (resp.ok) return cache.put(url, resp);
            })
            .catch(function () {}); /* Non-fatal if offline during install */
        }));
      })
    ]).then(function () {
      return self.skipWaiting();
    })
  );
});

/* ── Activate ────────────────────────────────────────────────────── */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          /* Delete any cache not belonging to current version */
          return key.startsWith('ys-') && key !== STATIC_CACHE && key !== DATA_CACHE;
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* ── Fetch ───────────────────────────────────────────────────────── */
self.addEventListener('fetch', function (event) {
  var req = event.request;
  var url = new URL(req.url);

  /* Only handle GET requests */
  if (req.method !== 'GET') return;

  /* Skip cross-origin requests except Google Fonts */
  if (url.origin !== self.location.origin &&
      !url.hostname.includes('fonts.googleapis.com') &&
      !url.hostname.includes('fonts.gstatic.com')) {
    return;
  }

  /* ── Strategy: Cache-first for static assets ── */
  if (url.pathname.startsWith('/static/') ||
      url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(req).then(function (cached) {
        if (cached) return cached;
        return fetch(req).then(function (resp) {
          if (resp && resp.ok) {
            var clone = resp.clone();
            caches.open(STATIC_CACHE).then(function (cache) {
              cache.put(req, clone);
            });
          }
          return resp;
        });
      })
    );
    return;
  }

  /* ── Strategy: Cache-first for emergency directory (offline critical) ── */
  if (url.pathname === '/safety/emergency-directory' ||
      url.pathname === '/safety/advisories') {
    event.respondWith(
      caches.match(req).then(function (cached) {
        var networkFetch = fetch(req).then(function (resp) {
          if (resp && resp.ok) {
            var clone = resp.clone();
            caches.open(DATA_CACHE).then(function (c) { c.put(req, clone); });
          }
          return resp;
        }).catch(function () { return cached; });
        return cached || networkFetch;
      })
    );
    return;
  }

  /* ── Strategy: Network-first for API endpoints ── */
  if (url.pathname.startsWith('/api/') ||
      url.pathname.startsWith('/safety/') ||
      url.pathname.startsWith('/itinerary/')) {
    event.respondWith(
      fetch(req)
        .then(function (resp) {
          if (resp && resp.ok) {
            var clone = resp.clone();
            caches.open(DATA_CACHE).then(function (c) { c.put(req, clone); });
          }
          return resp;
        })
        .catch(function () {
          return caches.match(req).then(function (cached) {
            if (cached) return cached;
            /* Return minimal offline JSON for API routes */
            return new Response(
              JSON.stringify({ success: false, error: { message: 'Offline — cached data unavailable.' } }),
              { headers: { 'Content-Type': 'application/json' } }
            );
          });
        })
    );
    return;
  }

  /* ── Strategy: Network-first for page navigations ── */
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(function () {
        return caches.match(req).then(function (cached) {
          if (cached) return cached;
          /* Fallback to offline dossier pack if available, otherwise cached home page */
          return caches.match('/my-yatra').then(function (offlineDossier) {
            return offlineDossier || caches.match('/');
          });
        });
      })
    );
    return;
  }

  /* ── Default: Network with cache fallback ── */
  event.respondWith(
    fetch(req).catch(function () {
      return caches.match(req);
    })
  );
});
