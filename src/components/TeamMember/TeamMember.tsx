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

import { addTeamMember, updateTeamMember } from '../../actions/teamMembers';
import { IStateTree, ITeam, ITeamMemberCore, ITeamMember } from '../../types';
import { ITeamsMemberHydrated } from '../../actions/activeOwners';

import './TeamMember.scss';

interface IUpdateTeamACProps {
    isOpen: boolean;
    onCloseUpdateHandler: (keepOpen?: boolean) => void;
    teams?: ITeam[];
    teamIdP?: string;
    addMember?: (teamMember: ITeamMemberCore) => any;
    updateMember?: (teamMemberId: string, teamMember: ITeamMember) => any;
    teamMember?: ITeamsMemberHydrated;
}

const TeamMember: React.FC<IUpdateTeamACProps> = ({
    isOpen,
    teams,
    teamIdP,
    addMember,
    onCloseUpdateHandler,
    teamMember,
    updateMember
}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [slackId, setLackId] = useState('');
    const [teamId, setTeamId] = useState(teamIdP || (teams ? teams[0].id : ''));
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (teamMember && teamMember.id) {
            setName(teamMember.name);
            setEmail(teamMember.email);
            setLocation(teamMember.location);
            setLackId(teamMember.slackId);
            setTeamId(teamMember.teamId);
        }
    }, [teamMember]);

    const isValidForm = (): boolean => {
        if (name === '') {
            return false;
        }
        if (email === '') {
            return false;
        }
        if (location === '') {
            return false;
        }
        if (slackId === '') {
            return false;
        }
        return true;
    };

    const onCloseHandler = (action: string) => {
        if (action === 'confirm') {
            if (!isValidForm()) {
                setErrorMessage('Missing required information. Please, complete form.');
            } else {
                const teamMemberObj: ITeamMemberCore = {
                    name,
                    email,
                    location: location.split(' ')[2] || location, // Support for formats like "ATL 3003 L15404" and "L15404"
                    slackId,
                    teamId
                };
                if (teamMember && teamMember.id) {
                    updateMember && updateMember(teamMember.id, teamMemberObj as ITeamMember);
                } else {
                    addMember && addMember(teamMemberObj);
                }
                return onCloseUpdateHandler(true);
            }
        } else {
            onCloseUpdateHandler();
        }
    };

    return (
        <>
            {isOpen && (
                <Dialog onClose={onCloseHandler} open={isOpen}>
                    <DialogTitle>Chose a Team Active Owner</DialogTitle>
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
                            label="Slack ID"
                            helperText={<HelperText>Enter your Slack user ID!</HelperText>}
                            onTrailingIconSelect={() => setLackId('')}
                            trailingIcon={<MaterialIcon role="button" icon="perm_identity" />}
                        >
                            <Input
                                value={slackId}
                                required
                                onChange={(e: any) => setLackId(e.currentTarget.value)}
                            />
                        </TextField>
                        <TextField
                            label="eMail"
                            helperText={<HelperText>Enter your eMail address!</HelperText>}
                            onTrailingIconSelect={() => setEmail('')}
                            trailingIcon={<MaterialIcon role="button" icon="email" />}
                        >
                            <Input
                                required
                                value={email}
                                onChange={(e: any) => setEmail(e.currentTarget.value)}
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
                            label="Choose Team"
                            required
                            value={teamId}
                            onChange={(evt: any) => setTeamId(evt.target.value)}
                        >
                            {teams?.map(team => (
                                <Option value={team.id} key={team.id}>
                                    {team.name}
                                </Option>
                            ))}
                        </Select>

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

const mapStateToProps = (state: IStateTree, props: IUpdateTeamACProps): IUpdateTeamACProps => {
    return { ...props, teams: state.teams };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        addMember: (teamMember: ITeamMemberCore) => dispatch(addTeamMember(teamMember)),
        updateMember: (teamMemberId: string, teamMember: ITeamMember) =>
            dispatch(updateTeamMember(teamMemberId, teamMember))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamMember);
