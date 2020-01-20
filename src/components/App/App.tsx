import React, { useState, useEffect } from 'react';
import { Breadcrumb, Icon } from 'antd';

import Splash from '../Splash/Splash';
import Main from '../layout/Main/Main.layout';
import ActiveOwner from '../ActiveOwner/ActiveOwner';
import Login from '../Login/Login';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { getACList, ITeamsMemberHydrated } from '../../actions/activeOwners';
import { IStateTree } from '../../types';
import { Cell, Row } from '@material/react-layout-grid';
import TeamList from '../TeamList/TeamList';
import TeamMemberList from '../TeamMemberList/TeamMemberList';

import './App.css';

interface IApp {
    isAuthenticated: boolean;
    isVerifying: boolean;
    loadAC: (isAuthenticated: boolean) => void;
    activeOwners: ITeamsMemberHydrated[];
}

const App: React.FC<IApp> = ({ isAuthenticated, isVerifying, loadAC, activeOwners }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAC(isAuthenticated);
    }, [isAuthenticated, loadAC]);

    setTimeout(function() {
        setIsLoading(false);
    }, 3000);

    const Home = () => (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Icon type="home" />
                </Breadcrumb.Item>
                <Breadcrumb.Item>List of Active Owners</Breadcrumb.Item>
            </Breadcrumb>
            <Row>
                {activeOwners.map((ac, index) => (
                    <Cell desktopColumns={3} phoneColumns={4} tabletColumns={4} key={index}>
                        <ActiveOwner activeOwner={ac} />
                    </Cell>
                ))}
            </Row>
        </>
    );

    return (
        <div className="App">
            {isLoading ? (
                <Splash />
            ) : (
                <Switch>
                    <Main>
                        <ProtectedRoute
                            exact
                            path="/"
                            component={Home}
                            isAuthenticated={isAuthenticated}
                            isVerifying={isVerifying}
                        />
                        <Route path="/login" component={Login} />
                        <ProtectedRoute
                            exact
                            path="/teams"
                            component={TeamList}
                            isAuthenticated={isAuthenticated}
                            isVerifying={isVerifying}
                        />
                        <ProtectedRoute
                            exact
                            path="/engineers"
                            component={TeamMemberList}
                            isAuthenticated={isAuthenticated}
                            isVerifying={isVerifying}
                        />
                    </Main>
                </Switch>
            )}
        </div>
    );
};

const mapStateToProps = (state: IStateTree) => {
    const activeOwners: ITeamsMemberHydrated[] = state.teamsMembers.filter(
        (member: ITeamsMemberHydrated) => member.isActiveOwner
    );

    return {
        isAuthenticated: state.auth.isAuthenticated,
        isVerifying: state.auth.isVerifying,
        activeOwners
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        loadAC: (isAuthenticated: boolean) => {
            isAuthenticated && dispatch(getACList());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
