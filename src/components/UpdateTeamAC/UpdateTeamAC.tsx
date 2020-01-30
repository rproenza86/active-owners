import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';
import Dialog, {
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton
} from '@material/react-dialog';
import List, { ListItem, ListItemText } from '@material/react-list';
import Radio, { NativeRadioControl } from '@material/react-radio';

import { IStateTree } from '../../types';
import { ITeamsMemberHydrated, updateTeamAO } from '../../actions/activeOwners';

import './UpdateTeamAC.scss';
import { UserContext } from '../App/App';

interface IUpdateTeamACProps {
    isOpen: boolean;
    currentAO: ITeamsMemberHydrated;
    selectedIndex?: number;
    onCloseUpdateHandler: () => void;
    choices?: ITeamsMemberHydrated[];
    updateTeam?: (teamId: string, aoId: string, uid: string) => void;
    uid: string;
}

const UpdateTeamAC: React.FC<IUpdateTeamACProps> = ({
    isOpen,
    onCloseUpdateHandler: onSelectionUpdateHandler,
    currentAO,
    choices,
    updateTeam,
    uid
}) => {
    const [selectedIndexState, setSelectedIndexState] = useState(currentAO.id || '');

    const user = useContext(UserContext);
    const onCloseHandler = (action: string) => {
        onSelectionUpdateHandler();

        if (action === 'confirm' && currentAO.id !== selectedIndexState) {
            updateTeam && updateTeam(currentAO.teamId, selectedIndexState, user.uid);
        } else {
            setSelectedIndexState(currentAO.id);
        }
    };

    const isChecked = (id: string) => id === selectedIndexState;

    return (
        <>
            {isOpen && (
                <Dialog onClose={onCloseHandler} open={isOpen}>
                    <DialogTitle>Chose a Team Active Owner</DialogTitle>
                    <DialogContent>
                        <List
                            singleSelection
                            handleSelect={(selectedIndex: number) =>
                                setSelectedIndexState((choices && choices[selectedIndex].id) || '')
                            }
                        >
                            {choices?.map((choice, i) => {
                                return (
                                    <ListItem key={i}>
                                        <span className="mdc-list-item__graphic">
                                            <Radio>
                                                <NativeRadioControl
                                                    name="ringtone"
                                                    value={choice.name}
                                                    id={choice.id}
                                                    checked={isChecked(choice.id)}
                                                    onChange={() => {}}
                                                />
                                            </Radio>
                                        </span>
                                        <label htmlFor={choice.name}>
                                            <ListItemText primaryText={choice.name} />
                                        </label>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </DialogContent>
                    <DialogFooter>
                        <DialogButton action="dismiss">Cancel</DialogButton>
                        <DialogButton action="confirm" isDefault>
                            Update
                        </DialogButton>
                    </DialogFooter>
                </Dialog>
            )}
        </>
    );
};

const mapStateToProps = (state: IStateTree, props: IUpdateTeamACProps): IUpdateTeamACProps => {
    const { currentAO } = props;
    const choices = state.teamsMembers.filter(member => member.teamId === currentAO.teamId);

    return { ...props, choices, uid: state.auth?.user?.uid };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateTeam: (teamId: string, aoId: string, uid: string) => dispatch(updateTeamAO(teamId, aoId, uid))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateTeamAC);
