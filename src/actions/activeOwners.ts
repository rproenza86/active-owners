import { Dispatch } from 'redux';

import { FSA, ActionCreator, ITeam, ITeamMember } from '../types';
import { getTeamsListSuccess } from './teams';
import { getTeams, updateTeam } from '../services/teams';
import { getTeamsMembers } from '../services/teamsMembers';
import { sortList } from '../utils/sort';
import { notifyEvent } from '../utils/notification';

export const GET_AC_LIST = 'GET_AC_LIST';
export const GET_AC_LIST_SUCCESS = 'GET_AC_LIST_SUCCESS';
export const GET_AC_LIST_FAILURE = 'GET_AC_LIST_FAILURE';

export interface ITeamsMemberHydrated extends ITeamMember {
    logo: string;
    teamName: string;
    isActiveOwner: boolean;
    teamImageUrl: string;
}

interface GetACListSuccessAction extends FSA<typeof GET_AC_LIST_SUCCESS, ITeamsMemberHydrated[]> {}

export type ActiveOwnerActionTypes = GetACListSuccessAction;

const getACListSuccess: ActionCreator<GetACListSuccessAction> = (
    payload: ITeamsMemberHydrated[]
): ActiveOwnerActionTypes => ({
    type: GET_AC_LIST_SUCCESS,
    payload
});

export const getTeamsMemberHydrated = (
    teamsMembers: ITeamMember[],
    teams: ITeam[]
): ITeamsMemberHydrated[] =>
    teamsMembers.map((member: ITeamMember) => {
        let team: ITeam = {} as ITeam;
        for (const key in teams) {
            if (teams[key].id === member.teamId) {
                team = teams[key];
            }
        }
        const { location: teamLocation, logo = '', name: teamName, acId } = team;

        const teamsMemberHydrated = {
            ...member,
            logo,
            location: `${teamLocation} ${member.location}`,
            teamName,
            isActiveOwner: acId === member.id ? true : false,
            teamImageUrl: team.imageUrl || ''
        };

        return teamsMemberHydrated;
    });

export const hydrateTeams = (teamsMembers: ITeamMember[], teamsP: ITeam[]): ITeam[] => {
    const teams: ITeam[] = [...teamsP];

    for (const member of teamsMembers) {
        for (const team of teams) {
            if (team.acId === member.id) {
                team.activeOwnerName = member.name;
            }
        }
    }

    return teams;
};

export const getACList = () => async (dispatch: Dispatch) => {
    try {
        const teams = await getTeams();
        const teamsMembers = await getTeamsMembers();

        const teamsMemberHydrated: ITeamsMemberHydrated[] = getTeamsMemberHydrated(
            teamsMembers,
            teams
        );
        const teamsMemberHydratedSorted = sortList(
            teamsMemberHydrated,
            'teamName'
        ) as ITeamsMemberHydrated[];
        dispatch(getACListSuccess(teamsMemberHydratedSorted));

        const teamsHydrated = hydrateTeams(teamsMembers, teams);
        const teamsHydratedSorted = sortList(teamsHydrated, 'name') as ITeam[];
        dispatch(getTeamsListSuccess(teamsHydratedSorted));
    } catch (error) {
        console.log('Error getting document', error);
    }
};

export const updateTeamAO = (teamId: string, aoId: string) => async (dispatch: any) => {
    try {
        const result = await updateTeam(teamId, { acId: aoId });
        if (result.ok) {
            notifyEvent({
                type: 'success',
                message: 'Active Owner Update',
                description: 'The Team Active Owner was successfully updated '
            });

            dispatch(getACList());
        }
    } catch (error) {
        notifyEvent({
            type: 'error',
            message: 'Active Owner Update',
            description:
                'An error happened while attempting to update the Team Active Owner. Update failed'
        });

        console.log(`Error updating team ${teamId}`, error);
    }
};
