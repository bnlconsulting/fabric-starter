//REDUX
import { combineReducers } from 'redux';

//INTERNAL
import providers from './providers-reducer';
import user from './user-reducer';

const rootReducer = combineReducers({
    providers,
    user
});

export default rootReducer;
