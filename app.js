const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const { getIdFromToken } = require('./controllers/auth');

// app.set('socketio', io);

const PORT = process.env.PORT || 8081;

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'image');
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString() + '-' + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.use(bodyParser.json());

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/image', express.static(path.join(__dirname, 'image')));

app.use(function (req, res, next) {
	req.headers.origin = req.headers.origin || req.headers.host;
	next();
});

app.use(cors());

let listOfUsers = [];

io.on('connection', function (socket) {
	const id = socket.handshake.query && getIdFromToken(socket.handshake.query.user);

	socket.emit('info', { message: 'Dobrodosli u Chat!', activeUsers: listOfUsers });

	const newUser = { user: id, id: socket.id };
	listOfUsers.push(newUser);

	socket.broadcast.emit('info', { message: 'Korisnik konektovan', activeUsers: listOfUsers });

	socket.on('message', (data) => {
		const findUser = listOfUsers.find((user) => user.user === data.to);
		if(findUser){
			io.to(findUser.id).emit('message', { message: data });
		}

	});

	socket.on('disconnect', () => {
		listOfUsers = listOfUsers.filter((user) => user.id !== socket.id);

		socket.broadcast.emit('info', { message: 'Korisnik je napustio kanal', activeUsers: listOfUsers });
	});
});

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);

app.use((error, req, res, next) => {
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status).json({ message: message, data: data });
});

mongoose.connect(
	process.env.MONGODB_URI ||
		'mongodb+srv://andrej213:0302972Andrejko@cluster0.v9ehc.mongodb.net/messenger?retryWrites=true&w=majority',
	{ useNewUrlParser: true, useUnifiedTopology: true }
);

const server = http.listen(PORT, () => {
	console.log('Server je pokrenut na PORTU: ', server.address().port);
});
