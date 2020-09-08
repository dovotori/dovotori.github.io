if (window) {
  window.self.addEventListener('install', (event) => {
    event.waitUntil(caches.open('v1').then((cache) => cache.addAll(['/', '/index.html'])));
  });

  window.self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // caches.match() always resolves
        // but in case of success response will have value
        if (response !== undefined) {
          return response;
        }
        return fetch(event.request)
          .then((response2) => {
            // response may be used only once
            // we need to save clone to put one copy in cache
            // and serve second one
            const responseClone = response2.clone();

            caches.open('v1').then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response2;
          })
          .catch(() => caches.match('./index.html'));
      })
    );
  });
}
