/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useContext } from 'react';
import Card, {
    CardPrimaryContent,
    CardMedia,
    CardActions,
    CardActionButtons,
    CardActionIcons
} from '@material/react-card';
import { Body2, Headline6, Subtitle2 } from '@material/react-typography';
import IconButton from '@material/react-icon-button';
import MaterialIcon from '@material/react-material-icon';
import Button from '@material/react-button';
import List, {
    ListItem,
    ListItemText,
    ListGroup,
    ListDivider,
    ListItemGraphic,
    ListItemMeta
} from '@material/react-list';
import { Avatar } from 'antd';

import Menu from '../Menu/Menu';
import UpdateTeamAC from '../UpdateTeamAC/UpdateTeamAC';
import TeamMember from '../TeamMember/TeamMember';
import Team from '../Team/Team';

import { ITeamsMemberHydrated } from '../../actions/activeOwners';

import './ActiveOwner.scss';
import { notifyEvent } from '../../utils/notification';
import { UserContext } from '../App/App';

interface IActiveOwnerProps {
    activeOwner: ITeamsMemberHydrated;
    onTeamNotificationSubscription: (
        activeOwner: ITeamsMemberHydrated,
        pushNotificationSubscription: string
    ) => void;
    onTeamNotificationUnSubscription: () => void;
}

const ActiveOwner: React.FC<IActiveOwnerProps> = ({
    activeOwner,
    onTeamNotificationSubscription,
    onTeamNotificationUnSubscription
}) => {
    // menu setup
    const [openMenu, setOpenMenu] = useState(false);
    const [openUpdateTeamAC, setOpenUpdateTeamAC] = useState(false);
    const [coordinates, setCoordinates] = useState(undefined);
    const [addTeamMember, setAddTeamMember] = useState(false);
    const [addTeam, setAddTeam] = useState(false);
    const [favIconType, setFavIconType] = useState(
        activeOwner.isNotificationSubscriber ? 'favorite' : 'favorite_border'
    );

    const subscribeToUpdatesNotifications = () => {
        if (favIconType === 'favorite') {
            onTeamNotificationUnSubscription();
            return setFavIconType('favorite_border');
        }
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                // console.clear()
                // console.log('I got the registration', registration);
                registration.pushManager.getSubscription().then(function(subscription) {
                    if (subscription !== null) {
                        setFavIconType('favorite');
                        onTeamNotificationSubscription(activeOwner, JSON.stringify(subscription));
                    } else {
                        console.log('User is NOT subscribed.');
                    }
                });
            });
        } else {
            notifyEvent({
                type: 'info',
                message: 'Notification Subscription',
                description:
                    'Your web browser not support push notifications. We are not able to subscribe you.'
            });
            setFavIconType('favorite_border');
        }
    };

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

    const dummyOptionCallBack = (optionName: string) =>
        console.log(`Menu option "${optionName}" clicked`);
    const menuOptions = [
        {
            optionName: 'Add Team',
            optionCallBack: () => setAddTeam(!addTeam)
        },
        {
            optionName: 'Add Member',
            optionCallBack: () => setAddTeamMember(!addTeamMember)
        },
        {
            optionName: 'Change Rotation',
            optionCallBack: dummyOptionCallBack
        }
    ];

    const fallBackImage =
        'https://material-components.github.io/material-components-web-catalog/static/media/photos/3x2/2.jpg';
    const fallbackLogo = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';

    const user = useContext(UserContext);

    return (
        <>
            <UpdateTeamAC
                isOpen={openUpdateTeamAC}
                currentAO={activeOwner}
                uid={user.uid}
                onCloseUpdateHandler={(keepOpen?: boolean) =>
                    setOpenUpdateTeamAC(keepOpen || !openUpdateTeamAC)
                }
            />
            <TeamMember
                isOpen={addTeamMember}
                teamIdP={activeOwner.teamId}
                onCloseUpdateHandler={() => {
                    setAddTeamMember(!addTeamMember);
                }}
            />
            <Team
                isOpen={addTeam}
                acIdP={activeOwner.id}
                onCloseUpdateHandler={() => {
                    setAddTeam(!addTeam);
                }}
            />
            <Card className="mdc-card active-owner-card">
                <CardPrimaryContent className="active-owner-card__primary-action">
                    <CardMedia
                        wide
                        imageUrl={activeOwner.teamImageUrl || fallBackImage}
                        className="active-owner-card__media"
                    />
                    <Avatar
                        className="mdc-elevation--z4"
                        src={activeOwner.teamLogoUrl || fallbackLogo}
                    />
                    <div className="active-owner-card__primary">
                        <Headline6 className="active-owner-card__title">
                            {activeOwner.teamName}
                        </Headline6>
                        <Subtitle2 className="active-owner-card__subtitle">
                            Active Owner: <strong>{activeOwner.name}</strong>
                        </Subtitle2>
                    </div>
                    <Body2 tag="div" className="active-owner-card__secondary">
                        <Subtitle2 className="active-owner-card__subtitle contact-label">
                            Contact Info:
                        </Subtitle2>

                        <ListGroup>
                            <ListDivider tag="div" />
                            <List>
                                <ListItem>
                                    <ListItemGraphic
                                        graphic={<MaterialIcon icon="perm_identity" />}
                                    />
                                    <ListItemText primaryText={activeOwner.slackId} />
                                    <ListItemMeta meta="Slack Id" />
                                </ListItem>
                                <ListItem>
                                    <ListItemGraphic graphic={<MaterialIcon icon="email" />} />
                                    <ListItemText primaryText={activeOwner.email} />
                                    <ListItemMeta meta="Email" />
                                </ListItem>
                                <ListItem>
                                    <ListItemGraphic
                                        graphic={<MaterialIcon icon="desktop_mac" />}
                                    />
                                    <ListItemText primaryText={activeOwner.location} />
                                    <ListItemMeta meta="Location" />
                                </ListItem>
                                <ListDivider tag="div" />
                            </List>
                        </ListGroup>
                    </Body2>
                </CardPrimaryContent>
                <CardActions>
                    <CardActionButtons>
                        <Button onClick={() => setOpenUpdateTeamAC(!openUpdateTeamAC)}>
                            Update
                        </Button>
                    </CardActionButtons>
                    <CardActionIcons>
                        <IconButton onClick={() => subscribeToUpdatesNotifications()}>
                            <MaterialIcon icon={favIconType} />
                        </IconButton>
                        <IconButton onClick={event => rightClickCallback(event)}>
                            <MaterialIcon icon="more_vert" />

                            <Menu
                                coordinates={coordinates}
                                menuOptions={menuOptions}
                                openMenu={openMenu}
                                setOpenMenu={setOpenMenu}
                            />
                        </IconButton>
                    </CardActionIcons>
                </CardActions>
            </Card>
        </>
    );
};

export default ActiveOwner;
