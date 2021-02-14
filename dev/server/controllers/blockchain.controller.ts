import { v1 as uuid } from 'uuid';

const express = require('express');

const blockchainRoutes = express.Router();

const blockchain = require('../../blockchain/blockchain');

const ipseicoin = new (blockchain as any)();

const nodeAddress = uuid().split('-').join('');

blockchainRoutes
  .get('/', (req: any, res: any) => {
    res.send(ipseicoin);
  })
  .get('/mine', (req:any, res:any) => {
    const lastBlock = ipseicoin.getLastBlock();
    const previousBlockHash = lastBlock.hash;
    const currentBlock = {
      transactions: ipseicoin.pendingTransactions,
      index: lastBlock.index + 1,
    };
    const nonce = ipseicoin.proofOfWork(previousBlockHash, currentBlock);
    const blockHash = ipseicoin.hashBlock(previousBlockHash, currentBlock, nonce);
    ipseicoin.createNewTransaction(12.5, '00', nodeAddress);
    const newBlock = ipseicoin.createNewBlock(nonce, previousBlockHash, blockHash);
    res.json({
      note: 'newBlock mined successfully',
      block: newBlock,
    });
  })
  .post('/transaction', (req: any, res: any) => {
    const blockIndex = ipseicoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json(`note: transaction will be added in block ${blockIndex}.`);
  });

module.exports = blockchainRoutes;
