import * as types from '../actions/action-types';
import jwtDecoder from 'jwt-decode';

const defaults = {
    jwtToken:null,
    requestsRunning:0,
    isAdmin: false
};

/**
 * Set initial data
 *
 * @param store
 * @param data
 */

function login(store, data) {
    let decoded = jwtDecoder(data.token);
    let isAdmin = decoded.username === 'admin';

    return {
        ...store,
        jwtToken: data.token,
        isAdmin
    };
}

function logout(store, data) {
    return {
        ...store,
        jwtToken:null
    };
}

function addRequest(store) {
    return {
        ...store,
        requestsRunning:store.requestsRunning + 1
    };
}


function removeRquest(store) {
    return {
        ...store,
        requestsRunning:store.requestsRunning - 1
    };
}

export default (store = defaults, action) => {
    switch (action.type) {
        case types.LOGIN_SUCCESS:
            return login(store, action.data);
        case types.LOGOUT:
            return logout(store);
        case types.REQUEST_MADE:
            return addRequest(store);
        case types.REQUEST_RETURNED:
            return removeRquest(store);
        default:
            return store;
    }
};
