//REQUEST
import request from 'request-promise-native';

//LODASH
import _ from 'lodash';

//MOMENT
import moment from 'moment';

//CHANGECASE
import changeCase from 'change-case';

let token = null;

let baseURI = 'http://54.89.228.85:4000';
const txHistoryLimit = 10000;

function getConfig(){
    return request({
        uri: baseURI + '/config',
        json: true
    }).then((response) => {
        let data = {peers:[]};
        data.org = response.org;

        for(var propertyName in response["network-config"][response.org]){
            if(propertyName.startsWith('peer')){
                data.peers.push(propertyName) ;
            }
        }

        return data;
    });
}

function login(credentials ){
    return request({
        uri: baseURI + '/users',
        method: 'POST',
        body: credentials,

        json: true
    }).then((response) => {
        token = 'Bearer ' + response.token;
        return response;
    });
}

function getChannels(peer){
    return request({
        uri: baseURI + '/channels',
        qs:{
            peer:peer
        },
        method: 'GET',
        headers:{
            Authorization:token
        },
        json: true
    }).then((response) => {
        return _.map(response.channels, 'channel_id');
    });
}

function getChaincodes(peer, channel){
    return request({
        uri: baseURI + '/chaincodes',
        qs:{
            peer:peer,
            channel:channel,
            type:'instantiated'
        },
        method: 'GET',
        headers:{
            Authorization:token
        },
        json: true

    }).then((response) => {
        return _.map(response.chaincodes, 'name');
    });
}

function queryList(org, peer, channel, chaincode, query){
    query = query || { selector:{ } };

    return request({
        uri: baseURI + '/channels/' + channel + '/chaincodes/' + chaincode,
        qs:{
            "peer":org + '/' + peer,
            "fcn":"getQueryResultForQueryString",
            "args":'["' + JSON.stringify(
                query
            ).replace(/"/g, '\\"') +'"]'
        },
        method: 'GET',
        headers:{
            Authorization:token
        },
        json: true

    }).then((response) => {
        return response;
    });
}

function createProvider(org, peer, channel, chaincode, healthProvider){
    let requestConfig = {
        uri: baseURI + '/channels/' + channel + '/chaincodes/' + chaincode,
        body:{
            "peers":[ org + '/' + peer ],
            "fcn":"createProvider",
            "args":[ JSON.stringify(healthProvider) ]
        },
        method: 'POST',
        headers:{
            Authorization:token
        },
        json: true

    };
    console.log(requestConfig);

    return request(requestConfig).then((response) => {
        return response;
    });
}

function updateProvider(org, peer, channel, chaincode, healthProvider){
    let requestConfig = {
        uri: baseURI + '/channels/' + channel + '/chaincodes/' + chaincode,
        body:{
            "peers":[ org + '/' + peer ],
            "fcn":"updateProvider",
            "args":[ JSON.stringify(healthProvider) ]
        },
        method: 'POST',
        headers:{
            Authorization:token
        },
        json: true

    };

    return request(requestConfig).then((response) => {
        return response;
    });
}

function getProvider(org, peer, channel, chaincode, providerId){
    return request({
        uri: baseURI + '/channels/' + channel + '/chaincodes/' + chaincode,
        qs:{
            "peer":org + '/' + peer,
            "fcn":"queryProvider",
            "args":'["' + providerId + '"]'
        },
        method: 'GET',
        headers:{
            Authorization:token
        },
        json: true

    }).then((response) => {
        if(response.result){
            response.result.lastIssueDate = moment(response.result.lastIssueDate, 'YYYYMMDD');
            response.result.firstIssueDate = moment(response.result.firstIssueDate, 'YYYYMMDD');
            response.result.expirationDate = moment(response.result.expirationDate, 'YYYYMMDD');
            response.result.ceDueDate = moment(response.result.ceDueDate, 'YYYYMMDD');

            return response.result;
        }

        console.log('error check channel and chaincode selections')
    });
}

function getProviderHistory(org, peer, channel, chaincode, providerId){
    return request({
        uri: baseURI + '/channels/' + channel + '/chaincodes/' + chaincode,
        qs:{
            "peer":org + '/' + peer,
            "fcn":"getHistoryForProvider",
            "args":'["' + providerId +'"]'
        },
        method: 'GET',
        headers:{
            Authorization:token
        },
        json: true

    }).then((response) => {

        response.result.forEach(function(transaction){
            let ms = parseInt((transaction.Timestamp.seconds || '').replace('SIGNED:', '') + '000', 10 );
            transaction.Timestamp = new moment(ms);
        });

        return _.sortBy(response.result, 'Timestamp')
            .map( (transaction) => {
                transaction.username = transaction.Value.username;
                delete transaction.Value.username;
                return transaction

            })
            .map( (transaction, index, collection) => {
                transaction.txOrder = index;

                let differencesX = differenceX(transaction.Value, index !== 0 ? collection[index - 1].Value : {});
                let changes = [];
                for( let property in differencesX ){
                    //{property, old, new}
                    changes.push({property:changeCase.titleCase(property), old:differencesX[property].old,  new:differencesX[property].new})
                }
                transaction.differences = changes;
                return transaction;

            })
    });
}

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
function difference(object, base) {
    function changes(object, base) {
        return _.transform(object, function(result, value, key) {
            if (!_.isEqual(value, base[key])) {
                result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
            }
        });
    }
    return changes(object, base);
}

function differenceX(object, base) {
    function changes(object, base) {
        return _.transform(object, function(result, value, key) {
            if (!_.isEqual(value, base[key])) {
                result[key] = {new:value, old:base[key]};
            }
        });
    }
    return changes(object, base);
}

function getTxHistory(peer, channel){
    return request({
        uri: baseURI + '/channels/' + channel,
        qs:{
            peer:peer,
        },
        method: 'GET',
        headers:{
            Authorization:token
        },
        json: true

    }).then((response) => {
        let transactions = [];

        return getBlockInfo(peer, channel, response.currentBlockHash)
            .then((blockResponse) => {
                let placeHolders = {};
                placeHolders.blockNumber = parseInt(blockResponse.header.number, 10);

                blockResponse.data.data.forEach(function(data){
                    placeHolders.timestamp = data.payload.header.channel_header.timestamp;
                    placeHolders.txId = data.payload.header.channel_header.tx_id;

                    data.payload.data.actions.forEach(function(action){
                        _.reject(action.payload.action.proposal_response_payload.extension.results.ns_rwset, {namespace:'lscc'})
                            .every(function(rwSet){
                                rwSet.rwset.writes.every(function(write){
                                    let jsonValue = JSON.parse(write.value);
                                    let transaction = _.assign({write:jsonValue, username:jsonValue.username}, placeHolders);
                                    delete jsonValue.username;
                                    transactions.push(transaction);
                                    if(transactions.length >= txHistoryLimit) return false;
                                    else return true;
                                });
                                if(transactions.length >= txHistoryLimit) return false;
                                else return true;
                            })
                    });
                });
                return placeHolders.blockNumber;
            })
            .then(async function(blockNumber)  {
                while(transactions.length < txHistoryLimit && blockNumber > 0){
                    let currentBlock = await getBlockInfoByNumber(peer, channel, --blockNumber);
                    let placeHolders = {blockNumber:blockNumber};
                    currentBlock.data.data.forEach(function(data){
                        placeHolders.timestamp = data.payload.header.channel_header.timestamp;
                        placeHolders.txId = data.payload.header.channel_header.tx_id;

                        data.payload.data.actions.forEach(function(action){
                            _.reject(action.payload.action.proposal_response_payload.extension.results.ns_rwset, {namespace:'lscc'})
                                .every(function(rwSet){
                                    rwSet.rwset.writes.every(function(write){
                                        let jsonValue = JSON.parse(write.value);
                                        let transaction = _.assign({write:jsonValue, username:jsonValue.username}, placeHolders);
                                        delete jsonValue.username;
                                        transactions.push(transaction);
                                        if(transactions.length >= txHistoryLimit) return false;
                                        else return true;
                                    });
                                    if(transactions.length >= txHistoryLimit) return false;
                                    else return true;
                                })
                        });
                    });
                }
            })
            .then(() => {
                return transactions
            });
    });
}

function getChannelInfo(peer, channel){
    return request({
        uri: baseURI + '/channels/' + channel,
        qs:{
            peer:peer,
        },
        method: 'GET',
        headers:{
            Authorization:token
        },
        json: true

    }).then((response) => {

        console.log(response);
        getBlockInfo(peer, channel, response.previousBlockHash);

        return response ;
    });
}

function getBlockInfo(peer, channel, hash){
    return request({
        uri: baseURI + '/channels/' + channel + '/blocks',
        qs:{
            peer:peer,
            hash: hash
        },
        method: 'GET',
        headers:{
            Authorization:token
        },
        json: true

    });
}

function getBlockInfoByNumber(peer, channel, blockNumber){
    return request({
        uri: baseURI + '/channels/' + channel + '/blocks/' + blockNumber,
        qs:{
            peer:peer,
        },
        method: 'GET',
        headers:{
            Authorization:token
        },
        json: true

    });/*.then((response) => {

        let header = response.header;
        console.log(header);

        response.data.data.forEach(function(data){
            console.log(data.payload.header.channel_header.tx_id);
            // console.log(data);
            if(data.payload.data.actions)
                data.payload.data.actions.forEach(function(action){
                    action.payload.action.proposal_response_payload.extension.results.ns_rwset.forEach(function(rwSet){
                        if(rwSet.rwset.writes.length > 0){
                            console.log(rwSet.rwset.writes)
                        }
                    })
                });
        });

        // Endless loop  need to surround with logic
        //     getBlockInfoByNumber(peer, channel, --blockNumber );

        return response ;
    });*/
}




function init(){
}

export default  {
    queryList,
    createProvider,
    getProvider,
    updateProvider,

    getConfig,
    getChannels,
    getChaincodes,

    getProviderHistory,
    getTxHistory,

    login,

    init
};
