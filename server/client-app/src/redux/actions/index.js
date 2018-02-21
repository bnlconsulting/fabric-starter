import * as types from './action-types';
import history from '../history';

export const getProviderData = ( query) => {
    return (dispatch, getState, api) => {
        dispatch({type: types.GET_PROVIDER_DATA});
        dispatch({type: types.REQUEST_MADE});

        return api.queryList(getState().providers.selectedOrg,  getState().providers.selectedPeer, getState().providers.selectedChannel, getState().providers.selectedChaincode, query)
            .then(data => {
                dispatch({type: types.PROVIDER_DATA_RECEIVED, data:data.result});
            })
            .finally(() => {
                dispatch({type: types.REQUEST_RETURNED});
            });
    }
};

export const createProvider = (provider) => {
    return (dispatch, getState, api) => {
        dispatch({type: types.CREATE_PROVIDER});
        dispatch({type: types.REQUEST_MADE});

        return api.createProvider(getState().providers.selectedOrg,  getState().providers.selectedPeer, getState().providers.selectedChannel, getState().providers.selectedChaincode, provider)
            .then(data => {
                +                history.push('/healthProviders/edit/'+ provider.credentialNumber)
                +                getProvider(provider.credentialNumber)(dispatch, getState, api);
                +                getProviderHistory(provider.credentialNumber)(dispatch, getState, api);
                +                console.log(data);
            })
            .finally(() => {
                dispatch({type: types.REQUEST_RETURNED});
            });
    }
};

export const login = (credentials) => {
    return (dispatch, getState, api) => {

        return api.login(credentials)
            .then(data => {
                dispatch({type: types.LOGIN_SUCCESS, data:data});
            })
            .then(() => {
                history.push('/healthProviders')
            });
    }
};

export const logout = () => {
    history.push('/');
    return {
        type:types.LOGOUT,
    };
};

export const updateProvider = ( provider) => {
    return (dispatch, getState, api) => {
        dispatch({type: types.UPDATE_PROVIDER});
        dispatch({type: types.REQUEST_MADE});

        return api.updateProvider(getState().providers.selectedOrg, getState().providers.selectedPeer, getState().providers.selectedChannel, getState().providers.selectedChaincode, provider)
            .then(data => {
                getProvider(provider.credentialNumber)(dispatch, getState, api);
                getProviderHistory(provider.credentialNumber)(dispatch, getState, api);
                return data
            })
            .finally(() => {
                dispatch({type: types.REQUEST_RETURNED});
            });
    }
};

export const getProvider = ( providerId ) => {
    return (dispatch, getState, api) => {
        dispatch({type: types.REQUEST_MADE});

        return api.getProvider(getState().providers.selectedOrg, getState().providers.selectedPeer, getState().providers.selectedChannel, getState().providers.selectedChaincode, providerId)
            .then(data => {
                dispatch({type: types.PROVIDER_EDIT_RECEIVED, data:data});
            })
            .finally(() => {
                dispatch({type: types.REQUEST_RETURNED});
            });
    }
};

export const getProviderHistory = (providerId) => {
    return (dispatch, getState, api) => {
        dispatch({type: types.REQUEST_MADE});
        return api.getProviderHistory(getState().providers.selectedOrg, getState().providers.selectedPeer, getState().providers.selectedChannel, getState().providers.selectedChaincode, providerId)
            .then(data => {
                dispatch({type: types.PROVIDER_HISTORY_RECEIVED, data:data});
            })
            .finally(() => {
                dispatch({type: types.REQUEST_RETURNED});
            });
    }
};

export const getConfig = () => {
    return (dispatch, getState, api) => {
        dispatch({type: types.GET_CONFIG});

        return api.getConfig()
            .then(data => {
                dispatch({type: types.ORG_RECEIVED, data:data.org});
                dispatch({type: types.PEERS_RECEIVED, data:data.peers});
           })
            .then(() => {
                return getChannels(getState().providers.selectedPeer)(dispatch, getState, api);
            })
            .then(() => {
                return getChaincodes(getState().providers.selectedPeer, getState().providers.selectedChannel)(dispatch, getState, api);
            });
    }
};

export const getChannels = (peer) => {
    return (dispatch, getState, api) => {
        dispatch({type: types.GET_CHANNELS});
        dispatch({type: types.REQUEST_MADE});

        return api.getChannels(peer)
            .then(data => {
                dispatch({type: types.CHANNELS_RECEIVED, data:data});
                return data;
            })
            .finally(() => {
                dispatch({type: types.REQUEST_RETURNED});
            });
    }
};

export const getChaincodes = (peer, channel) => {
    return (dispatch, getState, api) => {
        dispatch({type: types.REQUEST_MADE});
        dispatch({type: types.GET_CHAINCODES_FOR_CHANNEL});

        return api.getChaincodes(peer, channel)
            .then(data => {
                dispatch({type: types.CHAINCODES_FOR_CHANNEL_RECEIVED, data:data});
                return data;
            })
            .finally(() => {
                dispatch({type: types.REQUEST_RETURNED});
            });
    }
};

export const selectPeer = (peer) => {
    return {
        type:types.SELECT_PEER,
        data:peer
    }
};

export const selectChannel = (channel) => {
    return {
        type:types.SELECT_CHANNEL,
        data:channel
    }
};

export const selectChaincode = (chaincode) => {
    return {
        type:types.SELECT_CHAINCODE,
        data:chaincode
    }
};


export const clearProvider = () => {
    return {
        type:types.CLEAR_PROVIDER}
};

export const getTxHistory = () => {
    return (dispatch, getState, api) => {
        dispatch({type: types.REQUEST_MADE});

        return api.getTxHistory(getState().providers.selectedPeer, getState().providers.selectedChannel)
            .then(data => {
                dispatch({type: types.TX_HISTORY_RECEIVED, data:data});
            })
            .finally(() => {
                dispatch({type: types.REQUEST_RETURNED});
            });
    }
};


export const clearData = () => {
    return {
        type:types.CLEAR_DATA}
};


export const initialize = () => {
    return (dispatch, getState, api) => {
        return api.init()
    }
};
