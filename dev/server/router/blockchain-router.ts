const express = require('express');

const blockchain = express.Router();

blockchain
  .get('/blockchain', (req: any, res: any) => {
    console.log('BlockChainController', req, res);
  })

  .get('/mine', (req:any, res:any) => {
    console.log('minage', req, res);
  })

  .post('/transaction', (req: any, res: any) => {
    console.log('blockcahinController', req, res);
  });

export default { blockchain };
