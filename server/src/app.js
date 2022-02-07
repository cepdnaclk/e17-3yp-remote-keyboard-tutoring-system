// imports dependencies
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app =  express();
const http = require('http');
const { addUser, removeUser, getUser, getUsersInRoom, getUserByName } = require('./services/users');

// http server creation
const server = http.createServer(app);
const io = require('socket.io')(server);

dotenv.config();    // configures dotenv

// imports routers
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const studentRoute = require('./routes/studentRoute');
const tutorRoute = require('./routes/tutorRoute');
const courseRoute = require('./routes/courseRoute');
const classRoute = require('./routes/classRoute');

// TODO: Remove as a global variable. Put separate variables for each room (Create a mongoose model for classes).
var raisedUsers = {};

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if(error) return callback(error);

        socket.join(user.room);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the ${user.room}.`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    });

    socket.on('raiseHand', ({raiseHand, name}) => {
        const user = getUserByName(name.trim().toLowerCase());
        if (raiseHand) raisedUsers[`${name}`] = name;
        else delete raisedUsers[`${name}`];
        io.to(user.room).emit('raiseHandBroadCast', raisedUsers);
        //   console.log(name, raiseHand)
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        console.log('User got disconnected');

        if(user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
    })
});

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/student', studentRoute);
app.use('/tutor', tutorRoute);
app.use('/course', courseRoute);
app.use('/class', classRoute);

server.listen(process.env.API_PORT, async () => {
    console.log(`Server is up and running on port ${process.env.API_PORT}`);
    await mongoose.connect(process.env.dbURI, { useNewUrlParser : true, useUnifiedTopology : true})
    .then((result) => {
        console.log('connected to data base');
    })
})