import firebase from '../firebase';
import { CLOUD_MESSAGING_WEB_PUSH_PUBLIC_KEY } from '../constants';

export let messaging: firebase.messaging.Messaging;

export const initMessaging = async (
    onTokenRefreshCallback: (refreshedToken: string) => void,
    onMessageEventCallback: (message: any) => void
) => {
    const registration = await getSWRegistration();
    if (!registration) {
        return;
    }

    instantiateCloudMessaging(registration);
    const cloudMessagingToken = await getCloudMessagingToken();

    handleTokenRefreshEvent(onTokenRefreshCallback);
    initOnMessageHandlers(onMessageEventCallback);

    return cloudMessagingToken;
};

async function getSWRegistration() {
    let registration: ServiceWorkerRegistration | undefined;

    try {
        registration = await navigator?.serviceWorker?.getRegistration();
    } catch (error) {
        console.error('Error getting sw registration', error);
    }
    if (!registration) {
        console.log('Cloud messaging setup failed. The sw registration was not found.');
    }

    return registration;
}

/**
 *  Retrieve Firebase Messaging object.
 *
 * @param {ServiceWorkerRegistration} registration
 */
function instantiateCloudMessaging(registration: ServiceWorkerRegistration) {
    if (messaging) {
        return;
    }

    messaging = firebase.messaging();
    messaging.useServiceWorker(registration);
    // Add the public key generated from the console here.
    messaging.usePublicVapidKey(CLOUD_MESSAGING_WEB_PUSH_PUBLIC_KEY);
}

/**
 * Get Instance ID token. Initially this makes a network call, once retrieved
 * subsequent calls to getToken will return from cache.
 */
async function getCloudMessagingToken() {
    let cloudMessagingToken: string = '';
    try {
        console.log(messaging);

        cloudMessagingToken = await messaging.getToken();
    } catch (error) {
        console.log('An error occurred while retrieving token. ', error);
    }
    return cloudMessagingToken;
}

function handleTokenRefreshEvent(onTokenRefreshCallback: (refreshedToken: string) => void) {
    messaging.onTokenRefresh(() => {
        messaging
            .getToken()
            .then(refreshedToken => {
                console.log('Token refreshed.');
                // Indicate that the new Instance ID token has not yet been sent to the
                // app server.
                console.log('Token refreshed.', refreshedToken);
                onTokenRefreshCallback(refreshedToken);
            })
            .catch(err => {
                console.log('Unable to retrieve refreshed token ', err);
                onTokenRefreshCallback('');
            });
    });
}

function initOnMessageHandlers(onMessageEventCallback: (message: any) => void) {
    cloudMessagingHandler();
    serviceWorkerHandler();

    function serviceWorkerHandler() {
        navigator.serviceWorker.addEventListener('message', message => {
            debugger;
            console.log('Message received on serviceWorker:', message);
            onMessageEventCallback(message);
        });
    }

    function cloudMessagingHandler() {
        // Handle incoming messages. Called when:
        // - a message is received while the app has focus
        // - the user clicks on an app notification created by a service worker
        //   `messaging.setBackgroundMessageHandler` handler.
        messaging.onMessage(payload => {
            debugger;
            console.log('Message received on cloud messaging', payload);
            onMessageEventCallback(payload);
        });
    }
}
