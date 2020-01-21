import { ITeamMember, IDBOpsSimpleResult, ITeamMemberCore } from '../types';
import { getDocument, updateDocument } from './commonDbOps';

export const getTeamsMembers = (): Promise<ITeamMember[]> =>
    getDocument<ITeamMember>('team-members');

export const updateTeamMember = (
    docId: string,
    updateObj: ITeamMemberCore
): Promise<IDBOpsSimpleResult> => updateDocument('team-members', docId, updateObj);
