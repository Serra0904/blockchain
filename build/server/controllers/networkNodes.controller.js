"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var express = require('express');
var rp = require('request-promise');
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
    var requestsPromises = [];
    ipseicoin.networkNodes.forEach(function (networkNodeUrl) {
        var requestOptions = {
            uri: networkNodeUrl + "/blockchain/receive-new-block",
            method: 'POST',
            body: { newBlock: newBlock },
            json: true,
        };
        requestsPromises.push(rp(requestOptions));
    });
    Promise.all(requestsPromises).then(function () {
        var requestOptions = {
            uri: ipseicoin.currentNode + "/blockchain/transaction/broadcast",
            method: 'POST',
            body: { amount: 345, sender: '00', recipient: nodeAddress },
            json: true,
        };
        return rp(requestOptions);
    }).then(function () {
        res.json({
            note: 'New block created & broadcast successfully',
            newBlock: newBlock,
        });
    })
        .catch(function (err) {
        console.log(err);
    });
})
    .post('/receive-new-block', function (req, res) {
    var newBlock = req.body.newBlock;
    var lastBlock = ipseicoin.getLastBlock();
    var isHashCorrect = lastBlock.hash === newBlock.previousBlockHash;
    var isIndexCorrect = lastBlock.index + 1 === newBlock.index;
    if (isHashCorrect && isIndexCorrect) {
        ipseicoin.chain.push(newBlock);
        ipseicoin.pendingTransactions = [];
        res.json({ note: 'newBlock received && pendingTransactions empty', newBlock: newBlock });
    }
    else {
        res.json({ note: 'newBlock rejected && corrupted', newBlock: newBlock });
    }
})
    .post('/transaction', function (req, res) {
    var blockIndex = ipseicoin.addTransactionToPendingTransactions(req.body);
    res.json({ note: "Transaction will be added in block " + blockIndex });
})
    .post('/transaction/broadcast', function (req, res) {
    var newTransaction = ipseicoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    ipseicoin.addTransactionToPendingTransactions(newTransaction);
    var requestsPromises = [];
    ipseicoin.networkNodes.forEach(function (networkNodeUrl) {
        var requestOptions = {
            uri: networkNodeUrl + "/blockchain/transaction",
            method: 'POST',
            body: __assign({}, newTransaction),
            json: true,
        };
        requestsPromises.push(rp(requestOptions));
    });
    Promise.all(requestsPromises).then(function () {
        res.json({ note: 'Broadcast successfully' });
    }).catch(function (err) {
        console.error(err);
        res.json({ note: 'Error', err: err });
    });
})
    .post('/broadcast-node', function (req, res) {
    var newNodeUrl = req.body.newNodeUrl;
    if (ipseicoin.networkNodes.indexOf(newNodeUrl) === -1)
        ipseicoin.networkNodes.push(newNodeUrl);
    var registerNodesPromises = [];
    ipseicoin.networkNodes.forEach(function (networkNodeUrl) {
        var requestOptions = {
            uri: networkNodeUrl + "/blockchain/register-node",
            method: 'POST',
            body: { newNodeUrl: newNodeUrl },
            json: true,
        };
        registerNodesPromises.push(rp(requestOptions));
    });
    Promise.all(registerNodesPromises).then(function () {
        var requestOptions = {
            uri: newNodeUrl + "/blockchain/register-nodes-bulk",
            method: 'POST',
            body: { allNetworkNodes: __spreadArrays(ipseicoin.networkNodes, [ipseicoin.currentNode]) },
            json: true,
        };
        return rp(requestOptions);
    }).then(function () {
        res.json({ note: 'NEW NODE CREATED' });
    })
        .catch(function (err) {
        res.json({ note: 'ERROR WHILE NEW NODE CREATED', err: err });
    });
})
    .post('/register-node', function (req, res) {
    var newNodeUrl = req.body.newNodeUrl;
    var alreadyRegistered = ipseicoin.networkNodes.indexOf(newNodeUrl) === -1;
    var isCurrentNode = ipseicoin.currentNode !== newNodeUrl;
    if (alreadyRegistered && isCurrentNode)
        ipseicoin.networkNodes.push(newNodeUrl);
    res.json({ note: 'NEW NODE REGISTERED' });
})
    .post('/register-nodes-bulk', function (req, res) {
    var allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(function (networkNodeUrl) {
        var nodeNotAlreadyExist = ipseicoin.networkNodes.indexOf(networkNodeUrl) === -1;
        var notCurrentNode = ipseicoin.currentNode !== networkNodeUrl;
        if (nodeNotAlreadyExist && notCurrentNode)
            ipseicoin.networkNodes.push(networkNodeUrl);
    });
    res.json({ note: 'ALL NODES REGISTERED' });
});
module.exports = blockchainRoutes;
