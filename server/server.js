import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const PORT = 3000;
const server = createServer(app);
const io = new Server(server);

// Serve static files (your client-side files)
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('message', (msg) => {
    console.log(`Message received: ${msg}`);
    // Send a reply back to the client
    socket.broadcast.emit('recieve-message', msg);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
