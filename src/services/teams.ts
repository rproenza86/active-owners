import { ITeam } from '../types';
import { getDocument } from './commonDbOps';

export const getTeams = (): Promise<ITeam[]> => getDocument<ITeam>('teams');
