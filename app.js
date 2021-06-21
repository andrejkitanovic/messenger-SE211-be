const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(cors());

require('./helpers/storage')(app, express);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
require('./helpers/headers')(app);
require('./routes')(app);
require('./helpers/error')(app);

const server = require('./helpers/connection')(app);
require('./helpers/socket')(server);
