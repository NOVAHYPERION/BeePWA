console.log('Into Service Worker');
var CACHE_NAME = 'my-site-cache-v1.5';
const FILES_TO_CACHE = [
  'offline.html'
    ,'templates/jquery.slim.min.js'
    ,'templates/popper.min.js',
    'templates/bootstrap.min.js',
    'templates/bootstrap.min.css',
    'templates/styles.css',
    'templates/tranbee.png',
    'templates/ABBA.Take%20a%20chance%20on%20me%20K.mp3',
];

//self.addEventListener('push', function(event) {
  //console.log('[Service Worker] Push Received.');
  //console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

 /* const title = 'Push Codelab';
  const options = {
    body: 'Yay it works.',
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});*/

self.addEventListener('install', function(event) {
  //console.log('Service Worker installing.');
    event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      //console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE); 
        })
);
});
self.addEventListener('activate', function(event) {
  console.log('Service Worker activating.');  
    event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          //console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
);
});

self.addEventListener('fetch', (event) => {
//console.log('fetch request');
event.respondWith(
    // Try the cache
    caches.match(event.request).then(function(response) {
      // Fall back to network
      return response || fetch(event.request);
    }).catch(function() {
      // If both fail, show a generic fallback:
      return caches.match('/offline.html');
      // However, in reality you'd have many different
      // fallbacks, depending on URL & headers.
      // Eg, a fallback silhouette image for avatars.
    })
  );
});
