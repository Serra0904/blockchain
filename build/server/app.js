"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var blockchainRouter = require('./router/blockchain-router');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/blockchain', blockchainRouter);
app.listen(3000, function () {
    console.log('App listening on port 3000...');
});
