import React, { useState } from 'react';

import { connect } from 'react-redux';
import { IStateTree, ITeamMember } from '../../types';
import { ITeamsMemberHydrated } from '../../actions/activeOwners';
import { Breadcrumb, Icon } from 'antd';
import MaterialIcon from '@material/react-material-icon';
import IconButton from '@material/react-icon-button';

import DetailsListUI, { IDetailsListDocumentsProps, classNames } from '../DetailsList/DetailsList';
import TeamMember from '../TeamMember/TeamMember';
import { deleteTeamMember } from '../../actions/teamMembers';
import showConfirm, { IConfirmConfig } from '../../utils/confirm';

interface ITeamMemberList {
    teamsMembers: ITeamsMemberHydrated[];
}

export interface ITeamMemberListDispatchProps {
    deleteMember?: (teamMember: ITeamMember) => any;
}

export type ITeamMemberListProps = ITeamMemberList & ITeamMemberListDispatchProps;

const TeamMemberList: React.FC<ITeamMemberListProps> = ({ teamsMembers, deleteMember }) => {
    const [teamMember, setTeamMember] = useState({} as ITeamsMemberHydrated);
    const [addOrEditTeamMember, setAddOrEditTeamMember] = useState(false);

    const _onEditClick = (item: ITeamsMemberHydrated): void => {
        setTeamMember(item);
        setAddOrEditTeamMember(!addOrEditTeamMember);
    };

    const _onDeleteClick = (item: ITeamsMemberHydrated): void => {
        const deleteConfirmConfig: IConfirmConfig = {
            title: 'Confirm Deletion!',
            content: "Do you want to delete these Team's Member?",
            onOkCallback: () => deleteMember && deleteMember(item)
        };

        showConfirm(deleteConfirmConfig);
    };

    const config: IDetailsListDocumentsProps<ITeamsMemberHydrated[]> = {
        items: teamsMembers,
        columns: [
            {
                key: 'column1',
                name: 'ID',
                className: classNames.fileIconCell,
                iconClassName: classNames.fileIconHeaderIcon,
                ariaLabel: 'Column operations for File type, Press to sort on File type',
                iconName: 'Engineers',
                isIconOnly: true,
                fieldName: 'id',
                minWidth: 100,
                maxWidth: 110,
                onRender: (item: ITeamsMemberHydrated) => {
                    return (
                        <>
                            <IconButton onClick={() => _onEditClick(item)}>
                                <MaterialIcon icon="edit" />
                            </IconButton>
                            <IconButton onClick={() => _onDeleteClick(item)}>
                                <MaterialIcon icon="delete_forever" />
                            </IconButton>
                        </>
                    );
                }
            },
            {
                key: 'column2',
                name: 'Name',
                fieldName: 'name',
                minWidth: 210,
                maxWidth: 350,
                isRowHeader: true,
                isResizable: true,
                isSorted: true,
                isSortedDescending: false,
                sortAscendingAriaLabel: 'Sorted A to Z',
                sortDescendingAriaLabel: 'Sorted Z to A',
                data: 'string',
                isPadded: true
            },
            {
                key: 'column3',
                name: 'Email',
                fieldName: 'email',
                minWidth: 210,
                maxWidth: 350,
                isRowHeader: true,
                isResizable: true,
                isSorted: true,
                isSortedDescending: false,
                sortAscendingAriaLabel: 'Sorted A to Z',
                sortDescendingAriaLabel: 'Sorted Z to A',
                data: 'string',
                isPadded: true
            },
            {
                key: 'column4',
                name: 'Location',
                fieldName: 'location',
                minWidth: 210,
                maxWidth: 350,
                isRowHeader: true,
                isResizable: true,
                isSorted: true,
                isSortedDescending: false,
                sortAscendingAriaLabel: 'Sorted A to Z',
                sortDescendingAriaLabel: 'Sorted Z to A',
                data: 'string',
                isPadded: true
            },
            {
                key: 'column5',
                name: 'Slack Id',
                fieldName: 'slackId',
                minWidth: 210,
                maxWidth: 350,
                isRowHeader: true,
                isResizable: true,
                isSorted: true,
                isSortedDescending: false,
                sortAscendingAriaLabel: 'Sorted A to Z',
                sortDescendingAriaLabel: 'Sorted Z to A',
                data: 'string',
                isPadded: true
            },
            {
                key: 'column6',
                name: 'Team Name',
                fieldName: 'teamName',
                minWidth: 210,
                maxWidth: 350,
                isRowHeader: true,
                isResizable: true,
                isSorted: true,
                isSortedDescending: false,
                sortAscendingAriaLabel: 'Sorted A to Z',
                sortDescendingAriaLabel: 'Sorted Z to A',
                data: 'string',
                isPadded: true
            }
        ]
    };

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Icon type="home" />
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <MaterialIcon icon="emoji_people" />
                    List of Team Members
                </Breadcrumb.Item>
            </Breadcrumb>
            <DetailsListUI
                items={config.items}
                columns={config.columns}
                withAddBtn
                createButtonConfig={{
                    text: 'Add New Member',
                    onClickHandler: () => {
                        _onEditClick({} as ITeamsMemberHydrated);
                    }
                }}
            />
            <TeamMember
                isOpen={addOrEditTeamMember}
                teamIdP={teamMember.teamId}
                teamMember={teamMember}
                onCloseUpdateHandler={() => {
                    setAddOrEditTeamMember(!addOrEditTeamMember);
                }}
            />
        </>
    );
};

const mapStateToProps = (state: IStateTree): ITeamMemberList => {
    return {
        teamsMembers: state.teamsMembers
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        deleteMember: (teamMember: ITeamMember) => dispatch(deleteTeamMember(teamMember))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamMemberList);
