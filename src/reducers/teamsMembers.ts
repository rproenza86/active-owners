import { ITeamsMembersState } from '../types';
import { ActiveOwnerActionTypes, GET_AC_LIST_SUCCESS } from '../actions/activeOwners';

const initialState: ITeamsMembersState = [];

export function teamsMembers(
    state = initialState,
    action: ActiveOwnerActionTypes
): ITeamsMembersState {
    switch (action.type) {
        case GET_AC_LIST_SUCCESS:
            return [...action.payload];
        default:
            return state;
    }
}
