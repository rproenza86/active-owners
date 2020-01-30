import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Icon } from 'antd';
import MaterialIcon from '@material/react-material-icon';
import IconButton from '@material/react-icon-button';

import { ITeam, IStateTree } from '../../types';
import DetailsListUI, { IDetailsListDocumentsProps, classNames } from '../DetailsList/DetailsList';
import { deleteTeam } from '../../actions/teams';
import { useDocumentCU } from '../common/hooks';
import { createUpdateClickHandlers } from '../common/createUpdateClickHandlers';
import Team from '../Team/Team';
import { UserContext } from '../App/App';

interface ITeamList {
    teams: ITeam[];
}

export interface ITeamListDispatchProps {
    deleteTeam: (team: ITeam, uid: string) => any;
}

export type ITeamListProps = ITeamList & ITeamListDispatchProps;

const TeamList: React.FC<ITeamListProps> = ({ teams, deleteTeam }) => {
    const [[team, setTeam], [addOrEditTeam, setAddOrEditTeam]] = useDocumentCU<ITeam>();

    const user = useContext(UserContext);
    const { _onEditClick, _onDeleteClick } = createUpdateClickHandlers<ITeam>(
        [
            [team, setTeam],
            [addOrEditTeam, setAddOrEditTeam]
        ],
        (team: ITeam) => deleteTeam(team, user.uid)
    );

    const config: IDetailsListDocumentsProps<ITeam[]> = {
        items: teams,
        columns: [
            {
                key: 'column01',
                name: 'ID',
                className: classNames.fileIconCell,
                iconClassName: classNames.fileIconHeaderIcon,
                ariaLabel: 'Column operations for File type, Press to sort on File type',
                iconName: 'Engineers',
                isIconOnly: true,
                fieldName: 'name',
                minWidth: 100,
                maxWidth: 110,
                onRender: (item: ITeam) => {
                    return (
                        <>
                            <IconButton
                                className="edit-list-elm"
                                onClick={() => _onEditClick(item)}
                            >
                                <MaterialIcon icon="edit" />
                            </IconButton>
                            <IconButton
                                className="delete-list-elm"
                                onClick={() => _onDeleteClick(item)}
                            >
                                <MaterialIcon icon="delete_forever" />
                            </IconButton>
                        </>
                    );
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
                key: 'column3',
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
                key: 'column4',
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
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Icon type="home" />
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <MaterialIcon icon="people_alt" />
                    List of Teams
                </Breadcrumb.Item>
            </Breadcrumb>

            <DetailsListUI
                items={config.items}
                columns={config.columns}
                withAddBtn
                createButtonConfig={{
                    text: 'Add New Team',
                    onClickHandler: () => {
                        _onEditClick({} as ITeam);
                    }
                }}
            />

            <Team
                isOpen={addOrEditTeam}
                acIdP={team.acId}
                team={team}
                onCloseUpdateHandler={() => {
                    setAddOrEditTeam(!addOrEditTeam);
                    setTeam({} as any);
                }}
            />
        </>
    );
};

const mapStateToProps = (state: IStateTree): ITeamList => {
    return { teams: state.teams };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        deleteTeam: (team: ITeam, uid: string) => dispatch(deleteTeam(team, uid))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamList);
