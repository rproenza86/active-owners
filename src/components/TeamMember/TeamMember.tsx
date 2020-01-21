import React, { useState } from 'react';
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

import { addTeamMember } from '../../actions/teamMembers';
import { IStateTree, ITeam, ITeamMemberCore } from '../../types';

import './TeamMember.scss';

interface IUpdateTeamACProps {
    isOpen: boolean;
    onCloseUpdateHandler: (keepOpen?: boolean) => void;
    teams?: ITeam[];
    teamIdP?: string;
    addMember?: (teamMember: ITeamMemberCore) => any;
}

const TeamMember: React.FC<IUpdateTeamACProps> = ({
    isOpen,
    teams,
    teamIdP,
    addMember,
    onCloseUpdateHandler
}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [slackId, setLackId] = useState('');
    const [teamId, setTeamId] = useState(teamIdP || (teams ? teams[0].id : ''));
    const [errorMessage, setErrorMessage] = useState('');

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
                const teamMember: ITeamMemberCore = {
                    name,
                    email,
                    location,
                    slackId,
                    teamId
                };
                addMember && addMember(teamMember);
            }
            return;
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
        addMember: (teamMember: ITeamMemberCore) => dispatch(addTeamMember(teamMember))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamMember);
