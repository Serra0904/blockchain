"use strict";
var express = require('express');
var blockchainRoutes = express.Router();
var blockchain = require('../../blockchain/blockchain');
var ipseicoin = new blockchain();
blockchainRoutes
    .get('/blockchain', function (req, res) {
    console.log('BlockChainController', req, res);
    res.send(ipseicoin);
})
    .get('/mine', function (req, res) {
    console.log('minage', req, res);
    res.send('ok');
})
    .post('/transaction', function (req, res) {
    console.log('blockcahinController', req.body);
    res.send("the amount of bitcoin is " + req.body.amount);
});
module.exports = blockchainRoutes;
