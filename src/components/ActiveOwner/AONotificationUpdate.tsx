/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import { connect } from 'react-redux';

import IconButton from '@material/react-icon-button';
import MaterialIcon from '@material/react-material-icon';
import { Popconfirm, Spin } from 'antd';

import { notificationPermissionRequest } from '../../actions/cloudMessaging';

import { IStateTree } from '../../types';
import {
    unSubscribeToTeamNotifications,
    subscribeToTeamNotifications,
    ITeamsMemberHydrated
} from '../../actions/activeOwners';

interface IAONotificationUpdateOwnProps {
    isNotificationBlocked?: boolean;
    isNotificationGranted?: boolean;
    user: firebase.User;
    activeOwner: ITeamsMemberHydrated;
    isProcessing?: boolean;
}

interface IActiveDispatchProps {
    onAWUpdateSubscribe: (
        activeOwner: ITeamsMemberHydrated,
        pushNotificationSubscription: string,
        user: firebase.User
    ) => void;
    onAWUpdateUnsubscribe?: (teamId: string, uid: string) => void;
    askNotificationPermission?: (teamId: string) => void;
}

interface IAONotificationUpdateProps extends IAONotificationUpdateOwnProps, IActiveDispatchProps {}

const AONotificationUpdate: React.FC<IAONotificationUpdateProps> = ({
    askNotificationPermission,
    isNotificationGranted,
    isNotificationBlocked,
    onAWUpdateUnsubscribe,
    onAWUpdateSubscribe,
    activeOwner,
    user,
    isProcessing
}) => {
    if (!askNotificationPermission || !onAWUpdateUnsubscribe || !onAWUpdateSubscribe) {
        throw new Error('AONotificationUpdate: Missing dispatch functions');
    }

    const [favIconType] = useState(
        activeOwner.isNotificationSubscriber ? 'favorite' : 'favorite_border'
    );

    const getConfirmText = () => {
        const askUserToSubscribe = isNotificationGranted && !activeOwner.isNotificationSubscriber;
        const askUserToUnsubscribe = isNotificationGranted && activeOwner.isNotificationSubscriber;
        const requestUserNotificationsPermission = !isNotificationGranted && !isNotificationBlocked;

        switch (true) {
            case askUserToSubscribe:
                return 'Do you want to be notified on Active Owner updates?';

            case askUserToUnsubscribe:
                return 'Do you want to stop been notified on Active Owner updates?';

            case requestUserNotificationsPermission:
                return 'Would you grant notifications permission?';

            case isNotificationBlocked:
                return 'Sorry, your browser notification is blocked.';

            default:
                break;
        }
    };

    const onFavIconClick = () => {
        const isNotificationsPermissionNeeded = !isNotificationGranted && !isNotificationBlocked;
        const isUserRequestingToUnsubscribe =
            isNotificationGranted && activeOwner.isNotificationSubscriber;
        const isUserRequestingToSubscribe =
            isNotificationGranted && !activeOwner.isNotificationSubscriber;

        if (isNotificationsPermissionNeeded || isUserRequestingToSubscribe) {
            askNotificationPermission(activeOwner.teamId);
        } else if (isUserRequestingToUnsubscribe) {
            onAWUpdateUnsubscribe(activeOwner.teamId, user.uid);
        }
    };

    return (
        <>
            {isProcessing && <Spin />}
            {!isProcessing && (
                <Popconfirm
                    title={getConfirmText()}
                    onConfirm={() => onFavIconClick()}
                    okText="Yes"
                    cancelText="No"
                >
                    <IconButton disabled={isNotificationBlocked}>
                        <MaterialIcon icon={favIconType} />
                    </IconButton>
                </Popconfirm>
            )}
        </>
    );
};

const mapStateToProps = (
    state: IStateTree,
    ownProps: IAONotificationUpdateOwnProps
): IAONotificationUpdateOwnProps => {
    /**
     * Patch to solve issue of change of subscription state
     */
    const isNotificationSubscriber =
        state.cloudMessaging.aoUpdateSubscriptions.indexOf(ownProps.activeOwner.teamId) !== -1;
    const aoSubscriptionPatch: ITeamsMemberHydrated = {
        ...ownProps.activeOwner,
        isNotificationSubscriber
    };
    const isProcessing = state.cloudMessaging.processing?.teamId === ownProps.activeOwner.teamId;

    const { isNotificationBlocked, isNotificationGranted } = state.cloudMessaging;
    return {
        ...ownProps,
        isNotificationBlocked,
        isNotificationGranted,
        activeOwner: aoSubscriptionPatch,
        isProcessing
    };
};

const mapDispatchToProps = (dispatch: any): IActiveDispatchProps => {
    return {
        askNotificationPermission: (teamId: string) =>
            dispatch(notificationPermissionRequest(teamId)),
        onAWUpdateSubscribe: (
            activeOwner: ITeamsMemberHydrated,
            pushNotificationSubscription: string,
            user: firebase.User
        ) =>
            user?.uid &&
            dispatch(subscribeToTeamNotifications(activeOwner, pushNotificationSubscription, user)),
        onAWUpdateUnsubscribe: (teamId: string, uid: string) =>
            uid && dispatch(unSubscribeToTeamNotifications(teamId, uid))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AONotificationUpdate);
