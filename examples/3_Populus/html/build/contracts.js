
var contracts = contracts || {};

function makeContracts() {
    var contractData = {};
    var contractNames = Object.keys(contractData);
    for (var i=0; i < contractNames.length; i++) {
        var contractName = contractNames[i];
        contracts[contractName] = web3.eth.contract(contractData[contractName].info.abiDefinition);
    }
};
makeContracts();
