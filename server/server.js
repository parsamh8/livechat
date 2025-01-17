import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const PORT = 3000;
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Store usernames
const users = {};

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Save the user's name
  socket.on('set-name', (name) => {
    users[socket.id] = name;
    console.log(`User ${socket.id} set their name as ${name}`);
  });

  // Broadcast typing status
  socket.on('typing', (name) => {
    socket.broadcast.emit('user-typing', name);
  });

  // Broadcast stop typing status
  socket.on('stop-typing', () => {
    socket.broadcast.emit('user-stop-typing');
  });

  // Handle messages
  socket.on('message', (data) => {
    const { name, message } = data;

    if (name && message) {
      console.log(`Message from ${name}: ${message}`);

      // Broadcast message to all other users
      socket.broadcast.emit('recieve-message', { name, message });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    delete users[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});