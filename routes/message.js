const express = require('express');
const { body } = require('express-validator');

const Message = require('../models/message');
const messageController = require('../controllers/message');

const router = express.Router();

router.get('/', messageController.getMessages);
router.post('/', messageController.postMessage);

module.exports = router;
