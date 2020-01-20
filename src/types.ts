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


export interface ITeamMember {
    name: string;
    email: string;
    location: string;
    slackId: string;
    teamId: string;
    id: string;
}

export interface ITeamsMembersState extends Array<ITeamsMemberHydrated> {}

export interface ITeamsObject {
    teamId: string;
    location: string;
    logo: string;
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

export interface IStateTree {
    auth: IAuthState;
    teamsMembers: ITeamsMembersState;
    teams: ITeam[];
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
