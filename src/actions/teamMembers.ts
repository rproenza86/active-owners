import { ITeamMemberCore } from '../types';
import { notifyEvent } from '../utils/notification';
import { getACList } from './activeOwners';
import { createDocument } from '../services/commonDbOps';

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
