import React from 'react';
import Menu, { MenuList, MenuListItem, MenuListItemText } from '@material/react-menu';

import '@material/react-menu/index.scss';

interface IMenuOption {
    optionName: string;
    optionCallBack: (optionName: string) => void;
}

interface IAppMenu {
    coordinates: any;
    menuOptions: IMenuOption[];
    openMenu: boolean;
    setOpenMenu: any;
}

const AppMenu: React.FC<IAppMenu> = ({ coordinates, menuOptions, openMenu, setOpenMenu }) => {
    const onClose = () => {
        setOpenMenu(false);
    };

    return (
        <>
            <Menu
                open={openMenu}
                onClose={onClose}
                coordinates={coordinates}
                onSelected={(index, item) => {
                    console.log(index, item);
                    menuOptions[index].optionCallBack(menuOptions[index].optionName);
                }}
            >
                <MenuList>
                    {menuOptions.map((option, index) => (
                        <MenuListItem key={index}>
                            <MenuListItemText primaryText={option.optionName} />
                            {/* You can also use other components from list, which are documented below */}
                        </MenuListItem>
                    ))}
                </MenuList>
            </Menu>
        </>
    );
};

export default AppMenu;
