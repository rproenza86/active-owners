import { AnyAction } from 'redux';
import { initMessaging } from '../services/cloudMessaging';
import { subscribeUser } from '../services/pushNotifications';
import {
    NOTIFICATION_PERMISSION_REQUEST,
    notificationPermissionSuccess,
    notificationPermissionFailure,
    NOTIFICATION_PERMISSION_SUCCESS,
    getMessagingSubscriptionRequest,
    GET_MESSAGING_SUBSCRIPTION_REQUEST,
    getMessagingSubscriptionSuccess,
    getMessagingSubscriptionFailure,
    GET_MESSAGING_SUBSCRIPTION_SUCCESS,
    saveMessagingSubscriptionRequest,
    SAVE_MESSAGING_SUBSCRIPTION_REQUEST,
    saveMessagingSubscriptionFailure,
    initCloudMessaging,
    INIT_CLOUD_MESSAGING_DEFAULT
} from '../actions/cloudMessaging';
import { askNotificationsPermission } from '../utils/browserNotification';
import { IStateTree } from '../types';
import { subscribeToTeamNotifications, ITeamsMemberHydrated } from '../actions/activeOwners';

export const cloudMessagingMiddleware = (store: any) => (next: any) => async (
    action: AnyAction
) => {
    const result = next(action);

    switch (action.type) {
        case NOTIFICATION_PERMISSION_REQUEST: {
            const isNotificationGranted = await askNotificationsPermission();

            if (isNotificationGranted) {
                store.dispatch(notificationPermissionSuccess());
            } else {
                store.dispatch(
                    notificationPermissionFailure(new Error('Notifications permissions blocked.'))
                );
            }
            break;
        }

        case NOTIFICATION_PERMISSION_SUCCESS: {
            store.dispatch(getMessagingSubscriptionRequest());
            break;
        }

        case GET_MESSAGING_SUBSCRIPTION_REQUEST: {
            const {
                areNotificationsCredentialsValid,
                cloudMessagingToken,
                pushNotificationSubscription
            } = await initCloudMessagingSystem();

            if (areNotificationsCredentialsValid) {
                store.dispatch(
                    getMessagingSubscriptionSuccess(
                        cloudMessagingToken,
                        pushNotificationSubscription
                    )
                );
            } else {
                store.dispatch(
                    getMessagingSubscriptionFailure(
                        new Error('Error getting messaging subscriptions credentials')
                    )
                );
            }
            break;
        }

        case INIT_CLOUD_MESSAGING_DEFAULT: {
            const {
                areNotificationsCredentialsValid,
                cloudMessagingToken,
                pushNotificationSubscription
            } = await initCloudMessagingSystem();

            if (areNotificationsCredentialsValid) {
                store.dispatch(
                    initCloudMessaging(cloudMessagingToken, pushNotificationSubscription, [])
                );
            }
            break;
        }

        case GET_MESSAGING_SUBSCRIPTION_SUCCESS: {
            store.dispatch(saveMessagingSubscriptionRequest());
            break;
        }

        case SAVE_MESSAGING_SUBSCRIPTION_REQUEST: {
            const state: IStateTree = store.getState();
            const {
                cloudMessaging: { cloudMessagingToken, pushNotificationSubscription, processing },
                teamsMembers,
                auth: { user }
            } = state;

            const dispatchFailure = () =>
                store.dispatch(
                    saveMessagingSubscriptionFailure(
                        new Error('Error saving messaging subscriptions credentials')
                    )
                );

            if (!processing?.teamId || (!cloudMessagingToken && !pushNotificationSubscription)) {
                return dispatchFailure();
            }

            const getAO = (): ITeamsMemberHydrated | null => {
                let activeOwner: ITeamsMemberHydrated | null;

                const activeOwnerArray = teamsMembers.filter(
                    member => member.teamId === processing?.teamId
                );
                activeOwner = activeOwnerArray.length >= 0 ? activeOwnerArray[0] : null;

                return activeOwner;
            };

            const activeOwner = getAO();
            if (activeOwner) {
                return store.dispatch(
                    subscribeToTeamNotifications(activeOwner, pushNotificationSubscription, user)
                );
            }

            dispatchFailure();
            break;
        }

        default:
            break;
    }

    return result;
};

async function initCloudMessagingSystem() {
    const cloudMessagingToken = await initMessaging(handleTokenRefresh, handleCloudMessages);
    const pushNotificationSubscription = await subscribeUser();

    const areNotificationsCredentialsValid =
        cloudMessagingToken !== '' && pushNotificationSubscription !== '';

    return { areNotificationsCredentialsValid, cloudMessagingToken, pushNotificationSubscription };
}

function handleTokenRefresh(refreshedToken: string) {
    // TODO: IMPLEMENT UPDATE
}

function handleCloudMessages(message: any) {
    // TODO: IMPLEMENT UPDATE
}
