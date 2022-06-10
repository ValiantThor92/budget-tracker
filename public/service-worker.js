const FILES_TO_CACHE = [                        // cache all files in public directory besides icons
  "/",
  "/styles.css",
  "/db.js",
  "/index.js",
];

const STATIC_CACHE = "static-cache-v1";
const RUNTIME_CACHE = "runtime-cache";

self.addEventListener("install", event => {   // install handler sets up cache
  event.waitUntill(
    caches
      .open(STATIC_CACHE)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => { // activate handler cleans old caches
  const currentCache = [STATIC_CACHE, RUNTIME_CACHE, STATIC_CACHE];
  event.waitUntill(
    caches
      .keys()
      .then(cacheNames => {
        return cacheNames.filter(
          cacheName => !currentCaches.includes(cacheName)
        );
      })
      .then(cachesToDelete => {
        return Promise.all(
          cachesToDelete.map(cachesToDelete => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});