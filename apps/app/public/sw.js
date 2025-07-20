// Service Worker for Yuba PWA
// Version: 1.0.0

const CACHE_VERSION = 'v1';
const CACHE_PREFIX = 'yuba-';
const STATIC_CACHE_NAME = `${CACHE_PREFIX}static-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `${CACHE_PREFIX}dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `${CACHE_PREFIX}images-${CACHE_VERSION}`;
const API_CACHE_NAME = `${CACHE_PREFIX}api-${CACHE_VERSION}`;

// Cache configuration
const CACHE_CONFIG = {
  static: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxItems: 100
  },
  dynamic: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    maxItems: 50
  },
  images: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxItems: 50
  },
  api: {
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxItems: 30
  }
};

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/logo/1.png',
  '/logo/2.png',
  '/logo/3.png',
  '/logo/4.png',
  '/logo/5.png',
  '/logo/6.png',
  '/logo/7.png',
  '/logo/10.png'
];

// API routes to cache
const CACHEABLE_API_ROUTES = [
  '/api/spaces',
  '/api/webs',
  '/api/user'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        // console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName.startsWith(CACHE_PREFIX) &&
                !Object.values({
                  STATIC_CACHE_NAME,
                  DYNAMIC_CACHE_NAME,
                  IMAGE_CACHE_NAME,
                  API_CACHE_NAME
                }).includes(cacheName);
            })
            .map(cacheName => {
              // console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle different resource types with appropriate strategies
  if (url.pathname.startsWith('/api/')) {
    // Network first, fall back to cache for API requests
    event.respondWith(networkFirstStrategy(request, API_CACHE_NAME));
  } else if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/i)) {
    // Cache first for images
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE_NAME));
  } else if (url.pathname.startsWith('/_next/static/') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    // Cache first for static assets
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME));
  } else if (request.mode === 'navigate') {
    // Network first for navigation requests
    event.respondWith(
      networkFirstStrategy(request, DYNAMIC_CACHE_NAME)
        .catch(() => caches.match('/offline.html'))
    );
  } else {
    // Network first for everything else
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE_NAME));
  }
});

// Cache first strategy
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Update cache in background
    fetchAndCache(request, cacheName);
    return cachedResponse;
  }

  return fetchAndCache(request, cacheName);
}

// Network first strategy
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Fetch and cache helper
async function fetchAndCache(request, cacheName) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If it's a navigation request and we have no cache, show offline page
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/offline.html');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    throw error;
  }
}

// Clean up old cache entries
async function cleanupCache(cacheName, maxItems, maxAge) {
  const cache = await caches.open(cacheName);
  const requests = await cache.keys();
  const now = Date.now();

  if (requests.length > maxItems) {
    // Delete oldest entries if we exceed max items
    const entriesToDelete = requests.slice(0, requests.length - maxItems);
    
    for (const request of entriesToDelete) {
      await cache.delete(request);
    }
  }

  // Delete entries older than maxAge
  for (const request of requests) {
    const response = await cache.match(request);
    if (response) {
      const dateHeader = response.headers.get('date');
      if (dateHeader) {
        const responseAge = now - new Date(dateHeader).getTime();
        if (responseAge > maxAge) {
          await cache.delete(request);
        }
      }
    }
  }
}

// Periodic cache cleanup (every hour)
setInterval(() => {
  cleanupCache(DYNAMIC_CACHE_NAME, CACHE_CONFIG.dynamic.maxItems, CACHE_CONFIG.dynamic.maxAge);
  cleanupCache(IMAGE_CACHE_NAME, CACHE_CONFIG.images.maxItems, CACHE_CONFIG.images.maxAge);
  cleanupCache(API_CACHE_NAME, CACHE_CONFIG.api.maxItems, CACHE_CONFIG.api.maxAge);
}, 60 * 60 * 1000);

// Handle push notifications
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/logo/1.png',
      badge: '/logo/1.png',
      vibrate: [100, 50, 100],
      data: data.data || {},
      actions: data.actions || []
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Handle background sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-webs') {
    event.waitUntil(syncWebs());
  }
});

// Sync function for offline-created content
async function syncWebs() {
  // This would sync any offline-created webs when connection is restored
  // console.log('[SW] Syncing offline data...');
  // Implementation would depend on your offline storage strategy
}

// Message handling for cache management
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName.startsWith(CACHE_PREFIX)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  }
});