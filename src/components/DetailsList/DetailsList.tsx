import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Announced } from 'office-ui-fabric-react/lib/Announced';
import {
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode,
    IColumn
} from 'office-ui-fabric-react/lib/DetailsList';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';

import { registerIcons } from '@uifabric/styling';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { initializeIcons } from '@uifabric/icons';
import { ITeam } from '../../types';
import { ITeamsMemberHydrated } from '../../actions/activeOwners';

import { CreateButton, ICreateButtonConfig } from './CreateButton';

import './DetailsList.scss';

registerIcons({
    icons: {
        Engineers: <FontAwesomeIcon icon={faUsers} />
    }
});
initializeIcons(undefined, { disableWarnings: true });

export const classNames = mergeStyleSets({
    fileIconHeaderIcon: {
        padding: 0,
        fontSize: '16px',
        width: '46px'
    },
    fileIconCell: {
        textAlign: 'center',
        selectors: {
            '&:before': {
                content: '.',
                display: 'inline-block',
                verticalAlign: 'middle',
                height: '100%',
                width: '0px',
                visibility: 'hidden'
            }
        }
    },
    fileIconImg: {
        verticalAlign: 'middle',
        maxHeight: '16px',
        maxWidth: '16px'
    },
    controlWrapper: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    exampleToggle: {
        display: 'inline-block',
        marginBottom: '10px',
        marginRight: '30px'
    },
    selectionDetails: {
        marginBottom: '20px'
    }
});
const controlStyles = {
    root: {
        margin: '0 30px 20px 0',
        maxWidth: '300px'
    }
};

export interface IDetailsListDocumentsProps<T> {
    columns: IColumn[];
    items: T;
    withAddBtn?: boolean;
    createButtonConfig?: ICreateButtonConfig;
}

interface IDetailsListDocumentsState<T> {
    columns: IColumn[];
    items: T;
    isModalSelection: boolean;
    isCompactMode: boolean;
    announcedMessage?: string;
}

type DetailsListUIConfigType = ITeamsMemberHydrated[] | ITeam[];

class DetailsListUI extends React.Component<
    IDetailsListDocumentsProps<DetailsListUIConfigType>,
    IDetailsListDocumentsState<DetailsListUIConfigType>
> {
    private _allItems: DetailsListUIConfigType;

    constructor(props: IDetailsListDocumentsProps<DetailsListUIConfigType>) {
        super(props);

        const { columns: columnsConfig, items } = props;

        this._allItems = items;

        const columns: IColumn[] = columnsConfig.map((column: IColumn) => ({
            ...column,
            onColumnClick: this._onColumnClick
        }));

        this.state = {
            items: this._allItems,
            columns: columns,
            isModalSelection: false,
            isCompactMode: false,
            announcedMessage: undefined
        };
    }

    componentDidMount() {
        this._allItems = this.props.items;
        this.setState({ items: this._allItems });
    }

    componentDidUpdate(prevProps: IDetailsListDocumentsProps<DetailsListUIConfigType>) {
        if (JSON.stringify(this.props.items) !== JSON.stringify(prevProps.items)) {
            this._allItems = this.props.items;
            this.setState({ items: this._allItems });
        }
    }

    public render() {
        const { withAddBtn, createButtonConfig } = this.props;
        const { columns, isCompactMode, items, isModalSelection, announcedMessage } = this.state;

        return (
            <Fabric>
                <div className={classNames.controlWrapper}>
                    <TextField
                        label="Filter by name:"
                        onChange={this._onChangeText}
                        styles={controlStyles}
                    />

                    {withAddBtn && createButtonConfig && (
                        <CreateButton config={createButtonConfig} />
                    )}

                    <Announced message={`Number of items after filter applied: ${items.length}.`} />
                </div>
                {announcedMessage ? <Announced message={announcedMessage} /> : undefined}
                {isModalSelection ? (
                    <DetailsList
                        items={items}
                        compact={isCompactMode}
                        columns={columns}
                        selectionMode={SelectionMode.multiple}
                        getKey={this._getKey}
                        setKey="multiple"
                        layoutMode={DetailsListLayoutMode.justified}
                        isHeaderVisible={true}
                        selectionPreservedOnEmptyClick={true}
                        onItemInvoked={this._onItemInvoked}
                        enterModalSelectionOnTouch={true}
                        ariaLabelForSelectionColumn="Toggle selection"
                        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                        checkButtonAriaLabel="Row checkbox"
                    />
                ) : (
                    <DetailsList
                        items={items}
                        compact={isCompactMode}
                        columns={columns}
                        selectionMode={SelectionMode.none}
                        getKey={this._getKey}
                        setKey="none"
                        layoutMode={DetailsListLayoutMode.justified}
                        isHeaderVisible={true}
                        onItemInvoked={this._onItemInvoked}
                    />
                )}
            </Fabric>
        );
    }

    private _getKey(item: ITeamsMemberHydrated, index?: number): string {
        return item.id || '';
    }

    private _onChangeText = (
        ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        text?: string
    ): void => {
        this.setState({
            items: text
                ? (this._allItems as any).filter(
                      (i: any) => i.name.toLowerCase().indexOf(text) > -1
                  )
                : this._allItems
        });
    };

    private _onItemInvoked(item: any): void {
        alert(`Item invoked: ${item.name}`);
    }

    private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        const { columns, items } = this.state;
        const newColumns: IColumn[] = columns.slice();
        const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
        newColumns.forEach((newCol: IColumn) => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending;
                currColumn.isSorted = true;
                this.setState({
                    announcedMessage: `${currColumn.name} is sorted ${
                        currColumn.isSortedDescending ? 'descending' : 'ascending'
                    }`
                });
            } else {
                newCol.isSorted = false;
                newCol.isSortedDescending = true;
            }
        });
        const newItems = _copyAndSort<any>(
            items,
            currColumn.fieldName!,
            currColumn.isSortedDescending
        );
        this.setState({
            columns: newColumns,
            items: newItems
        });
    };
}

function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    return items
        .slice(0)
        .sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}

export default DetailsListUI;
