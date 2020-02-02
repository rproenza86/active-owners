import { combineReducers } from 'redux';
import auth from './auth';
import { teamsMembers } from './teamsMembers';
import { teams } from './teams';
import { cloudMessaging } from './cloudMessaging';

export default combineReducers({ auth, teamsMembers, teams, cloudMessaging });
