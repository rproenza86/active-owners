import { Modal } from 'antd';

const { confirm } = Modal;

export interface IConfirmConfig {
    title: string;
    content: string;
    onOkCallback: () => void;
}

interface ShowConfirm {
    (config: IConfirmConfig): void;
}

let showConfirm: ShowConfirm;
showConfirm = function({ title, content, onOkCallback }) {
    confirm({
        title,
        content,
        onOk() {
            onOkCallback();
        },
        onCancel() {}
    });
};

export default showConfirm;
