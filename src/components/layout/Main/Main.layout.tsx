import React, { useState } from 'react';
import { connect } from 'react-redux';
import TopAppBar, {
    TopAppBarFixedAdjust,
    TopAppBarIcon,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarTitle
} from '@material/react-top-app-bar';
import MaterialIcon from '@material/react-material-icon';
import { Grid } from '@material/react-layout-grid';

import User from '../../User/User';
import Drawer from './Drawer.layout';

import './Main.layout.scss';
import '@material/react-list/dist/list.css';

interface IMain {
    children: React.ReactNode;
    user: firebase.User;
}

export interface IMainDispatchProps {}

export type IMainProps = IMain & IMainDispatchProps;

const Main: React.FC<IMainProps> = ({ children, user }) => {
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
                        {user.email && (
                            <TopAppBarIcon navIcon tabIndex={0}>
                                <MaterialIcon
                                    hasRipple
                                    icon="menu"
                                    onClick={() => setOpen(true)}
                                    ref={mainContentEl}
                                />
                            </TopAppBarIcon>
                        )}
                        <TopAppBarTitle>Active Owner Registry</TopAppBarTitle>
                    </TopAppBarSection>
                    {user.email && (
                        <TopAppBarSection align="end" role="toolbar">
                            <TopAppBarIcon actionItem tabIndex={0}>
                                <User displayName={user?.displayName} image={user?.photoURL} />
                            </TopAppBarIcon>
                        </TopAppBarSection>
                    )}
                </TopAppBarRow>
            </TopAppBar>
            <TopAppBarFixedAdjust>
                <Grid>{children}</Grid>
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

export default connect(mapStateToProps)(Main);
