// Assuming socket.io.min.js is loaded via CDN, you don't need to import it anymore
const socket = io('http://localhost:3000'); // Make sure this matches the server URL

const form = document.getElementById('formform');
const messageInput = document.getElementById('message-input');
const roomInput = document.getElementById('room-input');
const messagesDiv = document.getElementById('messagesii');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = messageInput.value;
  
  socket.emit('message', message);  // Emit message to server
  displayMessage(message);  // Display the message locally
  messageInput.value = "";  // Clear the input
});

// Function to display message in the DOM
function displayMessage(message) {
  const div = document.createElement('div');
  div.textContent = message;
  messagesDiv.append(div);
}

// Listen for server's reply and display it
socket.on('reply', (data) => {
  console.log(`Server replied: ${data}`);
  displayMessage(data);  // Display server's reply
});

socket.on('connect', () => {
    displayMessage(`you connected with id: ${socket.id}`)
})
