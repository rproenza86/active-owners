import { AnyAction } from 'redux';

export function middlewareLogger(action: AnyAction, store: any) {
    console.group(action.type);
    console.info('dispatching', action);
    console.log('next state', store.getState());
    console.groupEnd();
}
