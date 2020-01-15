import React, { useState } from 'react';

import { ChipSet, Chip } from '@material/react-chips';
import MaterialIcon from '@material/react-material-icon';

import Menu from '../Menu/Menu';

import '@material/react-chips/index.scss';
import { logoutUser } from '../../actions';
import { connect } from 'react-redux';
interface IUser {
    displayName: string | null;
    image: string | null;
    logoutHandler: () => void;
}

export interface IUserDispatchProps {
    handleLogout: () => void;
}

export type IUserProps = IUser & IUserDispatchProps;

const User: React.FC<IUserProps> = ({ displayName, image, handleLogout }) => {
    // menu setup
    const [openMenu, setOpenMenu] = useState(false);
    const [coordinates, setCoordinates] = useState(undefined);

    const rightClickCallback = (event: any) => {
        setOpenMenu(!openMenu);
        setCoordinates({
            x: event.clientX,
            y: event.clientY
        } as any);
        // Must preventDefault so the system context menu doesn't appear.
        // This won't be needed in other cases besides right click.
        event.preventDefault();
    };

    const logoutCallBack = (optionName: string) => handleLogout();
    const menuOptions = [
        {
            optionName: 'Logout',
            optionCallBack: logoutCallBack
        }
    ];
    const onClickHandler = (event: any) => {
        event.preventDefault();
        rightClickCallback(event);
    };

    return (
        <ChipSet className="user-container">
            <Chip
                id="user-chip"
                label={displayName || 'Missing User Name'}
                leadingIcon={<img src={image || ''} alt={`Profile of ${displayName}`}></img>}
                trailingIcon={<MaterialIcon icon="more_vert" onClick={onClickHandler} />}
                onClick={onClickHandler}
            />
            <Menu
                coordinates={coordinates}
                menuOptions={menuOptions}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
            />
        </ChipSet>
    );
};

const mapStateToProps = (state: any) => {
    return {};
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        handleLogout: () => {
            dispatch(logoutUser());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
