"use strict";
var sha256 = require('sha256');
function Blockchain() {
    // @ts-ignore
    this.chain = [];
    // @ts-ignore
    this.pendingTransactions = [];
    // @ts-ignore
    this.createNewBlock(100, '0', '0');
}
Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
    var newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash,
    };
    this.pendingTransactions = [];
    this.chain.push(newBlock);
    return newBlock;
};
Blockchain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
};
Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
    var newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
    };
    this.pendingTransactions.push(newTransaction);
    return this.getLastBlock().index + 1;
};
Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
    var dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    return sha256(dataAsString);
};
Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
    var nonce = 0;
    var hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substr(0, 4) !== '0000') {
        nonce += 1;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }
    return nonce;
};
module.exports = Blockchain;
