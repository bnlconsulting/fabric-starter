import { combineReducers } from 'redux';

import providers from './providers-reducer';
import user from './user-reducer';

const rootReducer = combineReducers({
    providers,
    user
});

export default rootReducer;
