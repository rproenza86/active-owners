import { ITeamMember } from '../types';
import { getDocument } from './commonDbOps';

export const getTeamsMembers = (): Promise<ITeamMember[]> =>
           getDocument<ITeamMember>('team-members');
