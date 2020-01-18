import { combineReducers } from 'redux';
import auth from './auth';
import { teamsMembers } from './teamsMembers';
import { teams } from './teams';

export default combineReducers({ auth, teamsMembers, teams });
