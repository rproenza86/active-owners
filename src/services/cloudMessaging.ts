import firebase from '../firebase';

export let messaging: firebase.messaging.Messaging;

export const initMessaging = (registration: any) => {
    // Retrieve Firebase Messaging object.
    messaging = firebase.messaging();
    messaging.useServiceWorker(registration);

    // Add the public key generated from the console here.
    messaging.usePublicVapidKey(
        'BC1gODQJMEINHBVHV1uFTOaB-_dIUs6ZSYbde8AJ03Wnj8_KegQ9URIOqq0rV23YOT1L6BLnMNsf85LcwOEyFJI'
    );

    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging
        .getToken()
        .then(currentToken => {
            if (currentToken) {
                // sendTokenToServer(currentToken);
                // updateUIForPushEnabled(currentToken);
                // console.log('currentToken', currentToken);
            } else {
                // Show permission request.
                console.log('No Instance ID token available. Request permission to generate one.');
                // Show permission UI.
                // updateUIForPushPermissionRequired();
                // setTokenSentToServer(false);
            }
        })
        .catch(err => {
            console.log('An error occurred while retrieving token. ', err);
            //   showToken('Error retrieving Instance ID token. ', err);
            //   setTokenSentToServer(false);
        });

    // Callback fired if Instance ID token is updated.
    messaging.onTokenRefresh(() => {
        messaging
            .getToken()
            .then(refreshedToken => {
                console.log('Token refreshed.');
                // Indicate that the new Instance ID token has not yet been sent to the
                // app server.
                // setTokenSentToServer(false);
                // Send Instance ID token to app server.
                // sendTokenToServer(refreshedToken);
                console.log('refreshedToken', refreshedToken);
            })
            .catch(err => {
                console.log('Unable to retrieve refreshed token ', err);
                // showToken('Unable to retrieve refreshed token ', err);
            });
    });

    // Handle incoming messages. Called when:
    // - a message is received while the app has focus
    // - the user clicks on an app notification created by a service worker
    //   `messaging.setBackgroundMessageHandler` handler.
    messaging.onMessage(payload => {
        debugger;
        console.log('Message received. ', payload);
        // ...
    });

    navigator.serviceWorker.addEventListener('message', message => console.log(message));
};
