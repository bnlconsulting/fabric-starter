'use strict';
const shim = require('fabric-shim');

let Chaincode = class {

    // The Init method is called when the Smart Contract is instantiated by the blockchain network
    // Best practice is to have any Ledger initialization in separate function -- see initLedger()
    async Init(stub) {
        console.info('=========== Instantiated chaincode ===========');
        return shim.success();
    }

    async initLedger(stub, args) {
        console.info('============= START : Initialize Ledger ===========');
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
            console.log(ret.fcn, JSON.stringify(ret.params));
            let payload = await method(stub, ret.params, this);
            return shim.success(payload);
        } catch (err) {
            console.log(err);
            return shim.error(err);
        }
    }

    async queryStat(stub, args) {
        if (args.length !== 1) {
            throw new Error('Incorrect number of arguments. Expecting CredentialNumber ');
        }
        let statDocType = args[0];

        let statsAsBytes = await stub.getState(statDocType); //get the stat from chaincode state
        if (!statsAsBytes || statsAsBytes.toString().length <= 0) {
            throw new Error(statDocType + ' does not exist: ');
        }
        let stat = statsAsBytes.toString('utf8');
        console.log(stat);
        return Buffer.from(stat);
    }

    async createStat(stub, args) {
        console.info('============= START : Create Stat ===========');
        if (args.length !== 1) {
            throw new Error('Incorrect number of arguments. Expecting 1');
        }

        let newStat = JSON.parse(args[0]);

        let statAsBytes = await stub.getState(newStat.docType); //get the stat from chaincode state
        if (!statAsBytes || statAsBytes.toString().length <= 0) {
            await stub.putState(newStat.docType, Buffer.from(JSON.stringify(newStat)));
        }else{
            throw new Error('Stat ' + newStat.docType + ' already exist: ');
        }

        console.info('============= END : Create Stat ===========');
    }

    async updateStat(stub, args) {
        console.info('============= START : Update Stat ===========');
        if (args.length !== 1) {
            throw new Error('Incorrect number of arguments. Expecting 1');
        }

        let newStat = JSON.parse(args[0]);

        let statAsBytes = await stub.getState(newStat.docType); //get the stat from chaincode state
        if (!statAsBytes || statAsBytes.toString().length <= 0) {
            throw new Error('Stat ' + newStat.docType + ' does not exist: ');
        }else{
            await stub.putState(newStat.docType, Buffer.from(JSON.stringify(newStat)));
        }

        console.info('============= END : Update Stat ===========');
    }

    async increaseStat(stub, args) {
        console.info('============= START : Increase Stat ===========');
        if (args.length !== 3) {
            throw new Error('Incorrect number of arguments. Expecting 3');
        }

        let docType = args[0];

        let statAsBytes = await stub.getState(docType); //get the stat from chaincode state
        if (!statAsBytes || statAsBytes.toString().length <= 0) {
            throw new Error('Stat ' + newStat.docType + ' does not exist: ');
        }else{
            let stat = JSON.parse(statAsBytes);
            stat[args[1]] += parseInt(args[2]);
            await stub.putState(docType, Buffer.from(JSON.stringify(stat)));
        }

        console.info('============= END : Increase Stat ===========');
    }


    // async getAllResults(iterator, isHistory) {
    //     let allResults = [];
    //     while (true) {
    //         let res = await iterator.next();
    //
    //         if (res.value && res.value.value.toString()) {
    //             let jsonRes = {};
    //             console.log(res.value.value.toString('utf8'));
    //
    //             if (isHistory && isHistory === true) {
    //                 jsonRes.TxId = res.value.tx_id;
    //                 jsonRes.Timestamp = res.value.timestamp;
    //                 jsonRes.IsDelete = res.value.is_delete.toString();
    //                 try {
    //                     jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
    //                 } catch (err) {
    //                     console.log(err);
    //                     jsonRes.Value = res.value.value.toString('utf8');
    //                 }
    //             } else {
    //                 jsonRes.Key = res.value.key;
    //                 try {
    //                     jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
    //                 } catch (err) {
    //                     console.log(err);
    //                     jsonRes.Record = res.value.value.toString('utf8');
    //                 }
    //             }
    //             allResults.push(jsonRes);
    //         }
    //         if (res.done) {
    //             console.log('end of data');
    //             await iterator.close();
    //             console.info(allResults);
    //             return allResults;
    //         }
    //     }
    // }
    //
    // async getHistoryForStat(stub, args, thisClass) {
    //
    //     if (args.length < 1) {
    //         throw new Error('Incorrect number of arguments. Expecting 1')
    //     }
    //
    //     let name = args[0];
    //     console.info('- start getHistoryForStat: %s\n', name);
    //
    //     let resultsIterator = await stub.getHistoryForKey(name);
    //     let method = thisClass['getAllResults'];
    //     let results = await method(resultsIterator, true);
    //
    //     return Buffer.from(JSON.stringify(results));
    // }
};

shim.start(new Chaincode());
