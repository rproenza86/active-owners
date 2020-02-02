import { ActionCreator } from 'redux';
import { SimpleFSA, FSA, IUserSubscription } from '../types';

// Actions names
export const UPDATE_MESSAGING_SUBSCRIPTION_REQUEST = 'UPDATE_MESSAGING_SUBSCRIPTION_REQUEST';
export const UPDATE_MESSAGING_SUBSCRIPTION_SUCCESS = 'UPDATE_MESSAGING_SUBSCRIPTION_SUCCESS';
export const UPDATE_MESSAGING_SUBSCRIPTION_FAILURE = 'UPDATE_MESSAGING_SUBSCRIPTION_FAILURE';

/**
 * NOTIFICATION_PERMISSION section start
 */
// Actions names
export const NOTIFICATION_PERMISSION_REQUEST = 'NOTIFICATION_PERMISSION_REQUEST';
export const NOTIFICATION_PERMISSION_SUCCESS = 'NOTIFICATION_PERMISSION_SUCCESS';
export const NOTIFICATION_PERMISSION_FAILURE = 'NOTIFICATION_PERMISSION_FAILURE';

// Payload interface
interface INotificationPermissionPayload {
    teamId: string;
}
// Actions creator function interface
interface NotificationPermissionRequestAction
    extends FSA<typeof NOTIFICATION_PERMISSION_REQUEST, INotificationPermissionPayload> {}
// Actions creator function implementation
export const notificationPermissionRequest: ActionCreator<NotificationPermissionRequestAction> = (
    teamId: string
) => {
    return {
        type: NOTIFICATION_PERMISSION_REQUEST,
        payload: {
            teamId
        }
    };
};

// Actions creator function interface
interface NotificationPermissionSuccessAction
    extends SimpleFSA<typeof NOTIFICATION_PERMISSION_SUCCESS> {}
// Actions creator function implementation
export const notificationPermissionSuccess: ActionCreator<NotificationPermissionSuccessAction> = () => {
    return {
        type: NOTIFICATION_PERMISSION_SUCCESS
    };
};

// Actions creator function interface
interface NotificationPermissionFailureAction
    extends FSA<typeof NOTIFICATION_PERMISSION_FAILURE, Error> {}
// Actions creator function implementation
export const notificationPermissionFailure: ActionCreator<NotificationPermissionFailureAction> = (
    error: Error
) => {
    return {
        type: NOTIFICATION_PERMISSION_FAILURE,
        payload: {
            ...error
        }
    };
};
/**
 * NOTIFICATION_PERMISSION section end
 */

/**
 * GET_MESSAGING_SUBSCRIPTION section start
 */
// Actions names
export const GET_MESSAGING_SUBSCRIPTION_REQUEST = 'GET_MESSAGING_SUBSCRIPTION_REQUEST';
export const GET_MESSAGING_SUBSCRIPTION_SUCCESS = 'GET_MESSAGING_SUBSCRIPTION_SUCCESS';
export const GET_MESSAGING_SUBSCRIPTION_FAILURE = 'GET_MESSAGING_SUBSCRIPTION_FAILURE';

// Actions creator function interface
interface GetMessagingSubscriptionRequestAction
    extends SimpleFSA<typeof GET_MESSAGING_SUBSCRIPTION_REQUEST> {}
// Actions creator function implementation
export const getMessagingSubscriptionRequest: ActionCreator<GetMessagingSubscriptionRequestAction> = () => {
    return {
        type: GET_MESSAGING_SUBSCRIPTION_REQUEST
    };
};

// Payload interface
interface IMessagingSubscriptionPayload {
    cloudMessagingToken: string;
    pushNotificationSubscription: string;
}
// Actions creator function interface
interface GetMessagingSubscriptionSuccessAction
    extends FSA<typeof GET_MESSAGING_SUBSCRIPTION_SUCCESS, IMessagingSubscriptionPayload> {}
// Actions creator function implementation
export const getMessagingSubscriptionSuccess: ActionCreator<GetMessagingSubscriptionSuccessAction> = (
    cloudMessagingToken: string,
    pushNotificationSubscription: string
) => {
    return {
        type: GET_MESSAGING_SUBSCRIPTION_SUCCESS,
        payload: {
            cloudMessagingToken,
            pushNotificationSubscription
        }
    };
};

// Actions creator function interface
interface GetMessagingSubscriptionFailureAction
    extends FSA<typeof GET_MESSAGING_SUBSCRIPTION_FAILURE, Error> {}
// Actions creator function implementation
export const getMessagingSubscriptionFailure: ActionCreator<GetMessagingSubscriptionFailureAction> = (
    error: Error
) => {
    return {
        type: GET_MESSAGING_SUBSCRIPTION_FAILURE,
        payload: {
            ...error
        }
    };
};
/**
 * GET_MESSAGING_SUBSCRIPTION section end
 */

/**
 * SAVE_MESSAGING_SUBSCRIPTION_ section start
 */
// Actions names
export const SAVE_MESSAGING_SUBSCRIPTION_REQUEST = 'SAVE_MESSAGING_SUBSCRIPTION_REQUEST';
export const SAVE_MESSAGING_SUBSCRIPTION_SUCCESS = 'SAVE_MESSAGING_SUBSCRIPTION_SUCCESS';
export const SAVE_MESSAGING_SUBSCRIPTION_FAILURE = 'SAVE_MESSAGING_SUBSCRIPTION_FAILURE';

// Actions creator function interface
interface SaveMessagingSubscriptionRequestAction
    extends SimpleFSA<typeof SAVE_MESSAGING_SUBSCRIPTION_REQUEST> {}
// Actions creator function implementation
export const saveMessagingSubscriptionRequest: ActionCreator<SaveMessagingSubscriptionRequestAction> = () => {
    return {
        type: SAVE_MESSAGING_SUBSCRIPTION_REQUEST
    };
};

// Actions creator function interface
interface SaveMessagingSubscriptionSuccessAction
    extends SimpleFSA<typeof SAVE_MESSAGING_SUBSCRIPTION_SUCCESS> {}
// Actions creator function implementation
export const saveMessagingSubscriptionSuccess: ActionCreator<SaveMessagingSubscriptionSuccessAction> = () => {
    return {
        type: SAVE_MESSAGING_SUBSCRIPTION_SUCCESS
    };
};

// Actions creator function interface
interface SaveMessagingSubscriptionFailureAction
    extends FSA<typeof SAVE_MESSAGING_SUBSCRIPTION_FAILURE, Error> {}
// Actions creator function implementation
export const saveMessagingSubscriptionFailure: ActionCreator<SaveMessagingSubscriptionFailureAction> = (
    error: Error
) => {
    return {
        type: SAVE_MESSAGING_SUBSCRIPTION_FAILURE,
        payload: {
            ...error
        }
    };
};
/**
 * SAVE_MESSAGING_SUBSCRIPTION_ section end
 */

/**
 * INIT_CLOUD_MESSAGING section start
 */
// Actions names
export const INIT_CLOUD_MESSAGING = 'INIT_CLOUD_MESSAGING';
export const INIT_CLOUD_MESSAGING_DEFAULT = 'INIT_CLOUD_MESSAGING_DEFAULT';

interface IInitCloudMessagingPayload extends IMessagingSubscriptionPayload {
    subscriptions: Array<string>;
}
// Actions creator function interface
interface InitCloudMessagingAction
    extends FSA<typeof INIT_CLOUD_MESSAGING, IInitCloudMessagingPayload> {}
// Actions creator function implementation
export const initCloudMessaging: ActionCreator<InitCloudMessagingAction> = (
    cloudMessagingToken: string,
    pushNotificationSubscription: string,
    userSubscriptions: IUserSubscription[]
) => {
    const subscriptions = userSubscriptions.map(subscription => subscription.teamId);
    return {
        type: INIT_CLOUD_MESSAGING,
        payload: {
            cloudMessagingToken,
            pushNotificationSubscription,
            subscriptions
        }
    };
};

// Actions creator function interface
interface InitCloudMessagingDefaultAction extends SimpleFSA<typeof INIT_CLOUD_MESSAGING_DEFAULT> {}
// Actions creator function implementation
export const initCloudMessagingDefault: ActionCreator<InitCloudMessagingDefaultAction> = () => {
    return {
        type: INIT_CLOUD_MESSAGING_DEFAULT
    };
};
/**
 * INIT_CLOUD_MESSAGING section end
 */

/**
 * UNSUBSCRIBE_USER_OF_AO_UPDATES section end
 */
export const UNSUBSCRIBE_USER_OF_AO_UPDATES_REQUEST = ' UNSUBSCRIBE_USER_OF_AO_UPDATES_REQUEST';
export const UNSUBSCRIBE_USER_OF_AO_UPDATES_SUCCESS = ' UNSUBSCRIBE_USER_OF_AO_UPDATES_SUCCESS';
export const UNSUBSCRIBE_USER_OF_AO_UPDATES_FAILURE = ' UNSUBSCRIBE_USER_OF_AO_UPDATES_FAILURE';

// Payload interface
interface IUnsubscribeUserOfAOUpdatesPayload {
    teamId: string;
}
// Actions creator function interface
interface UnsubscribeUserOfAOUpdatesRequestAction
    extends FSA<
        typeof UNSUBSCRIBE_USER_OF_AO_UPDATES_REQUEST,
        IUnsubscribeUserOfAOUpdatesPayload
    > {}
// Actions creator function implementation
export const unsubscribeUserOfAOUpdatesRequest: ActionCreator<UnsubscribeUserOfAOUpdatesRequestAction> = (
    teamId: string
) => {
    return {
        type: UNSUBSCRIBE_USER_OF_AO_UPDATES_REQUEST,
        payload: {
            teamId
        }
    };
};

// Actions creator function interface
interface UnsubscribeUserOfAOUpdatesSuccessAction
    extends SimpleFSA<typeof UNSUBSCRIBE_USER_OF_AO_UPDATES_SUCCESS> {}
// Actions creator function implementation
export const unsubscribeUserOfAOUpdatesSuccess: ActionCreator<UnsubscribeUserOfAOUpdatesSuccessAction> = () => {
    return {
        type: UNSUBSCRIBE_USER_OF_AO_UPDATES_SUCCESS
    };
};

// Actions creator function interface
interface UnsubscribeUserOfAOUpdatesFailureAction
    extends FSA<typeof UNSUBSCRIBE_USER_OF_AO_UPDATES_FAILURE, Error> {}
// Actions creator function implementation
export const unsubscribeUserOfAOUpdatesFailure: ActionCreator<UnsubscribeUserOfAOUpdatesFailureAction> = (
    error: Error
) => {
    return {
        type: UNSUBSCRIBE_USER_OF_AO_UPDATES_FAILURE,
        payload: {
            ...error
        }
    };
};

/**
 * UNSUBSCRIBE_USER_OF_AO_UPDATES section end
 */

// Actions types
export type CloudMessagingActionsTypes =
    | NotificationPermissionRequestAction
    | NotificationPermissionSuccessAction
    | NotificationPermissionFailureAction
    | GetMessagingSubscriptionRequestAction
    | GetMessagingSubscriptionSuccessAction
    | GetMessagingSubscriptionFailureAction
    | SaveMessagingSubscriptionRequestAction
    | SaveMessagingSubscriptionSuccessAction
    | SaveMessagingSubscriptionFailureAction
    | InitCloudMessagingAction
    | InitCloudMessagingDefaultAction
    | UnsubscribeUserOfAOUpdatesRequestAction
    | UnsubscribeUserOfAOUpdatesSuccessAction
    | UnsubscribeUserOfAOUpdatesFailureAction;
