"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
var blockchainRouter = require('./router/blockchain-router');
app.use('/', blockchainRouter);
app.listen(3000, function () {
    console.log('App listening on port 3000...');
});
