"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var blockchain = express.Router();
blockchain
    .get('/blockchain', function (req, res) {
    console.log('BlockChainController', req, res);
})
    .get('/mine', function (req, res) {
    console.log('minage', req, res);
})
    .post('/transaction', function (req, res) {
    console.log('blockcahinController', req, res);
});
exports.default = { blockchain: blockchain };
