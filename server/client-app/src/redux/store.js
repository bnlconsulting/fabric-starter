import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';

import api from './services/services';
import rootReducer from './reducers';
import {initialize} from './actions';

const initialState = {};
const enhancers = [];
const middleware = [
    thunkMiddleware.withExtraArgument(api),
];

if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.devToolsExtension;

    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension())
    }

    const {createLogger} = require(`redux-logger`);
    middleware.push(createLogger({collapsed: true}));
}

const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
);

const store = createStore(
    rootReducer,
    initialState,
    composedEnhancers
);

store.dispatch(initialize());

export default store