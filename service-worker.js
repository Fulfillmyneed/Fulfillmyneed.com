// FulfillMyNeed.com - Service Worker
const CACHE_NAME = 'fulfillmyneed-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;500;600&display=swap'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Strategy: Cache First, then Network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request because it's a stream and can only be consumed once
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response because it's a stream and can only be consumed once
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              // Don't cache API calls or external resources that might change frequently
              const shouldCache = 
                event.request.url.startsWith('http') &&
                !event.request.url.includes('/api/') &&
                !event.request.url.includes('google-analytics') &&
                !event.request.url.includes('gtag');
                
              if (shouldCache) {
                cache.put(event.request, responseToCache);
              }
            });
            
          return response;
        }).catch(() => {
          // If network fails and we don't have a cached version,
          // we could return a custom offline page here
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/');
          }
        });
      })
  );
});

// Background Sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'postNeed') {
    event.waitUntil(syncPostNeeds());
  }
});

// Push Notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New need posted in your area!',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAkElEQVQ4je2SMQ6AIAxF/1Gv0KkXcPMEHqIn8ASO3sDBxQN4AheTlhKTglWZ7Ev7Ck3TF4EDOIBXgQVYg2cGsANrRK8BMyX1Iq5R9xS5BswR3UcsIq4Rc0QPgWn3sgSMEd1HjBHdBYbdywLQR3Qf0UV0F+h2LwtAG9F9RBPRTaDZvRTAQN4HfgEGhVblCo2iAAAAAElFTkSuQmCC',
    badge: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAkElEQVQ4je2SMQ6AIAxF/1Gv0KkXcPMEHqIn8ASO3sDBxQN4AheTlhKTglWZ7Ev7Ck3TF4EDOIBXgQVYg2cGsANrRK8BMyX1Iq5R9xS5BswR3UcsIq4Rc0QPgWn3sgSMEd1HjBHdBYbdywLQR3Qf0UV0F+h2LwtAG9F9RBPRTaDZvRTAQN4HfgEGhVblCo2iAAAAAElFTkSuQmCC',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'view',
        title: 'View Need'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('FulfillMyNeed', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function for background sync
function syncPostNeeds() {
  // Get pending needs from IndexedDB
  return getPendingNeeds().then(needs => {
    return Promise.all(
      needs.map(need => {
        // In a real app, this would send to your API
        return fetch('/api/needs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(need)
        }).then(response => {
          if (response.ok) {
            // Remove from pending needs on success
            return removePendingNeed(need.id);
          }
          throw new Error('Sync failed');
        });
      })
    );
  });
}

// IndexedDB helper functions (simplified for demo)
function getPendingNeeds() {
  return new Promise(resolve => {
    // In a real app, implement IndexedDB
    resolve([]);
  });
}

function removePendingNeed(id) {
  return Promise.resolve();
}

// Periodic background updates
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-needs') {
    event.waitUntil(updateNeedsCache());
  }
});

function updateNeedsCache() {
  // Update cached needs data periodically
  return fetch('/api/needs/recent')
    .then(response => response.json())
    .then(needs => {
      return caches.open(CACHE_NAME + '-data')
        .then(cache => {
          cache.put('/api/needs/recent', new Response(JSON.stringify(needs)));
        });
    })
    .catch(err => console.log('Background update failed:', err));
}

// Handle offline/online status
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});