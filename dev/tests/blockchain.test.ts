const BlockchainInstance = require('../blockchain/blockchain.ts');

const bitcoin = new BlockchainInstance();

const previousBlockHash = 'AZERTYUIOP4567DFD';
const currentBlockData = [
  {
    amount: 100,
    sender: '34REZFSFSDF',
    recipient: 'FGDFGDFGFG',
  },
  {
    amount: 300,
    sender: 'df34REZFSFSDF',
    recipient: 'FfdsGDFGDFGFG',
  },
  {
    amount: 34300,
    sender: 'df34REZFfsdSFSDF',
    recipient: 'FfdsGDFGsdfDFGFG',
  },
];

const nonce = 100;

console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));
