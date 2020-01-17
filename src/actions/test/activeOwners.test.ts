// test related dependencies
import 'jest';

// functions
import { getTeamsMemberHydrated } from '../activeOwners';

// mock state
import { teams, teamsMembers } from './__mocks__/activeOwnersMocks';

describe('getTeamsMemberHydrated', () => {
    it('should get the right active owners', () => {
        // test
        const result = getTeamsMemberHydrated(teamsMembers, teams as any);
        const acResult = result.filter(member => member.isActiveOwner);

        expect(acResult.length).toBe(6);
    });
});
