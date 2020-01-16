import { combineReducers } from "redux";
import auth from "./auth";
import { teamsMembers } from './teamsMembers';

export default combineReducers({ auth, teamsMembers });
