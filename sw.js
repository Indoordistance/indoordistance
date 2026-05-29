// Indoor Distance — Service Worker (basic offline cache)
const CACHE = 'indoor-distance-v1';
const CORE = [
  './',
  './indoor_distance_pro (1).html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for API calls; cache-first for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never cache Supabase, Stripe, OpenAI/Anthropic, Open-Meteo, TF.js calls (they need fresh data)
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('stripe.com') ||
    url.hostname.includes('anthropic.com') ||
    url.hostname.includes('openai.com') ||
    url.hostname.includes('open-meteo.com')
  ) {
    return; // let browser handle directly
  }

  // For everything else: cache-first, fallback to network
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        // Cache CDN libs (TF.js, jsPDF, fonts) for offline use
        if (res.ok && event.request.method === 'GET' && (
          url.hostname.includes('cdn.jsdelivr.net') ||
          url.hostname.includes('cdnjs.cloudflare.com') ||
          url.hostname.includes('fonts.googleapis.com') ||
          url.hostname.includes('fonts.gstatic.com')
        )) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(event.request, clone));
        }
        return res;
      }).catch(() => caches.match('./indoor_distance_pro (1).html'));
    })
  );
});
