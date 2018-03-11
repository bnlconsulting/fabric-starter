/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const shim = require('fabric-shim');
const util = require('util');
const fs = require('fs');

let Chaincode = class {

    // The Init method is called when the Smart Contract is instantiated by the blockchain network
    // Best practice is to have any Ledger initialization in separate function -- see initLedger()
    async Init(stub) {
        console.info('=========== Instantiated fabcar chaincode ===========');
        return shim.success();
    }

    async bulkLoad(stub, args) {
        if (args.length !== 1) {
            throw new Error('Incorrect number of arguments. Expecting 1');
        }

        let filename = JSON.parse(args[0]);
        let promises = [];

        console.info('============= START : Loading File ' + filename + ' To Ledger ===========');
        let list = JSON.parse(fs.readFileSync(require.resolve("./output/" + filename)));
        list.forEach( function(provider){
            console.info(' Adding <--> ', provider.credentialNumber);
            promises.push( stub.putState(provider.credentialNumber, Buffer.from(JSON.stringify(provider))));
        });

        await Promise.all(promises);
        console.info('============= END : Initialize Ledger ===========');
    }

    // The Invoke method is called as a result of an application request to run the Smart Contract.
    // The calling application program has also specified the particular smart contract
    // function to be called, with arguments
    async Invoke(stub) {
        let ret = stub.getFunctionAndParameters();
        console.info(ret);

        let method = this[ret.fcn];
        if (!method) {
            console.error('no function of name:' + ret.fcn + ' found');
            throw new Error('Received unknown function ' + ret.fcn + ' invocation');
        }
        try {
            console.log(ret.fcn, JSON.stringify(ret.params))
            let payload = await method(stub, ret.params, this);
            return shim.success(payload);
        } catch (err) {
            console.log(err);
            return shim.error(err);
        }
    }

    async queryProvider(stub, args) {
        if (args.length != 1) {
            throw new Error('Incorrect number of arguments. Expecting CredentialNumber ');
        }
        let providerCredentialNumber = args[0];

        let providerAsBytes = await stub.getState(providerCredentialNumber); //get the provider from chaincode state
        if (!providerAsBytes || providerAsBytes.toString().length <= 0) {
            throw new Error(providerCredentialNumber + ' does not exist: ');
        }
        console.log(providerAsBytes.toString());
        return providerAsBytes;
    }

    async createProvider(stub, args) {
        console.info('============= START : Create Provider ===========');
        if (args.length != 1) {
            throw new Error('Incorrect number of arguments. Expecting 1');
        }

        let newProvider = JSON.parse(args[0]);

        newProvider.docType =  'provider';

        let providerAsBytes = await stub.getState(newProvider.credentialNumber); //get the provider from chaincode state
        if (!providerAsBytes || providerAsBytes.toString().length <= 0) {
            await stub.putState(newProvider.credentialNumber, Buffer.from(JSON.stringify(newProvider)));
        }else{
            throw new Error(newProvider.credentialNumber + ' already exist: ');
        }

        console.info('============= END : Create Provider ===========');
    }

    async updateProvider(stub, args) {
        console.info('============= START : Update Provider ===========');
        if (args.length != 1) {
            throw new Error('Incorrect number of arguments. Expecting 1');
        }

        let newProvider = JSON.parse(args[0]);

        newProvider.docType =  'provider';

        let providerAsBytes = await stub.getState(newProvider.credentialNumber); //get the provider from chaincode state
        if (!providerAsBytes || providerAsBytes.toString().length <= 0) {
            throw new Error(newProvider.credentialNumber + ' does not exist: ');
        }else{
            await stub.putState(newProvider.credentialNumber, Buffer.from(JSON.stringify(newProvider)));
        }

        console.info('============= END : Create Provider ===========');
    }

    async deleteProvider(stub, args) {
        if (args.length != 1) {
            throw new Error('Incorrect number of arguments. Expecting CredentialNumber ');
        }
        let providerCredentialNumber = args[0];
        await stub.deleteState(providerCredentialNumber);
    }

    // =========================================================================================
    // getQueryResultForQueryString executes the passed in query string.
    // Result set is built and returned as a byte array containing the JSON results.
    // =========================================================================================
    async getQueryResultForQueryString(stub, args, thisClass) {

        let queryString =args[0];

        console.info('- getQueryResultForQueryString queryString:\n' + queryString)
        let resultsIterator = await stub.getQueryResult(queryString);
        let method = thisClass['getAllResults'];

        let results = await method(resultsIterator, false);

        return Buffer.from(JSON.stringify(results));
    }

    async getAllResults(iterator, isHistory) {
        let allResults = [];
        while (true) {
            let res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));

                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.tx_id;
                    jsonRes.Timestamp = res.value.timestamp;
                    jsonRes.IsDelete = res.value.is_delete.toString();
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return allResults;
            }
        }
    }

    async getHistoryForProvider(stub, args, thisClass) {

        if (args.length < 1) {
            throw new Error('Incorrect number of arguments. Expecting 1')
        }

        let credentialNumber = args[0];
        console.info('- start getHistoryForProvider: %s\n', credentialNumber);

        let resultsIterator = await stub.getHistoryForKey(credentialNumber);
        let method = thisClass['getAllResults'];
        let results = await method(resultsIterator, true);

        return Buffer.from(JSON.stringify(results));
    }
};

shim.start(new Chaincode());
