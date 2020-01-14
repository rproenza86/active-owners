import React, { useState } from 'react';

import Drawer from '@material/react-drawer';
import List, { ListItem, ListItemText, ListItemGraphic } from '@material/react-list';

import './Drawer.layout.scss';
import MaterialIcon from '@material/react-material-icon';

interface IAppDrawerProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onListItemClickCallback: (actionIndex: number) => void;
}

export enum ListItemIndex {
    ActiveOwnersList,
    TeamList,
    RegisteredMemberList
}

const AppDrawer: React.FC<IAppDrawerProps> = ({ isOpen, setIsOpen, onListItemClickCallback }) => {
    const [selectedIndex, setSelectedIndex] = useState(ListItemIndex.ActiveOwnersList);

    const onDrawerClose = () => {
        setIsOpen(false);
        onListItemClickCallback(selectedIndex);
    };

    const onListItemClick = (index: number) => {
        setSelectedIndex(index);
        onListItemClickCallback(index);
    };

    return (
        <div className="drawer-container">
            <Drawer modal open={isOpen} onClose={onDrawerClose}>
                <List singleSelection selectedIndex={selectedIndex}>
                    <ListItem onClick={() => onListItemClick(ListItemIndex.ActiveOwnersList)}>
                        <ListItemGraphic graphic={<MaterialIcon icon="alarm" />} />
                        <ListItemText primaryText="Active Owners List" />
                    </ListItem>
                    <ListItem onClick={() => onListItemClick(ListItemIndex.TeamList)}>
                        <ListItemGraphic graphic={<MaterialIcon icon="people_alt" />} />
                        <ListItemText primaryText="Team List" />
                    </ListItem>
                    <ListItem onClick={() => onListItemClick(ListItemIndex.RegisteredMemberList)}>
                        <ListItemGraphic graphic={<MaterialIcon icon="emoji_people" />} />
                        <ListItemText primaryText="Registered Member List" />
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
};

export default AppDrawer;
