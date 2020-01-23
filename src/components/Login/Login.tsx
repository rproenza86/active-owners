/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { connect } from 'react-redux';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import Card, { CardPrimaryContent } from '@material/react-card';
import MaterialIcon from '@material/react-material-icon';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { requestLogin, receiveLogin, loginError, logoutUser } from '../../actions';
import firebase, { auth } from '../../firebase';
import { Redirect } from 'react-router-dom';
import { useAnimation } from '../common/hooks';

import './Login.scss';

export interface ILoginStateProps {
    isLoggingIn: boolean;
    loginError: any;
    isAuthenticated: boolean;
}

export interface ILoginDispatchProps {
    handleLogin: (userObject: firebase.User | null) => void;
}

export type ILoginProps = ILoginStateProps & ILoginDispatchProps;

const Login: React.FC<ILoginProps> = ({ handleLogin, isAuthenticated }) => {
    // animation control
    const [animate, setAnimate] = useAnimation();

    // Configure FirebaseUI.
    const config = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
        signInSuccessUrl: '/',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.GithubAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            // Called when the user has been successfully signed in.
            signInSuccessWithAuthResult: function(authResult: any, redirectUrl: string) {
                if (authResult.user) {
                    setAnimate(false);
                    handleLogin(authResult.user);
                }
                if (authResult.additionalUserInfo) {
                    const additionalUserInfo = authResult.additionalUserInfo.isNewUser
                        ? 'New User'
                        : 'Existing User';
                    console.log(additionalUserInfo);
                }
                // Do not redirect.
                return false;
            },
            signInFailure: (error: firebaseui.auth.AuthUIError): any => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                const fullError = error.toJSON;
                // The firebase.auth.AuthCredential type that was used.
                const credential = error.credential;
                // ...
                const toLog = {
                    errorCode,
                    errorMessage,
                    fullError,
                    credential
                };

                console.error(toLog);
            }
        }
    };

    if (isAuthenticated) {
        return <Redirect to="/" />;
    } else {
        return (
            <Grid className={`login-container${animate ? '--animating' : ''}`}>
                <Row>
                    <Cell className="header" desktopColumns={12} phoneColumns={4} tabletColumns={8}>
                        <Card className="mdc-elevation--z16">
                            <CardPrimaryContent>
                                <h1>
                                    <MaterialIcon icon="lock" />
                                    Login
                                </h1>
                            </CardPrimaryContent>
                        </Card>
                    </Cell>
                </Row>
                <Row className="body">
                    <Cell desktopColumns={12} phoneColumns={4} tabletColumns={8}>
                        <Card>
                            <CardPrimaryContent className="mdc-elevation--z8">
                                <Grid>
                                    <Row>
                                        <Cell
                                            desktopColumns={12}
                                            phoneColumns={4}
                                            tabletColumns={8}
                                        >
                                            <StyledFirebaseAuth
                                                uiConfig={config}
                                                firebaseAuth={auth}
                                            />
                                        </Cell>
                                    </Row>
                                </Grid>

                                <p> Login into the web application to be able of make changes</p>
                            </CardPrimaryContent>
                        </Card>
                    </Cell>
                </Row>
            </Grid>
        );
    }
};

function mapStateToProps(state: any) {
    return {
        isLoggingIn: state.auth.isLoggingIn,
        loginError: state.auth.loginError,
        isAuthenticated: state.auth.isAuthenticated
    };
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        handleLogin: (userObject: firebase.User | null) => {
            dispatch(requestLogin());

            if (userObject) {
                dispatch(receiveLogin(userObject));
            } else {
                dispatch(loginError());
            }
        },
        handleLogout: () => {
            dispatch(logoutUser());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
