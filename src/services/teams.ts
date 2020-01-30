import { ITeam, IDBOpsSimpleResult, IUserSubscription } from '../types';
import {
    getDocument,
    updateDocument,
    subscribeToAONotification,
    getTeamsAOSubscriptions,
    unsubscribeToAONotification
} from './commonDbOps';

export const getTeams = (): Promise<ITeam[]> => getDocument<ITeam>('teams');

export const updateTeam = (docId: string, updateObj: any): Promise<IDBOpsSimpleResult> =>
    updateDocument('teams', docId, updateObj);

export const getUserSubscriptions = async (uid: string, teams: ITeam[]) => {
    const subscriptions: IUserSubscription[] = await getTeamsAOSubscriptions<IUserSubscription>(
        uid
    );
    return subscriptions;
};

export const notifyUserOnAOUpdatesBy = (
    teamId: string,
    withUserSubscription: IUserSubscription
): Promise<IDBOpsSimpleResult> => subscribeToAONotification(teamId, withUserSubscription);

export const unsubscribeUserOfTeamACUpdates = (
    uid: string,
    teamId: string
): Promise<IDBOpsSimpleResult> => unsubscribeToAONotification(uid, teamId);
