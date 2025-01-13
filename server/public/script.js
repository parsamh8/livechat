// Assuming socket.io.min.js is loaded via CDN, you don't need to import it anymore
const socket = io('https://livechat-xchl.onrender.com');

const form = document.getElementById('formform');
const messageInput = document.getElementById('message-input');
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
  div.style = "margin-top: 10px"
  messagesDiv.append(div);
}

// Listen for server's reply and display it
socket.on('recieve-message', (messenger) => {
  displayMessage(messenger);  // Display server's reply
});

socket.on('connect', () => {
    displayMessage('Welcome to Cloud Room');
    displayMessage(`You connected with id: ${socket.id};`)
})
