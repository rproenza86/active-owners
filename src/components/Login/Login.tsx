import React from 'react';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import Card, { CardPrimaryContent } from '@material/react-card';
import MaterialIcon from '@material/react-material-icon';

import './Login.scss';
import { Button } from '@material/react-button';
import google from './google.svg';
import github from './github.svg';
import { requestLogin, receiveLogin, loginError, logoutUser } from '../../actions';
import { connect } from 'react-redux';
import firebase, { auth } from '../../firebase';
import { Redirect } from 'react-router-dom';

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
    const provider = new firebase.auth.GoogleAuthProvider();

    const googleSignIn = () => {
        auth.signInWithPopup(provider)
            .then(function(result) {
                handleLogin(result.user);
            })
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
                return {
                    errorCode,
                    errorMessage,
                    email,
                    credential
                };
            });
    };
    if (isAuthenticated) {
        return <Redirect to="/" />;
    } else {
        return (
            <Grid className="login-container">
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
                            <CardPrimaryContent>
                                <Grid>
                                    <Row>
                                        <Cell
                                            desktopColumns={12}
                                            phoneColumns={4}
                                            tabletColumns={8}
                                        >
                                            <Button
                                                outlined
                                                icon={
                                                    <img
                                                        src={github}
                                                        className="github-logo"
                                                        alt="github-logo"
                                                    />
                                                }
                                            >
                                                Login with Github
                                            </Button>
                                        </Cell>
                                    </Row>
                                    <Row>
                                        <Cell
                                            desktopColumns={12}
                                            phoneColumns={4}
                                            tabletColumns={8}
                                        >
                                            <Button
                                                outlined
                                                onClick={() => googleSignIn()}
                                                icon={
                                                    <img
                                                        src={google}
                                                        className="google-logo"
                                                        alt="google-logo"
                                                    />
                                                }
                                            >
                                                Login with Google
                                            </Button>
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
