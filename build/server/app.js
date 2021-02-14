"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var blockchainController = require('./controllers/networkNodes.controller');
var port = process.argv[2];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/blockchain', blockchainController);
app.listen(port, function () {
    console.log("App listening on port " + port + "...");
});
