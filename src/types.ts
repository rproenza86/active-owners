import { Action } from 'redux';
import { ITeamsMemberHydrated } from './actions/activeOwners';

export interface IDocument {
    key: string;
    name: string;
    value: string;
    iconName: string;
    fileType: string;
    modifiedBy: string;
    dateModified: string;
    dateModifiedValue: number;
    fileSize: string;
    fileSizeRaw: number;
}

export interface IAuthState {
    isLoggingIn: boolean;
    isLoggingOut: boolean;
    isVerifying: boolean;
    loginError: boolean;
    logoutError: boolean;
    isAuthenticated: boolean;
    verifyingError: boolean;
    user: firebase.User;
}

export interface ITeamMemberCore {
    name: string;
    email: string;
    location: string;
    slackId: string;
    teamId: string;
}

export interface ITeamMember extends ITeamMemberCore {
    id: string;
}

export interface ITeamsMembersState extends Array<ITeamsMemberHydrated> {}

export interface ITeamsObject {
    location: string;
    logo?: string;
    logoUrl?: string;
    image?: string;
    imageUrl?: string;
    name: string;
    acId?: string;
    activeOwnerName?: string;
}

export interface ITeamsState {
    [id: string]: ITeamsObject;
}

export interface ITeam extends ITeamsObject {
    id: string;
}

export interface ICloudNotificationState {
    cloudMessagingToken: string;
    pushNotificationSubscription: string;
    isNotificationGranted: boolean;
    isNotificationBlocked: boolean;
    aoUpdateSubscriptions: Array<string>
    processing?: {
        teamId: string;
    };
}

export interface IStateTree {
    auth: IAuthState;
    teamsMembers: ITeamsMembersState;
    teams: ITeam[];
    cloudMessaging: ICloudNotificationState;
}

export interface SimpleFSA<T> extends Action {
    type: T;
}

export interface FSA<T, P> extends SimpleFSA<T> {
    payload?: P;
}

export interface FSAWithMeta<T, P, M> extends FSA<T, P> {
    meta?: M;
}

export interface AnyFSA extends FSAWithMeta<string, any, any> {}

export interface ActionCreator<A> {
    (...args: any[]): A;
}

export type Reducer<S = IStateTree, A = AnyFSA> = (state: S, action: A) => S;

export interface IDBOpsSimpleResult {
    ok: boolean;
    msg: string;
}

export interface IUserSubscription {
    teamId: string;
    uid: string;
    name: string;
    email: string;
    cloudMessagingToken: string;
    pushNotificationSubscription: string;
}

export type TSubscribeToTeamNotifications = (
    activeOwner: ITeamsMemberHydrated,
    pushNotificationSubscription: string,
    uid: string
) => (dispatch: any) => Promise<void>;
