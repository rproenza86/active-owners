import React, { useState } from 'react';
import TopAppBar, {
    TopAppBarFixedAdjust,
    TopAppBarIcon,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarTitle
} from '@material/react-top-app-bar';
import MaterialIcon from '@material/react-material-icon';
import { Cell, Grid, Row } from '@material/react-layout-grid';

import Drawer from './Drawer.layout';

import './Main.layout.scss';
import '@material/react-list/dist/list.css';
import { logoutUser } from '../../../actions';
import { connect } from 'react-redux';
import User from '../../User/User';

interface IMain {
    children: React.ReactNode;
    user: firebase.User
}

export interface IMainDispatchProps {
    handleLogout: () => void;
}

export type IMainProps = IMain & IMainDispatchProps;

const Main: React.FC<IMainProps> = ({ children, user, handleLogout }) => {
    const mainContentEl: any = React.createRef();

    const [open, setOpen] = useState(false);

    const onListItemClickCallback = (actionIndex: number) => {
        console.log(`list item: ${actionIndex}`);
    };

    return (
        <div className="drawer-container">
            <TopAppBar>
                <TopAppBarRow>
                    <TopAppBarSection align="start">
                        <TopAppBarIcon navIcon tabIndex={0}>
                            <MaterialIcon
                                hasRipple
                                icon="menu"
                                onClick={() => setOpen(true)}
                                ref={mainContentEl}
                            />
                        </TopAppBarIcon>
                        <TopAppBarTitle>Active Owner Registry</TopAppBarTitle>
                    </TopAppBarSection>
                    <TopAppBarSection align="end" role="toolbar">
                        <TopAppBarIcon actionItem tabIndex={0}>
                            <User logoutHandler={handleLogout} displayName={user?.displayName} image={user?.photoURL}/>
                        </TopAppBarIcon>
                    </TopAppBarSection>
                </TopAppBarRow>
            </TopAppBar>
            <TopAppBarFixedAdjust>
                <Grid>
                    <Row>
                        <Cell columns={4}>{children}</Cell>
                        <Cell columns={4}>{children}</Cell>
                        <Cell columns={4}>{children}</Cell>
                    </Row>
                </Grid>
            </TopAppBarFixedAdjust>

            <Drawer
                isOpen={open}
                setIsOpen={setOpen}
                onListItemClickCallback={onListItemClickCallback}
            />
        </div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        user: state?.auth?.user
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        handleLogout: () => {
            dispatch(logoutUser());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
