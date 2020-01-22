import * as React from 'react';
import { ActionButton, IIconProps } from 'office-ui-fabric-react';

export interface ICreateButtonConfig {
    text: string;
    onClickHandler: () => void;
    iconProps?: IIconProps;
}

export interface IButtonExampleProps {
    config: ICreateButtonConfig;
}

const addFriendIcon: IIconProps = { iconName: 'AddFriend' };

export const CreateButton: React.FunctionComponent<IButtonExampleProps> = ({ config }) => {
    const { text, onClickHandler, iconProps } = config;

    return (
        <ActionButton
            iconProps={iconProps || addFriendIcon}
            allowDisabledFocus
            onClick={onClickHandler}
        >
            {text}
        </ActionButton>
    );
};
