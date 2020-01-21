import React, { useState } from 'react';

import { connect } from 'react-redux';
import { IStateTree } from '../../types';
import { ITeamsMemberHydrated } from '../../actions/activeOwners';
import { Breadcrumb, Icon } from 'antd';
import MaterialIcon from '@material/react-material-icon';
import IconButton from '@material/react-icon-button';

import DetailsListUI, { IDetailsListDocumentsProps, classNames } from '../DetailsList/DetailsList';
import TeamMember from '../TeamMember/TeamMember';

interface ITeamMemberList {
    teamsMembers: ITeamsMemberHydrated[];
}

export interface ITeamMemberListDispatchProps {}

export type ITeamMemberListProps = ITeamMemberList & ITeamMemberListDispatchProps;

const TeamMemberList: React.FC<ITeamMemberListProps> = ({ teamsMembers }) => {
    const [updateNumber, setUpdateNumber] = useState(0);
    const [teamMember, setTeamMember] = useState({} as ITeamsMemberHydrated);
    const [editTeamMember, setEditTeamMember] = useState(false);

    const _onEditClick = (item: ITeamsMemberHydrated): void => {
        setTeamMember(item);
        setEditTeamMember(!editTeamMember);
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
                            <IconButton>
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
            <h1>Teams members list</h1>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Icon type="home" />
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <MaterialIcon icon="emoji_people" />
                    List of Team Members
                </Breadcrumb.Item>
            </Breadcrumb>
            <DetailsListUI items={config.items} columns={config.columns} />
            <TeamMember
                isOpen={editTeamMember}
                teamIdP={teamMember.teamId}
                teamMember={teamMember}
                onCloseUpdateHandler={(isConfirm?: boolean) => {
                    if (isConfirm) {
                        setUpdateNumber(updateNumber + 1);
                    }
                    setEditTeamMember(!editTeamMember);
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamMemberList);
