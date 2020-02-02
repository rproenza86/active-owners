import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { verifyAuth } from './actions';
import rootReducer from './reducers';
import { cloudMessagingMiddleware } from './middleware/cloudMessaging';

export default function configureStore(persistedState?: any) {
    const middlewares = [thunkMiddleware, cloudMessagingMiddleware];
    const middlewareEnhancer = applyMiddleware(...middlewares);

    const enhancers = [middlewareEnhancer];
    const composedEnhancers = composeWithDevTools(...enhancers);

    const store = createStore(rootReducer, persistedState, composedEnhancers);
    store.dispatch(verifyAuth());
    return store;
}
