module.exports = (app) => {
    const authRoutes = require('./auth');
    const userRoutes = require('./user');
    const messageRoutes = require('./message');
    
    app.use('/api/auth', authRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/message', messageRoutes);
}