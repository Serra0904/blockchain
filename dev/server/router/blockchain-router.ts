const express = require('express');

const blockchainRoutes = express.Router();
const blockchain = require('../../blockchain/blockchain');

const ipseicoin = new (blockchain as any)();

blockchainRoutes
  .get('/blockchain', (req: any, res: any) => {
    console.log('BlockChainController', req, res);
    res.send(ipseicoin);
  })
  .get('/mine', (req:any, res:any) => {
    console.log('minage', req, res);
    res.send('ok');
  })
  .post('/transaction', (req: any, res: any) => {
    console.log('blockcahinController', req.body);
    res.send(`the amount of bitcoin is ${req.body.amount}`);
  });

module.exports = blockchainRoutes;
