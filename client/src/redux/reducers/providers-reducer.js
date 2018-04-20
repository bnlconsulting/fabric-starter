//INTERNAL
import * as types from '../actions/action-types';

//LODASH
import _ from 'lodash';

const defaults = {
    list: [],
    totalRecords:0,
    provider:null,
    providerHistory:null,

    peers:[],
    channels:[],
    chaincodes:[],

    selectedOrg:null,
    selectedPeer:null,
    selectedChannel:null,
    selectedChaincode:null,

    org:null,
    running:0,


    txHistory:[]

};

/**
 * Set initial data
 *
 * @param store
 * @param data
 */
function setData(store, data) {
    return {
        ...store,
        list: (data.list || [] ).slice(),
        totalRecords:data.stat.totalRecords,
        running: store.running - 1
    };
}

function clearData(store, data) {
    return {
        ...store,
        list: data.slice(),
        running: store.running + 1
    };
}

function setProvider(store, data) {
    return {
        ...store,
        provider: data
    };
}

function setOrg(store, data) {
    return {
        ...store,
        selectedOrg: data
    };
}

function setTxHistory(store, data) {
    data.sort(function(a, b){return b.blockNumber - a.blockNumber});
    return {
        ...store,
        txHistory: data
    };
}

function setProviderHistory(store, data) {
    let providerId = data[0].Value.credentialNumber;
    let provider = _.find(store.list, {Key:providerId});
    if(provider)
        provider.history = data.reverse();

    return {
        ...store,
        providerHistory: data,
        list:store.list.slice()
    };
}

function setPeers(store, data) {
    // TODO check if current selection is contained in list received
    let selectedPeer = store.selectedPeer || data[0];
    return {
        ...store,
        peers: data,
        selectedPeer
    };
}

function setChannels(store, data) {
    // TODO check if current selection is contained in list received
    let selectedChannel = store.selectedChannel || data[0];
    return {
        ...store,
        channels: data,
        selectedChannel
    };
}

function setChaincodes(store, data) {
    // TODO check if current selection is contained in list received
    let selectedChaincode = store.selectedChaincode || data[0];
    return {
        ...store,
        chaincodes: data,
        selectedChaincode
    };
}

function clearProvider(store) {
    return {
        ...store,
        provider:null,
        providerHistory:null,
    };
}

function setSelectedPeer(store, data) {
    return {
        ...store,
        selectedPeer:data
    };
}

function setSelectedChannel(store, data) {
    return {
        ...store,
        selectedChannel: data
    };
}

function setSelectedChaincode(store, data) {
    return {
        ...store,
        selectedChaincode:data
    };
}

export default (store = defaults, action) => {
    switch (action.type) {

        case types.GET_PROVIDER_DATA:
            return clearData(store, []);
        case types.PROVIDER_DATA_RECEIVED:
            return setData(store, action.data);
        case types.PROVIDER_EDIT_RECEIVED:
            return setProvider(store, action.data);

        case types.PROVIDER_HISTORY_RECEIVED:
            return setProviderHistory(store, action.data);
        case types.CLEAR_PROVIDER:
            return clearProvider(store);


        case types.PEERS_RECEIVED:
            return setPeers(store, action.data);
        case types.CHANNELS_RECEIVED:
            return setChannels(store, action.data);
        case types.CHAINCODES_FOR_CHANNEL_RECEIVED:
            return setChaincodes(store, action.data);

        case types.SELECT_PEER:
            return setSelectedPeer(store, action.data);
        case types.SELECT_CHANNEL:
            return setSelectedChannel(store, action.data);
        case types.SELECT_CHAINCODE:
            return setSelectedChaincode(store, action.data);
        case types.ORG_RECEIVED:
            return setOrg(store, action.data);
        case types.TX_HISTORY_RECEIVED:
            return setTxHistory(store, action.data);
        default:
            return store;
    }
};
