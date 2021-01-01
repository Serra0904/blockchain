const express = require('express');

const app = express();
const blockchainRouter = require('./router/blockchain-router');

app.use('/', blockchainRouter);

app.listen(3000, () => {
  console.log('App listening on port 3000...');
});

export {};
