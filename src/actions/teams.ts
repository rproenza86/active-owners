import { FSA, ActionCreator, ITeam, ITeamsObject } from '../types';
import { createDocument, updateDocument, deleteDocument } from '../services/commonDbOps';
import notifyEvent from '../utils/notification';
import { getACList } from './activeOwners';

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

export const addTeam = (team: ITeamsObject, uid: string) => async (dispatch: any) => {
    try {
        const result = await createDocument('teams', team);
        if (result.ok) {
            notifyEvent({
                type: 'success',
                message: 'Team Member Added',
                description: `${team.name} was successfully added as a new team`
            });

            dispatch(getACList(uid));
        }
    } catch (error) {
        notifyEvent({
            type: 'error',
            message: 'Team Member Added',
            description:
                // eslint-disable-next-line no-template-curly-in-string
                `An error happened while attempting to add ${team.name} as new team. Addition failed`
        });

        console.log(`Error attempting to add ${team.name} as new member`, error);
    }
};

export const updateTeam = (updatedTeam: ITeam, uid: string) => async (dispatch: any) => {
    try {
        const updatedTeamId = updatedTeam.id;
        delete updatedTeam.id;
        const result = await updateDocument('teams', updatedTeamId, updatedTeam);
        if (result.ok) {
            notifyEvent({
                type: 'success',
                message: 'Team Member Update',
                description: `The Team ${updatedTeam.name} was successfully updated.`
            });

            dispatch(getACList(uid));
        }
    } catch (error) {
        notifyEvent({
            type: 'error',
            message: 'Team Member Update',
            description: `An error happened while attempting to update the Team ${updatedTeam.name}. Update failed.`
        });

        console.log(`Error updating team ${updatedTeam.name}`, error);
    }
};

export const deleteTeam = (team: ITeam, uid: string) => {
    return async (dispatch: any) => {
        try {
            const result = await deleteDocument('teams', team.id);
            if (result.ok) {
                notifyEvent({
                    type: 'success',
                    message: 'Team Deletion',
                    description: `The Team ${team.name} was successfully deleted`
                });
                dispatch(getACList(uid));
            }
        } catch (error) {
            notifyEvent({
                type: 'error',
                message: 'Team Member Deletion',
                description: `An error happened while attempting to delete the Team ${team.name}. Deletion failed.`
            });
            console.log(`Error deleting team ${team.name}`, error);
        }
    };
};
