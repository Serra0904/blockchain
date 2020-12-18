const sha256 = require('sha256');

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];
}

Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
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

Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
  const newTransaction = {
    amount,
    sender,
    recipient,
  };
  this.pendingTransactions.push(newTransaction);
  return this.getLastBlock().index;
};

Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
  const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  return sha256(dataAsString);
};

module.exports = Blockchain;
