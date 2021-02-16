import { v1 as uuid } from 'uuid';

const sha256 = require('sha256');

const currentUrl = process.argv[3];

// eslint-disable-next-line no-unused-vars
function Blockchain(this: any) {
  this.chain = [];
  this.pendingTransactions = [];
  this.currentNode = currentUrl;
  this.networkNodes = [];
  this.createNewBlock(100, '0', '0');
}

Blockchain.prototype.createNewBlock = function (nonce: number, previousBlockHash: object, hash: string) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce,
    hash,
    previousBlockHash,
  };

  this.pendingTransactions = [];
  this.chain.push(newBlock);

  return newBlock;
};

Blockchain.prototype.getLastBlock = function () {
  return this.chain[this.chain.length - 1];
};

Blockchain.prototype.createNewTransaction = function (amount: number, sender: string, recipient: string) {
  return {
    amount,
    sender,
    recipient,
    transactionId: uuid().split('-').join(''),
  };
};

Blockchain.prototype.addTransactionToPendingTransactions = function (transaction: object) {
  this.pendingTransactions.push(transaction);
  return this.getLastBlock().index + 1;
};

Blockchain.prototype.hashBlock = function (previousBlockHash: string, currentBlockData: object, nonce: number) {
  const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  return sha256(dataAsString);
};

Blockchain.prototype.proofOfWork = function (previousBlockHash: string, currentBlockData: object) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  while (hash.substr(0, 4) !== '0000') {
    nonce += 1;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  }

  return nonce;
};

module.exports = Blockchain;
