
var contracts = contracts || {};

function makeContracts() {
    var contractData = {
    "Example": {
        "code": "0x60606040525b60006000600050819055505b609680601d6000396000f360606040526000357c010000000000000000000000000000000000000000000000000000000090048063648b7ce8146041578063725f4fa714604e57603f565b005b604c60048050506080565b005b60596004805050606f565b6040518082815260200191505060405180910390f35b60006000600050549050607d565b90565b600160006000828282505401925050819055505b56",
        "info": {
            "abiDefinition": [
                {
                    "constant": false,
                    "inputs": [],
                    "name": "Increment",
                    "outputs": [],
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "GetValue",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "type": "function"
                },
                {
                    "inputs": [],
                    "type": "constructor"
                }
            ],
            "compilerVersion": "0.2.0-d2f18c73",
            "developerDoc": {
                "methods": {}
            },
            "language": "Solidity",
            "languageVersion": "0",
            "source": null,
            "userDoc": {
                "methods": {}
            }
        }
    }
};
    var contractNames = Object.keys(contractData);
    for (var i=0; i < contractNames.length; i++) {
        var contractName = contractNames[i];
        contracts[contractName] = web3.eth.contract(contractData[contractName].info.abiDefinition);
    }
};
makeContracts();
