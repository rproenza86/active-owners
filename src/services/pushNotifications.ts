import { CLOUD_MESSAGING_WEB_PUSH_PUBLIC_KEY } from '../constants';

const applicationServerPublicKey = CLOUD_MESSAGING_WEB_PUSH_PUBLIC_KEY;

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

export async function subscribeUser(): Promise<string> {
    let subscriptionString = '';

    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.ready;
            if (registration) {
                const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: applicationServerKey
                });
                subscriptionString = JSON.stringify(subscription);
            }
        } catch (error) {
            console.error('Failed to subscribe the user: ', error);
        }
    }

    return subscriptionString;
}
