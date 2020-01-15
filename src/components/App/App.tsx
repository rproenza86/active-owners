import React, { useState } from 'react';

import Splash from '../Splash/Splash';
import Main from '../layout/Main/Main.layout';
import ActiveOwner from '../ActiveOwner/ActiveOwner';
import Login from '../Login/Login';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';

interface IApp {
    isAuthenticated: boolean;
    isVerifying: boolean;
}

const Home = () => (
    <Main>
        <ActiveOwner />
    </Main>
);

const App: React.FC<IApp> = ({ isAuthenticated, isVerifying }) => {
    const [isLoading, setIsLoading] = useState(true);

    setTimeout(function() {
        setIsLoading(false);
    }, 1000);

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

function mapStateToProps(state: any) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        isVerifying: state.auth.isVerifying
    };
}

export default connect(mapStateToProps)(App);
