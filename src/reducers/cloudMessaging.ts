import {
    CloudMessagingActionsTypes,
    NOTIFICATION_PERMISSION_SUCCESS,
    NOTIFICATION_PERMISSION_FAILURE,
    NOTIFICATION_PERMISSION_REQUEST,
    GET_MESSAGING_SUBSCRIPTION_SUCCESS,
    GET_MESSAGING_SUBSCRIPTION_FAILURE,
    SAVE_MESSAGING_SUBSCRIPTION_SUCCESS,
    INIT_CLOUD_MESSAGING,
    UNSUBSCRIBE_USER_OF_AO_UPDATES_REQUEST,
    UNSUBSCRIBE_USER_OF_AO_UPDATES_FAILURE,
    UNSUBSCRIBE_USER_OF_AO_UPDATES_SUCCESS
} from '../actions/cloudMessaging';
import { ICloudNotificationState } from '../types';
import { isNotificationGranted, isNotificationDenied } from '../utils/browserNotification';

const initialState: ICloudNotificationState = {
    cloudMessagingToken: '',
    pushNotificationSubscription: '',
    isNotificationGranted: isNotificationGranted,
    isNotificationBlocked: isNotificationDenied,
    aoUpdateSubscriptions: []
};

const resetProcessing = { processing: undefined };

export function cloudMessaging(
    state: ICloudNotificationState = initialState,
    action: CloudMessagingActionsTypes
): ICloudNotificationState {
    switch (action.type) {
        case NOTIFICATION_PERMISSION_REQUEST: {
            if (action.payload) {
                return { ...state, processing: { ...action.payload } };
            } else {
                return state;
            }
        }

        case NOTIFICATION_PERMISSION_SUCCESS: {
            return { ...state, isNotificationGranted: true };
        }

        case NOTIFICATION_PERMISSION_FAILURE:
            return { ...initialState, isNotificationBlocked: true };

        case GET_MESSAGING_SUBSCRIPTION_SUCCESS:
            return { ...state, ...action.payload };

        case GET_MESSAGING_SUBSCRIPTION_FAILURE:
            return {
                ...state,
                ...resetProcessing,
                cloudMessagingToken: '',
                pushNotificationSubscription: ''
            };

        case SAVE_MESSAGING_SUBSCRIPTION_SUCCESS: {
            const aoUpdateSubscriptions = [...state.aoUpdateSubscriptions];

            if (state.processing?.teamId) {
                aoUpdateSubscriptions.push(state.processing.teamId);
            }

            return {
                ...state,
                ...resetProcessing,
                aoUpdateSubscriptions
            };
        }

        case INIT_CLOUD_MESSAGING: {
            let newState = { ...state };
            if (action.payload) {
                const {
                    cloudMessagingToken,
                    pushNotificationSubscription,
                    subscriptions: aoUpdateSubscriptions
                } = action.payload;

                newState = {
                    ...newState,
                    cloudMessagingToken,
                    pushNotificationSubscription,
                    aoUpdateSubscriptions
                };
            }
            return newState;
        }

        case UNSUBSCRIBE_USER_OF_AO_UPDATES_REQUEST: {
            if (action.payload) {
                return { ...state, processing: { ...action.payload } };
            } else {
                return state;
            }
        }

        case UNSUBSCRIBE_USER_OF_AO_UPDATES_SUCCESS: {
            const teamId = state.processing?.teamId;
            if (teamId) {
                return {
                    ...state,
                    processing: undefined,
                    aoUpdateSubscriptions: state.aoUpdateSubscriptions.filter(id => teamId !== id)
                };
            } else {
                return state;
            }
        }

        case UNSUBSCRIBE_USER_OF_AO_UPDATES_FAILURE: {
            return { ...state, processing: undefined };
        }

        default:
            return state;
    }
}
