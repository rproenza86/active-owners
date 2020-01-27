import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Dialog, {
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton
} from '@material/react-dialog';
import MaterialIcon from '@material/react-material-icon';
import Select, { Option } from '@material/react-select';
import TextField, { HelperText, Input } from '@material/react-text-field';
import { Button } from '@material/react-button';
import { Tag } from 'antd';

import { addTeam, updateTeam } from '../../actions/teams';
import { IStateTree, ITeam, ITeamsObject } from '../../types';
import { ITeamsMemberHydrated } from '../../actions/activeOwners';

import './Team.scss';
import ImageUploads from './ImageUploads';

interface ITeamProps {
    isOpen: boolean;
    onCloseUpdateHandler: (keepOpen?: boolean) => void;
    teamsMembers?: ITeamsMemberHydrated[];
    addTeam?: (team: ITeamsObject) => any;
    updateTeam?: (team: ITeam) => any;
    team?: ITeam;
    acIdP?: string;
}

const Team: React.FC<ITeamProps> = ({
    addTeam,
    isOpen,
    onCloseUpdateHandler,
    team,
    teamsMembers,
    updateTeam,
    acIdP
}) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(team?.image || '');
    const [imageUrl, setImageUrl] = useState(team?.imageUrl || '');
    const [logo, setLogo] = useState(team?.logo || '');
    const [logoUrl, setLogoUrl] = useState(team?.logoUrl || '');
    const [acId, setAcId] = useState(acIdP || (teamsMembers ? teamsMembers[0].id : ''));
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (team && team.id) {
            setName(team.name);
            setAcId(team.acId || '');
            setImage(team.image || '');
            setImageUrl(team.imageUrl || '');
            setLocation(team.location);
            setLogo(team.logo || '');
            setLogoUrl(team.logoUrl || '');
        } else {
            resetFields();
        }
    }, [team]);

    const resetFields = () => {
        setName('');
        setLocation('');
        setImage('');
        setImageUrl('');
        setLogo('');
        setLogoUrl('');
    };

    const isValidForm = (): boolean => {
        if (name === '') {
            return false;
        }
        if (location === '') {
            return false;
        }
        if (acId === '') {
            return false;
        }
        return true;
    };

    const onCloseHandler = (action: string) => {
        if (action === 'confirm') {
            if (!isValidForm()) {
                setErrorMessage('Missing required information. Please, complete form.');
            } else {
                const teamObj: ITeamsObject = {
                    name,
                    location,
                    acId,
                    image,
                    imageUrl,
                    logo,
                    logoUrl
                };
                if (team && team.id) {
                    updateTeam && updateTeam({ ...team, ...teamObj });
                } else {
                    addTeam && addTeam(teamObj);
                }
                onCloseUpdateHandler(true);
            }
        } else {
            onCloseUpdateHandler();
        }
    };

    const getDialogTitle = () => {
        if (team && team.id) {
            return 'Update Team';
        } else {
            return 'Add New  Team';
        }
    };

    return (
        <>
            {isOpen && (
                <Dialog onClose={onCloseHandler} open={isOpen}>
                    <DialogTitle>{getDialogTitle()}</DialogTitle>
                    <DialogContent className="team-member">
                        <TextField
                            label="Name"
                            helperText={<HelperText>Enter your full name!</HelperText>}
                            onTrailingIconSelect={() => setName('')}
                            trailingIcon={<MaterialIcon role="button" icon="person" />}
                        >
                            <Input
                                value={name}
                                required
                                onChange={(e: any) => setName(e.currentTarget.value)}
                            />
                        </TextField>
                        <TextField
                            label="Location"
                            helperText={<HelperText>Enter your desk location!</HelperText>}
                            onTrailingIconSelect={() => setLocation('')}
                            trailingIcon={<MaterialIcon role="button" icon="location_city" />}
                        >
                            <Input
                                required
                                value={location}
                                onChange={(e: any) => setLocation(e.currentTarget.value)}
                            />
                        </TextField>
                        <Select
                            label="Choose Active Owner"
                            required
                            value={acId}
                            onChange={(evt: any) => setAcId(evt.target.value)}
                        >
                            {teamsMembers?.map(teamMember => (
                                <Option value={teamMember.id} key={teamMember.id}>
                                    {teamMember.name}
                                </Option>
                            ))}
                        </Select>

                        <ImageUploads
                            onImageSave={(imageName: string, imageUrl: string) => {
                                setImage(imageName);
                                setImageUrl(imageUrl);
                            }}
                            name={image}
                            label="Select Team Image"
                        />

                        <ImageUploads
                            onImageSave={(logoName: string, logoUrl: string) => {
                                setLogo(logoName);
                                setLogoUrl(logoUrl);
                            }}
                            name={logo}
                            label="Select Team Logo"
                        />

                        {errorMessage && (
                            <div>
                                <Tag color="volcano">{errorMessage}</Tag>
                            </div>
                        )}
                    </DialogContent>
                    <DialogFooter>
                        <DialogButton action="dismiss" icon={<MaterialIcon icon="cancel" />}>
                            Cancel
                        </DialogButton>

                        <Button
                            onClick={() => {
                                onCloseHandler('confirm');
                            }}
                            icon={<MaterialIcon icon="create" />}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </Dialog>
            )}
        </>
    );
};

const mapStateToProps = (state: IStateTree, props: ITeamProps): ITeamProps => {
    return { ...props, teamsMembers: state.teamsMembers };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        addTeam: (team: ITeamsObject) => dispatch(addTeam(team)),
        updateTeam: (team: ITeam) => dispatch(updateTeam(team))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Team);
