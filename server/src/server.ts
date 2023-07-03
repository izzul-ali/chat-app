import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import auth from './routes/auth-route';
import userRoute from './routes/user-route';
import messageRoute from './routes/message-route';
import SocketController from './socket';
import { Server } from 'socket.io';

const client = process.env.CLIENT_ORIGIN;

const app = express();

// middleware
app.use(
  cors({
    origin: client,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use('/api/auth', auth);
app.use('/api/users', userRoute);
app.use('/api/messages', messageRoute);
app.use('/resource/', express.static('resource/images'));

// server
const server = http.createServer(app);

// socket
const io = new Server(server, {
  addTrailingSlash: false,
  cors: {
    origin: client,
  },
});

const socketController = new SocketController(io);

// running websocket
socketController.run();

server.listen(8080, 'localhost', () => {
  console.log(`server running on ${process.env.APP_DOMAIN}`);
});
