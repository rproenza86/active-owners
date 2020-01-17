import React from 'react';

import { connect } from 'react-redux';

interface ITeamList {}

export interface ITeamListDispatchProps {}

export type ITeamListProps = ITeamList & ITeamListDispatchProps;

const TeamList: React.FC<ITeamListProps> = () => {
    return <h1>Teams list</h1>;
};

const mapStateToProps = (state: any) => {
    return {};
};

const mapDispatchToProps = (dispatch: any) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamList);
