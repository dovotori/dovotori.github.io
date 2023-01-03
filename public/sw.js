importScripts("/public/js/AssetsManager.js");

const assetsManager = new AssetsManager();
const CACHE_NAME = assetsManager.cacheName;

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(resources);
  console.log("[Service Worker] Precaching", resources);
};

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install");
  event.waitUntil(addResourcesToCache(assetsManager.cacheEntries));
});

self.addEventListener("activate", () => {
  console.log("[Service Worker] Activate");
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  console.log("[Service Worker] Fetch", event.request);
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      // Go to the cache first
      cache.match(event.request.url).then((cachedResponse) => {
        // Return a cached response if we have one
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, hit the network
        return fetch(event.request).then((fetchedResponse) => {
          // Add the network response to the cache for later visits
          cache.put(event.request, fetchedResponse.clone());

          // Return the network response
          return fetchedResponse;
        });
      })
    )
  );
});
