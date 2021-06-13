const mongoose = require('mongoose');
const PORT = process.env.PORT || 8081;

module.exports = (app) => {
	mongoose.connect(
		process.env.MONGODB_URI ||
			'mongodb+srv://andrej213:0302972Andrejko@cluster0.v9ehc.mongodb.net/messenger?retryWrites=true&w=majority',
		{ useNewUrlParser: true, useUnifiedTopology: true }
	);

	const server = app.listen(PORT, () => {
		console.log('Server je pokrenut na PORTU: ', server.address().port);
	});

	return server;
};
