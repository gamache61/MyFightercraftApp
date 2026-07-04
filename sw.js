const CACHE_NAME = 'ironclad-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './crew/alien-voice1.js',
  './crew/alien-voice2.js',
  './crew/character_mouth_package.js',
  './crew/alien.js',
  './crew/captain-mouth.js',
  './crew/captain.js',
  './crew/helmsman1.js',
  './crew/helmsman2.js',
  './mission2.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache each asset individually so one missing file doesn't fail the whole install
      return Promise.all(
        ASSETS.map((url) => cache.add(url).catch((err) => console.warn('SW cache skip:', url, err)))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first for the CDN Three.js/GLTFLoader scripts so updates aren't stuck stale
  if (event.request.url.includes('cdnjs.cloudflare.com') || event.request.url.includes('cdn.jsdelivr.net')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for local game assets, with network fallback and cache fill
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});