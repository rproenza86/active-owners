import { ITeam, IDBOpsSimpleResult } from '../types';
import { getDocument, updateDocument } from './commonDbOps';

export const getTeams = (): Promise<ITeam[]> => getDocument<ITeam>('teams');

export const updateTeam = (docId: string, updateObj: any): Promise<IDBOpsSimpleResult> =>
    updateDocument('teams', docId, updateObj);
