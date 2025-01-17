import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = 3000;

// Store user information
const users = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  const username = `User-${socket.id.substring(0, 4)}`;
  users[socket.id] = username;

  // socket.broadcast.emit('user-connected', username);

  socket.on('set-name', (name) => {
    users[socket.id] = name;
    io.emit('user-connected', name);
  });

  // Broadcast when a user is typing
  socket.on('typing', (name) => {
    socket.broadcast.emit('user-typing', name);
  });

  // Broadcast when a user stops typing
  socket.on('stop-typing', () => {
    socket.broadcast.emit('user-stop-typing');
  });

  socket.on('message', (data) => {
    const { name, message } = data;
    socket.broadcast.emit('recieve-message', { name, message });
  });

  socket.on('disconnect', () => {
    const name = users[socket.id] || `User-${socket.id.substring(0, 4)}`;
    delete users[socket.id];
    io.emit('user-disconnected', name);
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});