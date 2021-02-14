import { v1 as uuid } from 'uuid';

const express = require('express');
const rp = require('request-promise');

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
  })
  .post('/broadcast-node', (req: any, res: any) => {
    const { newNodeUrl } = req.body;
    if (ipseicoin.networkNodes.indexOf(newNodeUrl) === -1) ipseicoin.networkNodes.push(newNodeUrl);
    const registerNodesPromises: Array<Promise<any>> = [];
    ipseicoin.networkNodes.forEach((networkNodeUrl: string) => {
      const requestOptions = {
        uri: `${networkNodeUrl}/register-node`,
        method: 'POST',
        body: { newNodeUrl },
        json: true,
      };
      registerNodesPromises.push(rp(requestOptions));
    });
    Promise.all(registerNodesPromises).then(() => {
      const requestOptions = {
        uri: `${newNodeUrl}/register-node-bulk`,
        method: 'POST',
        body: { allNetworkNodes: [...ipseicoin.networkNodes, ipseicoin.currentNode] },
        json: true,
      };
      return rp(requestOptions);
    }).then(() => {
      res.json({ note: 'NEW NODE CREATED' });
    })
      .catch((err) => {
        res.json({ note: 'ERROR WHILE NEW NODE CREATED', err });
      });
  })
  .post('/register-node', (req: any, res: any) => {
    const { newNodeUrl } = req.body;
    const alreadyRegistered = ipseicoin.networkNodes.indexOf(newNodeUrl) === -1;
    const isCurrentNode = ipseicoin.currentNode !== newNodeUrl;
    if (alreadyRegistered && isCurrentNode) ipseicoin.networkNodes.push(newNodeUrl);
    res.json({ note: 'NEW NODE REGISTERED' });
  })
  .post('/register-node-bulk', (req: any, res: any) => {
    // const { newNodeUrl } = req.body;
  });

module.exports = blockchainRoutes;
