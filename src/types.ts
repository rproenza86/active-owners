import { Action } from 'redux';
import { ITeamsMemberHydrated } from './actions/activeOwners';

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

export interface ITeamsMembersState extends Array<ITeamsMemberHydrated> {}

export interface IStateTree {
    auth: IAuthState;
    teamsMembers: ITeamsMembersState;
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
