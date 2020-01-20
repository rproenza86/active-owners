import { notification } from 'antd';

import 'antd/dist/antd.css';

interface INotificationProps {
    type: string;
    message: string;
    description: string;
}

/**
 *
 * @param type  =   success ||
                    error ||
                    info ||
                    warn ||
                    warning
 */
export const notifyEvent = ({ type, message, description }: INotificationProps) => {
    (notification as any)[type]({
        message,
        description
    });
};

export default notifyEvent;
