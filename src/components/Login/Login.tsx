import React from 'react';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import Card, { CardPrimaryContent } from '@material/react-card';
import MaterialIcon from '@material/react-material-icon';

import './Login.scss';
import { Button } from '@material/react-button';
import google from './google.svg';
import github from './github.svg';

const Login: React.FC = () => {
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
                                    <Cell desktopColumns={12} phoneColumns={4} tabletColumns={8}>
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
                                    <Cell desktopColumns={12} phoneColumns={4} tabletColumns={8}>
                                        <Button
                                            outlined
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
};

export default Login;
