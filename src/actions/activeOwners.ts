import { Dispatch } from 'redux';

import { FSA, ActionCreator, ITeam, ITeamMember, IUserSubscription } from '../types';
import { getTeamsListSuccess } from './teams';
import {
    getTeams,
    updateTeam,
    notifyUserOnAOUpdatesBy,
    getUserSubscriptions
} from '../services/teams';
import { getTeamsMembers } from '../services/teamsMembers';
import { sortList } from '../utils/sort';
import { notifyEvent } from '../utils/notification';
import { messaging } from '../services/cloudMessaging';
import { unsubscribeToAONotification } from '../services/commonDbOps';
import {
    saveMessagingSubscriptionSuccess,
    saveMessagingSubscriptionFailure,
    initCloudMessaging,
    initCloudMessagingDefault,
    unsubscribeUserOfAOUpdatesRequest,
    unsubscribeUserOfAOUpdatesFailure,
    unsubscribeUserOfAOUpdatesSuccess
} from './cloudMessaging';
import { isNotificationGranted } from '../utils/browserNotification';

export const GET_AC_LIST = 'GET_AC_LIST';
export const GET_AC_LIST_SUCCESS = 'GET_AC_LIST_SUCCESS';
export const GET_AC_LIST_FAILURE = 'GET_AC_LIST_FAILURE';

export interface ITeamsMemberHydrated extends ITeamMember {
    logo: string;
    teamName: string;
    isActiveOwner: boolean;
    teamImageUrl: string;
    teamLogoUrl: string;
    isNotificationSubscriber: boolean;
}

interface GetACListSuccessAction extends FSA<typeof GET_AC_LIST_SUCCESS, ITeamsMemberHydrated[]> {}

export type ActiveOwnerActionTypes = GetACListSuccessAction;

const getACListSuccess: ActionCreator<GetACListSuccessAction> = (
    payload: ITeamsMemberHydrated[]
): ActiveOwnerActionTypes => ({
    type: GET_AC_LIST_SUCCESS,
    payload
});

export const getTeamsMemberHydrated = (
    teamsMembers: ITeamMember[],
    teams: ITeam[],
    subscriptions: IUserSubscription[]
): ITeamsMemberHydrated[] =>
    teamsMembers.map((member: ITeamMember) => {
        let team: ITeam = {} as ITeam;
        for (const key in teams) {
            if (teams[key].id === member.teamId) {
                team = teams[key];
                break;
            }
        }
        const { location: teamLocation, logo = '', name: teamName, acId, id } = team;

        const isNotificationSubscriber =
            subscriptions.findIndex(subscription => subscription.teamId === id) >= 0;

        const teamsMemberHydrated = {
            ...member,
            logo,
            location: `${teamLocation} ${member.location}`,
            teamName,
            isActiveOwner: acId === member.id ? true : false,
            teamImageUrl: team.imageUrl || '',
            teamLogoUrl: team.logoUrl || '',
            isNotificationSubscriber
        };

        return teamsMemberHydrated;
    });

export const hydrateTeams = (teamsMembers: ITeamMember[], teamsP: ITeam[]): ITeam[] => {
    const teams: ITeam[] = [...teamsP];

    for (const member of teamsMembers) {
        for (const team of teams) {
            if (team.acId === member.id) {
                team.activeOwnerName = member.name;
            }
        }
    }

    return teams;
};

export const getACList = (uid: string) => async (dispatch: Dispatch) => {
    try {
        // TODO: For performance, refactor to PromiseAll solution
        const teams = await getTeams();
        const teamsMembers = await getTeamsMembers();
        const subscriptions = await getUserSubscriptions(uid, teams);

        if (subscriptions.length) {
            const { cloudMessagingToken, pushNotificationSubscription } = subscriptions[0];
            dispatch(
                initCloudMessaging(cloudMessagingToken, pushNotificationSubscription, subscriptions)
            );
        } else {
            isNotificationGranted && dispatch(initCloudMessagingDefault());
        }

        const teamsMemberHydrated: ITeamsMemberHydrated[] = getTeamsMemberHydrated(
            teamsMembers,
            teams,
            subscriptions
        );
        const teamsMemberHydratedSorted = sortList(
            teamsMemberHydrated,
            'teamName'
        ) as ITeamsMemberHydrated[];
        dispatch(getACListSuccess(teamsMemberHydratedSorted));

        const teamsHydrated = hydrateTeams(teamsMembers, teams);
        const teamsHydratedSorted = sortList(teamsHydrated, 'name') as ITeam[];
        dispatch(getTeamsListSuccess(teamsHydratedSorted));
    } catch (error) {
        console.log('Error getting document', error);
    }
};

export const updateTeamAO = (teamId: string, aoId: string, uid: string) => async (
    dispatch: any
) => {
    try {
        const result = await updateTeam(teamId, { acId: aoId });
        if (result.ok) {
            notifyEvent({
                type: 'success',
                message: 'Active Owner Update',
                description: 'The Team Active Owner was successfully updated '
            });

            dispatch(getACList(uid));
        }
    } catch (error) {
        notifyEvent({
            type: 'error',
            message: 'Active Owner Update',
            description:
                'An error happened while attempting to update the Team Active Owner. Update failed'
        });

        console.log(`Error updating team ${teamId}`, error);
    }
};

export const subscribeToTeamNotifications = (
    activeOwner: ITeamsMemberHydrated,
    pushNotificationSubscription: string,
    user: firebase.User
) => async (dispatch: any) => {
    try {
        const cloudMessagingToken = await messaging.getToken();
        const subscription: IUserSubscription = {
            uid: user.uid,
            name: user.displayName || '',
            email: user.email || '',
            cloudMessagingToken,
            pushNotificationSubscription,
            teamId: activeOwner.teamId
        };
        const result = await notifyUserOnAOUpdatesBy(activeOwner.teamId, subscription);
        if (result.ok) {
            notifyEvent({
                type: 'success',
                message: `Team ${activeOwner.teamName} Notification`,
                description:
                    'You have been successfully subscribed. You will be notified each time the Active Owner change.'
            });

            dispatch(saveMessagingSubscriptionSuccess());
        }
    } catch (error) {
        notifyEvent({
            type: 'error',
            message: `Team ${activeOwner.teamName} Notification`,
            description: 'An error happened while attempting to subscribe you. Subscription failed.'
        });

        console.error('subscribeToTeamNotifications error:', error);

        dispatch(
            saveMessagingSubscriptionFailure(new Error(`Team ${activeOwner.teamName} Notification`))
        );
    }
};

export const unSubscribeToTeamNotifications = (teamId: string, uid: string) => async (
    dispatch: any
) => {
    const dispatchError = () =>
        dispatch(
            unsubscribeUserOfAOUpdatesFailure(
                new Error(
                    `An error happened while attempting to unsubscribe you from  team ${teamId}. Un-subscription failed.`
                )
            )
        );
    try {
        dispatch(unsubscribeUserOfAOUpdatesRequest(teamId));

        const result = await unsubscribeToAONotification(uid, teamId);
        if (result.ok) {
            notifyEvent({
                type: 'success',
                message: `Team Notification`,
                description:
                    'You have been successfully unsubscribed. You will not be notified about Team Active Owner changes.'
            });
            dispatch(unsubscribeUserOfAOUpdatesSuccess(teamId));
        } else {
            dispatchError();
        }
    } catch (error) {
        notifyEvent({
            type: 'error',
            message: `Team Notification`,
            description:
                'An error happened while attempting to unsubscribe you. Un-subscription failed.'
        });

        console.error(error);
        dispatchError();
    }
};
