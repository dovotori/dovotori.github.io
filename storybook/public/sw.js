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
      cache
        .match(event.request)
        .then((cachedResponse) => {
          // Return a cached response if we have one
          if (cachedResponse) {
            return cachedResponse;
          }

          // Otherwise, hit the network
          return fetch(event.request).then((fetchedResponse) => {
            // Only attempt to cache http(s) responses — some requests
            // (e.g. chrome-extension://) are not supported by the Cache API.
            let url;
            try {
              url = new URL(event.request.url);
            } catch {
              // If the request URL can't be parsed, skip caching.
              return fetchedResponse;
            }

            const protocol = url.protocol;
            if (protocol === "http:" || protocol === "https:") {
              try {
                cache.put(event.request, fetchedResponse.clone());
              } catch (err) {
                // Swallow cache errors to avoid uncaught promise rejection.
                console.warn("[Service Worker] Failed to cache request:", event.request.url, err);
              }
            } else {
              console.warn(
                "[Service Worker] Skipping unsupported scheme for caching:",
                protocol,
                event.request.url,
              );
            }

            // Return the network response
            return fetchedResponse;
          });
        }),
    ),
  );
});
