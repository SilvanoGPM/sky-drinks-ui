const CAHCE_NAME = '@skydrinks-cache';

const URLS_TO_CACHE = [];

/* eslint-disable */

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CAHCE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response;
    })
  );
});

/* eslint-enable */
