const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(cors());

require('./helpers/storage')(app, express);
require('./helpers/headers')(app);
require('./routes')(app);
require('./helpers/error')(app);

const server = require('./helpers/connection')(app);
require('./helpers/socket')(server);
