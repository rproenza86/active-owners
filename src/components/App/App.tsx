import React, { useState, useEffect } from 'react';
import { Breadcrumb, Icon } from 'antd';
import { Cell, Row } from '@material/react-layout-grid';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import Splash from '../Splash/Splash';
import Main from '../layout/Main/Main.layout';
import ActiveOwner from '../ActiveOwner/ActiveOwner';
import Login from '../Login/Login';
import ProtectedRoute from '../ProtectedRoute';
import { getACList, ITeamsMemberHydrated } from '../../actions/activeOwners';
import TeamList from '../TeamList/TeamList';
import TeamMemberList from '../TeamMemberList/TeamMemberList';

import { IStateTree } from '../../types';

import './App.css';

interface INotificationStatus {
    isNotificationGranted: boolean;
    isNotificationBlocked: boolean;
}

interface IApp {
    isAuthenticated: boolean;
    isVerifying: boolean;
    loadAC: (isAuthenticated: boolean, uid: string) => void;
    activeOwners: ITeamsMemberHydrated[];
    user: firebase.User;
    notificationStatus: INotificationStatus;
}

export let UserContext: React.Context<firebase.User>;
export let NotificationStatusContext: React.Context<INotificationStatus>;

const App: React.FC<IApp> = ({
    isAuthenticated,
    isVerifying,
    loadAC,
    activeOwners,
    user,
    notificationStatus
}) => {
    const [isLoading, setIsLoading] = useState(true);

    UserContext = React.createContext(user);
    NotificationStatusContext = React.createContext(notificationStatus);

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

    const { isNotificationGranted, isNotificationBlocked } = state.cloudMessaging;

    return {
        isAuthenticated: state.auth.isAuthenticated,
        isVerifying: state.auth.isVerifying,
        activeOwners,
        user: state.auth.user,
        notificationStatus: { isNotificationGranted, isNotificationBlocked }
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        loadAC: (isAuthenticated: boolean, uid: string) => {
            isAuthenticated && dispatch(getACList(uid));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
