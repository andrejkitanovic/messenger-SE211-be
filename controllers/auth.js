const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getIdFromAuth = (req) => {
	let authorization = req.headers.authorization.split(' ')[1];
	let decoded;
	try {
		decoded = jwt.verify(authorization, 'se211');
	} catch (e) {
		return res.status(401).send('Niste autorizovani');
	}

	return decoded.id;
};

exports.getIdFromToken = (token) => {
	let decoded;
	try {
		decoded = jwt.verify(token, 'se211');
	} catch (e) {
		console.log('Not valid');
	}
	return decoded && decoded.id;
};

exports.getIdFromAuth = getIdFromAuth;

exports.getCurrentUser = (req, res, next) => {
	const id = getIdFromAuth(req);

	User.findById(id)
		.then((result) => {
			res.status(200).json({
				data: {
					firstname: result.firstname,
					lastname: result.lastname,
					username: result.username,
					email: result.email,
					createdAt: result.createdAt,
				},
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.login = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	let loadedUser;

	User.findOne({ $or: [{ email: email }, { username: email }] })
		.then((user) => {
			if (!user) {
				const error = new Error('Pogresno korisnicko ime!');
				error.statusCode = 404;

				throw error;
			}
			loadedUser = user;
			return bcrypt.compare(password, user.password);
		})
		.then((isEqual) => {
			if (!isEqual) {
				const error = new Error('Pogresna sifra!');
				error.statusCode = 401;
				throw error;
			}
			const token = jwt.sign({ id: loadedUser._id }, 'se211', {
				// expiresIn: "1h",
			});
			res.status(200).json({
				token: token,
				data: {
					id: loadedUser._id,
					firstname: loadedUser.firstname,
					lastname: loadedUser.lastname,
					username: loadedUser.username,
					email: loadedUser.email,
				},
				message: 'Uspesno logovanje!',
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.register = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const error = new Error('Validacija nije uspesna!');
		error.statusCode = 422;
		error.data = errors.array();
		throw error;
	}

	const firstname = req.body.firstname;
	const lastname = req.body.lastname;
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;

	bcrypt
		.hash(password, 12)
		.then((hashedPassword) => {
			const user = new User({
				firstname,
				lastname,
				username,
				email,
				password: hashedPassword,
			});
			return user.save();
		})
		.then((result) => {
			res.status(200).json({
				message: 'Korisnik registrovan!',
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};
