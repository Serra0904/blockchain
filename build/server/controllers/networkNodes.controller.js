"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var express = require('express');
var blockchainRoutes = express.Router();
var blockchain = require('../../blockchain/blockchain');
var ipseicoin = new blockchain();
var nodeAddress = uuid_1.v1().split('-').join('');
blockchainRoutes
    .get('/', function (req, res) {
    res.send(ipseicoin);
})
    .get('/mine', function (req, res) {
    var lastBlock = ipseicoin.getLastBlock();
    var previousBlockHash = lastBlock.hash;
    var currentBlock = {
        transactions: ipseicoin.pendingTransactions,
        index: lastBlock.index + 1,
    };
    var nonce = ipseicoin.proofOfWork(previousBlockHash, currentBlock);
    var blockHash = ipseicoin.hashBlock(previousBlockHash, currentBlock, nonce);
    ipseicoin.createNewTransaction(12.5, '00', nodeAddress);
    var newBlock = ipseicoin.createNewBlock(nonce, previousBlockHash, blockHash);
    res.json({
        note: 'newBlock mined successfully',
        block: newBlock,
    });
})
    .post('/transaction', function (req, res) {
    var blockIndex = ipseicoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json("note: transaction will be added in block " + blockIndex + ".");
})
    .post('/broadcast-node', function (req, res) {
    var newNodeUrl = req.body.newNodeUrl;
    if (ipseicoin.networkNodes.indexOf(newNodeUrl) === -1)
        ipseicoin.networkNodes.push(newNodeUrl);
    ipseicoin.networkNodes.forEach(function (networkNodeUrl) {
        console.log(networkNodeUrl);
    });
})
    .post('/register-node', function (req, res) {
    // const { newNodeUrl } = req.body;
})
    .post('/register-node-bulk', function (req, res) {
    // const { newNodeUrl } = req.body;
});
module.exports = blockchainRoutes;
