import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserNinja } from '@fortawesome/free-solid-svg-icons';

import { ITeam, IStateTree, IDocument } from '../../types';
import DetailsListUI, { IDetailsListDocumentsProps, classNames } from '../DetailsList/DetailsList';

interface ITeamList {
    teams: ITeam[];
}

export interface ITeamListDispatchProps {}

export type ITeamListProps = ITeamList & ITeamListDispatchProps;

const TeamList: React.FC<ITeamListProps> = ({ teams }) => {
    const config: IDetailsListDocumentsProps<ITeam[]> = {
        items: teams,
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
                name: 'Team Name',
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
                key: 'column4',
                name: 'Team Location',
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
                name: 'Team Active Owner',
                fieldName: 'activeOwnerName',
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

const mapStateToProps = (state: IStateTree): ITeamList => {
    return { teams: state.teams };
};

const mapDispatchToProps = (dispatch: any) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamList);
