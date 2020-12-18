var BlockchainInstance = require('./blockchain.ts');
var bitcoin = new BlockchainInstance();
var previousBlockHash = 'AZERTYUIOP4567DFD';
var currentBlockData = [
    {
        amount: 100,
        sender: '34REZFSFSDF',
        recipient: 'FGDFGDFGFG'
    },
    {
        amount: 300,
        sender: 'df34REZFSFSDF',
        recipient: 'FfdsGDFGDFGFG'
    },
    {
        amount: 34300,
        sender: 'df34REZFfsdSFSDF',
        recipient: 'FfdsGDFGsdfDFGFG'
    },
];
var nonce = 100;
console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));
