import React from 'react';

import { connect } from 'react-redux';

interface ITeamMemberList {}

export interface ITeamMemberListDispatchProps {}

export type ITeamMemberListProps = ITeamMemberList & ITeamMemberListDispatchProps;

const TeamMemberList: React.FC<ITeamMemberListProps> = () => {
    return <h1>Teams members list</h1>;
};

const mapStateToProps = (state: any) => {
    return {};
};

const mapDispatchToProps = (dispatch: any) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamMemberList);
