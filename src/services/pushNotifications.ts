const applicationServerPublicKey =
    'BC1gODQJMEINHBVHV1uFTOaB-_dIUs6ZSYbde8AJ03Wnj8_KegQ9URIOqq0rV23YOT1L6BLnMNsf85LcwOEyFJI';

function urlB64ToUint8Array(base64String: any) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function updateSubscriptionOnServer(subscription: PushSubscription) {
    // TODO: Update subscription
    // console.log(JSON.stringify(subscription));
}

export function subscribeUser() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
            registration.pushManager
                .subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: applicationServerKey
                })
                .then(function(subscription) {
                    updateSubscriptionOnServer(subscription);
                })
                .catch(function(error) {
                    console.error('Failed to subscribe the user: ', error);
                });
        });
    }
}
