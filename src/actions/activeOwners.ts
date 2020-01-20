import { db } from '../firebase';
import { FSA, ActionCreator, ITeam, ITeamMember } from '../types';
import { getTeamsListSuccess } from './teams';
import { getTeams } from '../services/teams';
import { getTeamsMembers } from '../services/teamsMembers';

export const GET_AC_LIST = 'GET_AC_LIST';
export const GET_AC_LIST_SUCCESS = 'GET_AC_LIST_SUCCESS';
export const GET_AC_LIST_FAILURE = 'GET_AC_LIST_FAILURE';

export interface ITeamsMemberHydrated extends ITeamMember {
    logo: string;
    teamName: string;
    isActiveOwner: boolean;
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
        const { location: teamLocation, logo, name: teamName, acId } = team;

        const teamsMemberHydrated = {
            ...member,
            logo,
            location: `${teamLocation} ${member.location}`,
            teamName,
            isActiveOwner: acId === member.id ? true : false
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

export const getACList = () => async (dispatch: any) => {
    try {
        const teams = await getTeams();
        const teamsMembers = await getTeamsMembers();

        const teamsMemberHydrated: ITeamsMemberHydrated[] = getTeamsMemberHydrated(
            teamsMembers,
            teams
        );

        dispatch(getACListSuccess(teamsMemberHydrated));
        dispatch(getTeamsListSuccess(hydrateTeams(teamsMembers, teams)));
    } catch (error) {
        console.log('Error getting document', error);
    }
};

export const addUsersBatch = (userP?: any): void => {
    const users = userP || [
        {
            email: 'kevin.berry@coxautoinc.com',
            location: 'L15P142',
            name: 'Kevin Berry',
            slackId: '@kevin',
            teamId: 'gTFVYDFMqfrLdY6MJ48w'
        }
    ];

    users.map((user: any) => {
        return db
            .collection('team-members')
            .add(user)
            .then(function(docRef) {
                console.log('Document written with ID: ', docRef.id);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
    });
};

export const addTeamsBatch = (): void => {
    const teams = [
        {
            acId: '',
            location: 'ATL 3003',
            name: 'Horsepower',
            logo: ''
        },
        {
            acId: '',
            location: 'ATL 3003',
            name: 'Rocket',
            logo: ''
        },
        {
            acId: '',
            location: 'ATL 3003',
            name: 'Unimog',
            logo: ''
        },
        {
            acId: '',
            location: 'ATL 3003',
            name: 'GearShift',
            logo: ''
        },
        {
            acId: '',
            location: 'ATL 3003',
            name: 'Torque',
            logo: ''
        }
    ];
    const users = [
        {
            email: 'krunal.thakkar@coxautoinc.com',
            location: 'L15P142',
            name: 'Krunal Thakkar',
            slackId: '@krunal.thakkar',
            teamId: ''
        },
        {
            email: 'Felix.Guerrero@coxautoinc.com',
            location: 'L15P142',
            name: 'Felix Guerrero',
            slackId: '@felix',
            teamId: ''
        },
        {
            email: 'sravan.konda@coxautoinc.com',
            location: 'L15P142',
            name: 'Sravan Konda',
            slackId: '@sravan',
            teamId: ''
        },
        {
            email: 'lennox.antoine2@coxautoinc.com',
            location: 'L15P142',
            name: 'Lennox Antoine',
            slackId: '@lennox',
            teamId: ''
        },
        {
            email: 'Ethan.Garber@coxautoinc.com',
            location: 'L15P142',
            name: 'Ethan Garber',
            slackId: '@ethan',
            teamId: ''
        }
    ];

    let counter = 0;
    teams.map(user => {
        return db
            .collection('teams')
            .add(user)
            .then(function(docRef) {
                console.log('Document written with ID: ', docRef.id);
                users[counter++].teamId = docRef.id;
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            })
            .finally(() => addUsersBatch(users));
    });
};
