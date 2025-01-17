const socket = io('https://livechat-xchl.onrender.com');
const form = document.getElementById('formform');
const messageInput = document.getElementById('message-input');
const messagesDiv = document.getElementById('messagesii');
let typingTimeout;

const username = prompt('Enter your name:') || 'Anonymous';
socket.emit('set-name', username);

// Handle form submission
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();

  if (message) {
    socket.emit('message', { name: username, message });
    displayMessage(`You: ${message}`);
    messageInput.value = '';
    socket.emit('stop-typing'); // Notify the server typing has stopped
  }
});

// Notify server when the user starts typing
messageInput.addEventListener('input', () => {
  socket.emit('typing', username);

  // Clear existing typing timeout
  clearTimeout(typingTimeout);

  // Stop typing after 2 seconds of inactivity
  typingTimeout = setTimeout(() => {
    socket.emit('stop-typing');
  }, 3000);
});

// Display a message
function displayMessage(content) {
  const div = document.createElement('div');
  div.textContent = content;
  div.style.marginTop = '10px';
  messagesDiv.appendChild(div);
}

// Handle user connection and disconnection
socket.on('user-connected', (name) => {
  displayMessage(`${name} has joined the chat.`);
});

socket.on('user-disconnected', (name) => {
  displayMessage(`${name} has left the chat.`);
});

// Handle incoming messages
socket.on('recieve-message', ({ name, message }) => {
  displayMessage(`${name}: ${message}`);
});

// Handle typing indicator
socket.on('user-typing', (name) => {
  showTypingIndicator(name);
});

socket.on('user-stop-typing', () => {
  hideTypingIndicator();
});

// Typing indicator logic
function showTypingIndicator(name) {
  let typingDiv = document.getElementById('typing-indicator');
  if (!typingDiv) {
    typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.style = 'font-style: italic; margin-top: 10px; color: gray;';
    messagesDiv.appendChild(typingDiv);
  }
  typingDiv.textContent = `${name} is typing...`;
}

function hideTypingIndicator() {
  const typingDiv = document.getElementById('typing-indicator');
  if (typingDiv) {
    typingDiv.remove();
  }
}
