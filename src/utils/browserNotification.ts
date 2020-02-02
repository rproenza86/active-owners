export function isNotificationSupported(): boolean {
    if (!('Notification' in window)) {
        return false;
    } else {
        return true;
    }
}

export const isNotificationGranted = Notification.permission === 'granted';

export const isNotificationDenied = Notification.permission === 'denied';

export async function askNotificationsPermission(): Promise<boolean> {
    // Let's check if the browser supports notifications
    if (!isNotificationSupported()) {
        console.warn('This browser does not support desktop notification');
        return false;
    }

    // Let's check whether notification permissions have already been granted
    else if (isNotificationGranted) {
        console.info('This browser have granted desktop notification');
        return true;
    }

    // Otherwise, we need to ask the user for permission
    else if (!isNotificationDenied) {
        try {
            const permission = await Notification.requestPermission();
            // If the user accepts, let's create a notification
            if (permission === 'granted') {
                console.warn('Good news, desktop notifications granted!');
                return true;
            }
        } catch (error) {
            console.error(error);
        }
    }

    return false;
}
