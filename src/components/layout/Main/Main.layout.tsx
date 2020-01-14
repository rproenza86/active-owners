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

interface IMain {
    children: React.ReactNode;
}

const Main: React.FC<IMain> = props => {
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
                            <MaterialIcon
                                aria-label="User"
                                hasRipple
                                icon="person"
                                onClick={() => console.log('person')}
                            />
                        </TopAppBarIcon>
                    </TopAppBarSection>
                </TopAppBarRow>
            </TopAppBar>
            <TopAppBarFixedAdjust>
                <Grid>
                    <Row>
                        <Cell columns={4}>{props.children}</Cell>
                        <Cell columns={4}>{props.children}</Cell>
                        <Cell columns={4}>{props.children}</Cell>
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

export default Main;
