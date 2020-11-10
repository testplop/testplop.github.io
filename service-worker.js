const CACHE_NAME = 'pwa-cache-v3';
const urlsToCache = [
  '/pwd-calc/',
  '/pwd-calc/assets/style.css',
  '/pwd-calc/assets/index.js',
  '/pwd-calc/manifest.json',
  '/pwd-calc/favicon.ico',
  '/pwd-calc/favicon-16x16.png',
  '/pwd-calc/favicon-32x32.png',
  '/pwd-calc/android-chrome-192x192.png',
  '/pwd-calc/android-chrome-512x512.png',
  '/pwd-calc/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  console.log('Finally active. Ready to serve!');
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    console.log('pass')
    const url = event.request.url;
    let shouldRespond = urlsToCache.includes(url);

    if (shouldRespond) {
      event.respondWith(
        caches.match(event.request).then(response => {
          if (response) {
            console.log('Serving response from the cache');
            return response;
          }
          return (
            fetch(event.request)
              .then(() => caches.open(CACHE_NAME))
              .then(cache => {
                cache.put(event.request, response.clone());
                return response;
              })
              .catch(response => {
                console.log('Fetch failed, sorry.');
              })
          );
        })
      );
    }
  }
});
