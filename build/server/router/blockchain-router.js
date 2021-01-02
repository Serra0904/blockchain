"use strict";
var express = require('express');
var blockchainRoutes = express.Router();
var blockchain = require('../../blockchain/blockchain');
var ipseicoin = new blockchain();
blockchainRoutes
    .get('/', function (req, res) {
    console.log('BlockChainController', req, res);
    res.send(ipseicoin);
})
    .get('/mine', function (req, res) {
    console.log('minage', req, res);
    res.send('ok');
})
    .post('/transaction', function (req, res) {
    var blockIndex = ipseicoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json("note: transaction will be added in block " + blockIndex + ".");
});
module.exports = blockchainRoutes;
