const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const userController = require('../controllers/user');

const router = express.Router();

router.get('/', userController.getUsers);

module.exports = router;
