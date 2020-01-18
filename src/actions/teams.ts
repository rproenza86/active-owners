import { FSA, ActionCreator, ITeam } from '../types';

export const GET_TEAMS_LIST_SUCCESS = 'GET_TEAMS_LIST_SUCCESS';

interface GetTeamsListSuccessAction extends FSA<typeof GET_TEAMS_LIST_SUCCESS, ITeam[]> {}

export type TeamsActionTypes = GetTeamsListSuccessAction;

export const getTeamsListSuccess: ActionCreator<GetTeamsListSuccessAction> = (
    payload: ITeam[]
): TeamsActionTypes => {
    return {
        type: GET_TEAMS_LIST_SUCCESS,
        payload
    };
};
