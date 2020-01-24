import showConfirm, { IConfirmConfig } from '../../utils/confirm';

/**
 *  Function to manage the create and delete ops. of a given document.
 *
 * @param hooks Hooks' values and functions to use on the ops.
 * @param deleteHandler Function to execute the delete op.
 */
export function createUpdateClickHandlers<T>(
    [[docInstance, setDocInstance], [addOrEditDocument, setAddOrEditDocument]]: [
        [T, React.Dispatch<React.SetStateAction<T>>],
        [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    ],
    deleteDocument: (doc: T) => any
) {
    const _onEditClick = (doc: T): void => {
        setDocInstance(doc);
        setAddOrEditDocument(!addOrEditDocument);
    };

    const _onDeleteClick = (doc: T): void => {
        const deleteConfirmConfig: IConfirmConfig = {
            title: 'Confirm Deletion!',
            content: 'Do you want to delete these data entry?',
            onOkCallback: () => deleteDocument(doc)
        };

        showConfirm(deleteConfirmConfig);
    };

    return { _onEditClick, _onDeleteClick };
}
