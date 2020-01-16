import { db } from '../firebase';
import { FSA, ActionCreator } from '../types';

export const GET_AC_LIST = 'GET_AC_LIST';
export const GET_AC_LIST_SUCCESS = 'GET_AC_LIST_SUCCESS';
export const GET_AC_LIST_FAILURE = 'GET_AC_LIST_FAILURE';

interface ITeamsObject {
    teamId: string;
    location: string;
    logo: string;
    name: string;
    acID?: string;
}

interface ITeams {
    [id: string]: ITeamsObject;
}

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
}

interface GetACListSuccessAction extends FSA<typeof GET_AC_LIST_SUCCESS, ITeamsMemberHydrated[]> {}

export type ActiveOwnerActionTypes = GetACListSuccessAction;

const getACListSuccess: ActionCreator<GetACListSuccessAction> = (
    payload: ITeamsMemberHydrated[]
): ActiveOwnerActionTypes => ({
    type: GET_AC_LIST_SUCCESS,
    payload
});

export const getACList = () => (dispatch: any) => {
    const teamsRef = db.collection('teams');
    const teamsMembersRef = db.collection('team-members');

    let getTeamsDoc = (): Promise<ITeams> =>
        teamsRef.get().then(querySnapshot => {
            const teams: ITeams = {};

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

            const teamsMemberHydrated: ITeamsMemberHydrated[] = teamsMembers.map(
                (member: ITeamMember) => {
                    const { location: teamLocation, logo, name: teamName, acID } = teams[
                        member.teamId
                    ];
                    return {
                        ...member,
                        logo,
                        location: `${teamLocation} ${member.location}`,
                        teamName,
                        isActiveOwner: acID === member.teamMemberId ? true : false
                    };
                }
            );
            dispatch(getACListSuccess(teamsMemberHydrated));
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
};

export const addUsersBatch = (): void => {
    const users = [
        {
            email: 'kevin.berry@coxautoinc.com',
            location: 'L15P142',
            name: 'Kevin Berry',
            slackId: '@kevin',
            teamId: 'gTFVYDFMqfrLdY6MJ48w'
        }
    ];

    users.map(user => {
        return db.collection('team-members')
            .add(user)
            .then(function(docRef) {
                console.log('Document written with ID: ', docRef.id);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
    });
};
