const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const blockchainController = require('./controllers/networkNodes.controller');

const port = process.argv[2];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/blockchain', blockchainController);

app.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});

export {};
