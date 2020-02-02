if ('function' === typeof importScripts) {
    importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');
    // Global workbox
    if (workbox) {
        console.log('Workbox is loaded');
        // Disable logging
        workbox.setConfig({ debug: false });
        //`generateSW` and `generateSWString` provide the option
        // to force update an exiting service worker.
        // Since we're using `injectManifest` to build SW,
        // manually overriding the skipWaiting();
        self.addEventListener('install', event => {
            self.skipWaiting();
            // window.location.reload();
        });
        // Manual injection point for manifest files.
        // All assets under build/ and 5MB sizes are precached.
        workbox.precaching.precacheAndRoute([]);
        // Font caching
        workbox.routing.registerRoute(
            new RegExp('https://fonts.(?:.googlepis|gstatic).com/(.*)'),
            workbox.strategies.cacheFirst({
                cacheName: 'googleapis',
                plugins: [
                    new workbox.expiration.Plugin({
                        maxEntries: 30
                    })
                ]
            })
        );
        // Image caching
        workbox.routing.registerRoute(
            /\.(?:png|gif|jpg|jpeg|svg)$/,
            workbox.strategies.cacheFirst({
                cacheName: 'images',
                plugins: [
                    new workbox.expiration.Plugin({
                        maxEntries: 60,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
                    })
                ]
            })
        );
        // JS, CSS caching
        workbox.routing.registerRoute(
            /\.(?:js|css)$/,
            workbox.strategies.staleWhileRevalidate({
                cacheName: 'static-resources',
                plugins: [
                    new workbox.expiration.Plugin({
                        maxEntries: 60,
                        maxAgeSeconds: 20 * 24 * 60 * 60 // 20 Days
                    })
                ]
            })
        );
    } else {
        console.error('Workbox could not be loaded. No offline support');
    }

    // custom sw code for cloud messaging, keep in sync with the public/sw.js file
    // Give the service worker access to Firebase Messaging.
    // Note that you can only use Firebase Messaging here, other Firebase libraries
    // are not available in the service worker.
    importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-messaging.js');

    // Initialize the Firebase app in the service worker by passing in the
    // messagingSenderId.
    firebase.initializeApp({
        apiKey: 'AIzaSyAcP-xv4rvh6ia6R2JoPTUA2UT6zWWE7-s',
        authDomain: 'active-owner-registry.firebaseapp.com',
        databaseURL: 'https://active-owner-registry.firebaseio.com',
        projectId: 'active-owner-registry',
        storageBucket: 'active-owner-registry.appspot.com',
        messagingSenderId: '201415925411',
        appId: '1:201415925411:web:cb75f59e16e9a83cf7e916',
        measurementId: 'G-KMLZ1XXSKG'
    });

    const messaging = firebase.messaging();

    // Retrieve an instance of Firebase Messaging so that it can handle background
    // messages.
    messaging.setBackgroundMessageHandler(function(payload) {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        // Customize notification here
        const notificationTitle = 'Background Message Title';
        const notificationOptions = {
            body: 'Background Message body.',
            icon: '/logo512.png'
        };

        return self.registration.showNotification(notificationTitle, notificationOptions);
    });

    self.addEventListener('push', function(e) {
        if (!(self.Notification && self.Notification.permission === 'granted')) {
            return;
        }

        var data = {};
        if (e.data) {
            data = e.data.json();
        }
        var message = data.message || "Here's something you might want to check out.";

        var options = {
            body: message,
            icon: 'icons/logo512.png',
            badge: 'icons/logo512.png',
            image: 'icons/logo512.png',
            dir: 'auto',
            tag: 'renotify',
            renotify: true,
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                subscriptionId: data.subscriptionId
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Go to the site',
                    icon: 'icons/logo.svg'
                },
                {
                    action: 'close',
                    title: 'Close the notification',
                    icon: 'icons/logo.svg'
                }
            ]
        };

        e.waitUntil(
            clients.matchAll().then(function(c) {
                console.log(c);
                if (c.length === 0) {
                    // Show notification
                    self.registration.showNotification('Atomic Coders', options);
                } else {
                    // Send a message to the page to update the UI
                    // TODO: postMessage implementation to communicate UI and sw
                    console.log('Application is already open!');
                    // FIXME:For now let it pass and handle it in the notificationclick handler
                    self.registration.showNotification('Atomic Coders', options);
                }
            })
        );
    });
}
