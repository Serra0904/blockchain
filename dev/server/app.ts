const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const blockchainController = require('./controllers/blockchain.controller');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/blockchain', blockchainController);

app.listen(3000, () => {
  console.log('App listening on port 3000...');
});

export {};
