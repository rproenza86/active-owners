import { db } from '../firebase';
import { FSA, ActionCreator, ITeamsState, ITeamsObject, ITeam } from '../types';
import { getTeamsListSuccess } from './teams';

export const GET_AC_LIST = 'GET_AC_LIST';
export const GET_AC_LIST_SUCCESS = 'GET_AC_LIST_SUCCESS';
export const GET_AC_LIST_FAILURE = 'GET_AC_LIST_FAILURE';

interface ITeamMember {
    name: string;
    email: string;
    location: string;
    slackId: string;
    teamId: string;
    teamMemberId: string;
}

export interface ITeamsMemberHydrated extends ITeamMember {
    logo: string;
    teamName: string;
    isActiveOwner: boolean;
    id?: string;
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
    teams: ITeamsState
): ITeamsMemberHydrated[] =>
    teamsMembers.map((member: ITeamMember) => {
        const { location: teamLocation, logo, name: teamName, acId } = teams[member.teamId];

        const teamsMemberHydrated = {
            ...member,
            logo,
            location: `${teamLocation} ${member.location}`,
            teamName,
            isActiveOwner: acId === member.teamMemberId ? true : false
        };

        return teamsMemberHydrated;
    });

export const hydrateTeams = (teamsMembers: ITeamMember[], teamsP: ITeamsState): ITeam[] => {
    const teamsIds = Object.getOwnPropertyNames(teamsP);
    const teams: ITeam[] = [];
    const teamsMembersHash: Array<{ [index: string]: string }> = [];

    for (const member of teamsMembers) {
        (teamsMembersHash as any)[member.teamMemberId] = member.name;
    }

    teamsIds.map(id =>
        teams.push({
            ...teamsP[id],
            id: teamsP[id].teamId,
            activeOwnerName: teamsMembersHash[(teamsP as any)[id].acId] as any
        })
    );
    debugger;
    return teams;
};

export const getACList = () => (dispatch: any) => {
    const teamsRef = db.collection('teams');
    const teamsMembersRef = db.collection('team-members');

    let getTeamsDoc = (): Promise<ITeamsState> =>
        teamsRef.get().then(querySnapshot => {
            const teams: ITeamsState = {};

            querySnapshot.forEach(doc => {
                teams[doc.id] = doc.data() as ITeamsObject;
            });

            return teams;
        });

    let teamsMembersDoc = (): Promise<ITeamMember[]> =>
        teamsMembersRef.get().then(querySnapshot => {
            const teamsMembers: ITeamMember[] = [];

            querySnapshot.forEach(doc => {
                teamsMembers.push({ teamMemberId: doc.id, ...doc.data() } as ITeamMember);
            });

            return teamsMembers;
        });

    Promise.all([getTeamsDoc(), teamsMembersDoc()])
        .then(values => {
            const [teams, teamsMembers] = values;

            const teamsMemberHydrated: ITeamsMemberHydrated[] = getTeamsMemberHydrated(
                teamsMembers,
                teams
            );

            dispatch(getACListSuccess(teamsMemberHydrated));
            dispatch(getTeamsListSuccess(hydrateTeams(teamsMembers, teams)));
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
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
