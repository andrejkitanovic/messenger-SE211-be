const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const userController = require('../controllers/auth');

const router = express.Router();

router.get('/me', userController.getCurrentUser);
router.post('/login', userController.login);
router.post(
	'/register',
	[
		body('email')
			.isEmail()
			.withMessage('Molimo unesite tacnu email adresu!')
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then((userDoc) => {
					if (userDoc) {
						return Promise.reject('Email adresa se vec koristi!');
					}
				});
			}),
		body('username')
			.trim()
			.custom((value, { req }) => {
				return User.findOne({ name: value }).then((userDoc) => {
					if (userDoc) {
						return Promise.reject('Korisnicko ime se vec koristi!');
					}
				});
			}),
		body('password').trim().isLength({ min: 3 }),
	],
	userController.register
);

module.exports = router;
