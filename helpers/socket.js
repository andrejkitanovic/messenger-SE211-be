const { getIdFromToken } = require('../controllers/auth');

let listOfUsers = [];

const enterChatHandler = (socket) => {
	const id = socket.handshake.query && getIdFromToken(socket.handshake.query.user);

	const newUser = { user: id, id: socket.id };
	listOfUsers.push(newUser);

	socket.emit('info', { message: 'Dobrodosli u Chat!', activeUsers: listOfUsers });
	socket.broadcast.emit('info', { message: 'Korisnik konektovan', activeUsers: listOfUsers });

	socket.on('message', (data) => {
		const findUser = listOfUsers.find((user) => user.user === data.to);
		if (findUser) {
			io.to(findUser.id).emit('message', { message: data });
		}
	});
};

const messageHandler = (socket) => {
	socket.on('message', (data) => {
		const findUser = listOfUsers.find((user) => user.user === data.to);
		if (findUser) {
			io.to(findUser.id).emit('message', { message: data });
		}
	});
};

const disconnectHandler = (socket) => {
	socket.on('disconnect', () => {
		listOfUsers = listOfUsers.filter((user) => user.id !== socket.id);

		socket.broadcast.emit('info', { message: 'Korisnik je napustio kanal', activeUsers: listOfUsers });
	});
};

module.exports = (server) => {
	const io = require('socket.io')(server, { cors: true });

	io.on('connection', function (socket) {
		enterChatHandler(socket);
		messageHandler(socket);
		disconnectHandler(socket);
	});
};
