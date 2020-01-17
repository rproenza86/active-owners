import React, { useState } from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

import Drawer from '@material/react-drawer';
import List, { ListItem, ListItemText, ListItemGraphic } from '@material/react-list';

import './Drawer.layout.scss';
import MaterialIcon from '@material/react-material-icon';

interface IAppDrawerProps extends RouteComponentProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onListItemClickCallback: (actionIndex: number) => void;
}

export enum ListItemIndex {
    ActiveOwnersList,
    TeamList,
    RegisteredMemberList
}

const AppDrawer: React.FC<IAppDrawerProps> = ({
    isOpen,
    setIsOpen,
    onListItemClickCallback,
    location
}) => {
    let initialSelectedIndex: number = ListItemIndex.ActiveOwnersList;
    debugger;
    switch (location.pathname) {
        case '/teams':
            initialSelectedIndex = ListItemIndex.TeamList;
            break;
        case '/engineers':
            initialSelectedIndex = ListItemIndex.RegisteredMemberList;
            break;
        default:
            break;
    }

    const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);

    const onDrawerClose = () => {
        setIsOpen(false);
    };

    const onListItemClick = (index: number) => {
        setSelectedIndex(index);
        setIsOpen(false);
        onListItemClickCallback(selectedIndex);
    };

    return (
        <div className="drawer-container">
            <Drawer modal open={isOpen} onClose={onDrawerClose}>
                <List singleSelection selectedIndex={selectedIndex}>
                    <Link to="/">
                        <ListItem onClick={() => onListItemClick(ListItemIndex.ActiveOwnersList)}>
                            <ListItemGraphic graphic={<MaterialIcon icon="alarm" />} />
                            <ListItemText primaryText="Active Owners List" />
                        </ListItem>
                    </Link>

                    <Link to="/teams">
                        <ListItem onClick={() => onListItemClick(ListItemIndex.TeamList)}>
                            <ListItemGraphic graphic={<MaterialIcon icon="people_alt" />} />
                            <ListItemText primaryText="Team List" />
                        </ListItem>
                    </Link>

                    <Link to="/engineers">
                        <ListItem
                            onClick={() => onListItemClick(ListItemIndex.RegisteredMemberList)}
                        >
                            <ListItemGraphic graphic={<MaterialIcon icon="emoji_people" />} />
                            <ListItemText primaryText="Registered Member List" />
                        </ListItem>
                    </Link>
                </List>
            </Drawer>
        </div>
    );
};

export default withRouter(AppDrawer);
