import { ITeam } from '../types';
import { TeamsActionTypes, GET_TEAMS_LIST_SUCCESS } from '../actions/teams';

const initialState: ITeam[] = [];

export function teams(state = initialState, action: TeamsActionTypes): ITeam[] {
    switch (action.type) {
        case GET_TEAMS_LIST_SUCCESS:
            return [...action.payload];
        default:
            return state;
    }
}
