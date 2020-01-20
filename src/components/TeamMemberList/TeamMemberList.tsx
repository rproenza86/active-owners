import React from 'react';

import { connect } from 'react-redux';
import { IStateTree, IDocument } from '../../types';
import { ITeamsMemberHydrated } from '../../actions/activeOwners';
import DetailsListUI, { IDetailsListDocumentsProps, classNames } from '../DetailsList/DetailsList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserNinja } from '@fortawesome/free-solid-svg-icons';

interface ITeamMemberList {
    teamsMembers: ITeamsMemberHydrated[];
}

export interface ITeamMemberListDispatchProps {}

export type ITeamMemberListProps = ITeamMemberList & ITeamMemberListDispatchProps;

const TeamMemberList: React.FC<ITeamMemberListProps> = ({ teamsMembers }) => {
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
                minWidth: 16,
                maxWidth: 40,
                onRender: (item: IDocument) => {
                    return <FontAwesomeIcon icon={faUserNinja} />;
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
            <DetailsListUI items={config.items} columns={config.columns} />
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
