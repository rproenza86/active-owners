import React, { useState, useEffect } from 'react';

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

interface IApp {
    isAuthenticated: boolean;
    isVerifying: boolean;
    loadAC: () => void;
    activeOwners: ITeamsMemberHydrated[];
}

const App: React.FC<IApp> = ({ isAuthenticated, isVerifying, loadAC, activeOwners }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAC();
    }, [loadAC]);

    setTimeout(function() {
        setIsLoading(false);
    }, 3000);

    const Home = () => (
        <Main>
            <Row>
                {activeOwners.map((ac, index) => (
                    <>
                        <Cell desktopColumns={3} phoneColumns={4} tabletColumns={4} key={index}>
                            <ActiveOwner activeOwner={ac} />
                        </Cell>

                        <Cell desktopColumns={3} phoneColumns={4} tabletColumns={4} key={index}>
                            <ActiveOwner activeOwner={ac} />
                        </Cell>
                        <Cell desktopColumns={3} phoneColumns={4} tabletColumns={4} key={index}>
                            <ActiveOwner activeOwner={ac} />
                        </Cell>
                        <Cell desktopColumns={3} phoneColumns={4} tabletColumns={4} key={index}>
                            <ActiveOwner activeOwner={ac} />
                        </Cell>
                    </>
                ))}
            </Row>
        </Main>
    );

    return (
        <div className="App">
            {isLoading ? (
                <Splash />
            ) : (
                <Switch>
                    <ProtectedRoute
                        exact
                        path="/"
                        component={Home}
                        isAuthenticated={isAuthenticated}
                        isVerifying={isVerifying}
                    />
                    <Route path="/login" component={Login} />
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
        loadAC: () => {
            dispatch(getACList());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
