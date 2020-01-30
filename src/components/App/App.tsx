import React, { useState, useEffect } from 'react';
import { Breadcrumb, Icon } from 'antd';

import Splash from '../Splash/Splash';
import Main from '../layout/Main/Main.layout';
import ActiveOwner from '../ActiveOwner/ActiveOwner';
import Login from '../Login/Login';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import {
    getACList,
    ITeamsMemberHydrated,
    subscribeToTeamNotifications,
    unSubscribeToTeamNotifications
} from '../../actions/activeOwners';
import { IStateTree } from '../../types';
import { Cell, Row } from '@material/react-layout-grid';
import TeamList from '../TeamList/TeamList';
import TeamMemberList from '../TeamMemberList/TeamMemberList';

import './App.css';

interface IApp {
    isAuthenticated: boolean;
    isVerifying: boolean;
    loadAC: (isAuthenticated: boolean, uid: string) => void;
    activeOwners: ITeamsMemberHydrated[];
    handleTeamNotificationSubscription: (
        activeOwner: ITeamsMemberHydrated,
        pushNotificationSubscription: string,
        user: firebase.User
    ) => void;
    handleTeamNotificationUnSubscription: (teamId: string, uid: string) => void;
    user: firebase.User;
}

export let UserContext: React.Context<firebase.User>;

const App: React.FC<IApp> = ({
    isAuthenticated,
    isVerifying,
    loadAC,
    activeOwners,
    user,
    handleTeamNotificationSubscription,
    handleTeamNotificationUnSubscription
}) => {
    const [isLoading, setIsLoading] = useState(true);

    UserContext = React.createContext(user);

    useEffect(() => {
        loadAC(isAuthenticated, user.uid);
    }, [isAuthenticated, loadAC, user]);

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
                        <ActiveOwner
                            activeOwner={ac}
                            onTeamNotificationSubscription={(
                                activeOwner: ITeamsMemberHydrated,
                                pushNotificationSubscription: string
                            ) =>
                                handleTeamNotificationSubscription(
                                    activeOwner,
                                    pushNotificationSubscription,
                                    user
                                )
                            }
                            onTeamNotificationUnSubscription={() =>
                                handleTeamNotificationUnSubscription(ac.teamId, user.uid)
                            }
                        />
                    </Cell>
                ))}
            </Row>
        </>
    );

    return (
        <UserContext.Provider value={user}>
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
        </UserContext.Provider>
    );
};

const mapStateToProps = (state: IStateTree) => {
    const activeOwners: ITeamsMemberHydrated[] = state.teamsMembers.filter(
        (member: ITeamsMemberHydrated) => member.isActiveOwner
    );

    return {
        isAuthenticated: state.auth.isAuthenticated,
        isVerifying: state.auth.isVerifying,
        activeOwners,
        user: state.auth.user
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        loadAC: (isAuthenticated: boolean, uid: string) => {
            isAuthenticated && dispatch(getACList(uid));
        },
        handleTeamNotificationSubscription: (
            activeOwner: ITeamsMemberHydrated,
            pushNotificationSubscription: string,
            user: firebase.User
        ) =>
            user?.uid &&
            dispatch(subscribeToTeamNotifications(activeOwner, pushNotificationSubscription, user)),
        handleTeamNotificationUnSubscription: (teamId: string, uid: string) =>
            uid && dispatch(unSubscribeToTeamNotifications(teamId, uid))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
