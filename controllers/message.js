// const { validationResult } = require('express-validator');
const { getIdFromAuth } = require('./auth');
const Message = require('../models/message');

exports.getMessages = (req, res, next) => {
	const id = getIdFromAuth(req);
	const { user } = req.query;

	Message.find({
		$or: [
			{ from: id, to: user },
			{ from: user, to: id },
		],
	})
		.then((result) => {
			res.status(200).json({
				data: result,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.postMessage = (req, res, next) => {
	const id = getIdFromAuth(req);
	const { user } = req.query;

	const { message } = req.body;

	const messageObj = new Message({
		from:id,
		to:user,
		message,
	});

	messageObj.save()
		.then((result) => {
			res.status(200).json({
				data: result,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};
