import { ITeamMemberCore, ITeamMember } from '../types';
import { notifyEvent } from '../utils/notification';
import { getACList } from './activeOwners';
import { createDocument, updateDocument, deleteDocument } from '../services/commonDbOps';

export const addTeamMember = (teamMember: ITeamMemberCore) => async (dispatch: any) => {
    try {
        const result = await createDocument('team-members', teamMember);
        if (result.ok) {
            notifyEvent({
                type: 'success',
                message: 'Team Member Added',
                description: `${teamMember.name} was successfully added as member of the team`
            });

            dispatch(getACList());
        }
    } catch (error) {
        notifyEvent({
            type: 'error',
            message: 'Team Member Added',
            description:
                // eslint-disable-next-line no-template-curly-in-string
                'An error happened while attempting to add ${teamMember.name} as new team member. Update failed'
        });

        console.log(`Error attempting to add ${teamMember.name} as new team member`, error);
    }
};

export const updateTeamMember = (
    teamMemberId: string,
    updatedTeamMember: ITeamMemberCore
) => async (dispatch: any) => {
    try {
        const result = await updateDocument('team-members', teamMemberId, updatedTeamMember);
        if (result.ok) {
            notifyEvent({
                type: 'success',
                message: 'Team Member Update',
                description: `The Team Member ${updatedTeamMember.name} was successfully updated`
            });

            dispatch(getACList());
        }
    } catch (error) {
        notifyEvent({
            type: 'error',
            message: 'Team Member Update',
            description: `An error happened while attempting to update the Team Member ${updatedTeamMember.name}. Update failed`
        });

        console.log(`Error updating team ${updatedTeamMember.name}`, error);
    }
};

export const deleteTeamMember = (teamMember: ITeamMember) => {
    return async (dispatch: any) => {
        try {
            const result = await deleteDocument('team-members', teamMember.id);
            if (result.ok) {
                notifyEvent({
                    type: 'success',
                    message: 'Team Member Update',
                    description: `The Team Member ${teamMember.name} was successfully deleted`
                });
                dispatch(getACList());
            }
        } catch (error) {
            notifyEvent({
                type: 'error',
                message: 'Team Member Update',
                description: `An error happened while attempting to delete the Team Member ${teamMember.name}. Deletion failed`
            });
            console.log(`Error deleting member ${teamMember.name}`, error);
        }
    };
};
