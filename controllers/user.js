const { getIdFromAuth } = require('./auth');
const User = require('../models/user');

exports.getUsers = (req, res, next) => {
	const id = getIdFromAuth(req);

	User.find({ _id: { $ne: id } }, { firstname: true, lastname: true, username: true, email: true })
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
