'use strict';

const   fs      = require('fs');
const   csv     = require('csvtojson');
const   exec    = require('child_process').execSync;

const defaultChaincodeVersion = "1.0";
const defaultFile = "Main";

let fileToLoad = process.argv[2] || defaultFile;
let chaincodeVersion = process.argv[3] || defaultChaincodeVersion;

function splitCsv(inputStream){
    let outputStream = null;
    let chunkIndex = 0;
    let lineIndex = 0;
    let delimiter = '\n';
    let lineLimit = 10000;

    if (!fs.existsSync("./temp")){
        fs.mkdirSync("./temp");
    }

    let createOutputStreamCallback = function(index){console.log(index);return  fs.createWriteStream(`./temp/${index}.json`);};

    csv()
        .fromStream(inputStream)
        .on('json',(heatlhCareProvider)=> {
            if (lineIndex === 0) {
                if (outputStream) {
                    outputStream.end("]");
                }
                outputStream = createOutputStreamCallback(chunkIndex++);
                outputStream.write("[");
            }

            heatlhCareProvider.index =   ((chunkIndex - 1) * lineLimit) + lineIndex;

            if(lineIndex !== 0) {
                outputStream.write(",");
                outputStream.write(delimiter);
            }

            outputStream.write(JSON.stringify(heatlhCareProvider));

            lineIndex = (++lineIndex) % lineLimit;
        })
        .on('done',(error)=>{
            if (outputStream) {
                outputStream.end("]", 'utf8', function(){
                    exec('docker exec dev-peer0.a.example.com-chaincode-' + chaincodeVersion + ' bash -c "mkdir -p /usr/local/src/output"' );

                    console.log('finish file split');
                    //tranfer files
                    exec('docker cp temp/. dev-peer0.a.example.com-chaincode-' + chaincodeVersion + ':/usr/local/src/output' );

                    console.log("finish file transfer");

                    //run loader...
                    for(let fileIndex = 0 ; fileIndex < chunkIndex ; fileIndex++){
                        let command =
                            "docker-compose -f /etc/hyperledger/ledger/docker-compose-a.yaml run \"cli.a.example.com\" bash " +
                            "-c \"CORE_PEER_ADDRESS=peer0.a.example.com:7051 " +
                            "peer chaincode invoke " +
                            "--tls --cafile /etc/hyperledger/crypto/orderer/tls/ca.crt " +
                            "-n chaincode " +
                            "-v " + chaincodeVersion + " " +
                            "-C common " +
                            "-c '{\\\"Args\\\":[\\\"" + fileIndex + "\\\"], \\\"Function\\\":\\\"bulkLoad\\\"}'\"";

                        exec(command);
                    }

                    console.log("finish bulk load");
                });
            }

        });
}



splitCsv(fs.createReadStream(fileToLoad));
