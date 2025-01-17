const socket = io('https://livechat-xchl.onrender.com');

const form = document.getElementById('formform');
const messageInput = document.getElementById('message-input');
const messagesDiv = document.getElementById('messagesii');
let typingTimeout;

// Prompt the user for their name
const username = prompt('Enter your name:') || 'Anonymous';

// Notify the server of the user's name
socket.emit('set-name', username);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();

  if (message) {
    // Include the user's name with the message
    socket.emit('message', { name: username, message });
    displayMessage(`You: ${message}`); // Display the message locally
    messageInput.value = ""; // Clear the input
    socket.emit('stop-typing'); // Notify the server that typing has stopped
  }
});

// Notify server when user starts typing
messageInput.addEventListener('input', () => {
  socket.emit('typing', username);

  // Clear the typing timeout
  clearTimeout(typingTimeout);

  // Emit 'stop-typing' after 2 seconds of inactivity
  typingTimeout = setTimeout(() => {
    socket.emit('stop-typing');
  }, 2000);
});

// Function to display messages
function displayMessage(content) {
  const div = document.createElement('div');
  div.textContent = content;
  div.style = "margin-top: 10px";
  messagesDiv.append(div);
}

// Function to display typing indicator
function showTypingIndicator(name) {
  let typingDiv = document.getElementById('typing-indicator');
  if (!typingDiv) {
    typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.style = "font-style: italic; margin-top: 10px; color: gray;";
    messagesDiv.append(typingDiv);
  }
  typingDiv.textContent = `${name} is typing...`;
}

// Function to hide typing indicator
function hideTypingIndicator() {
  const typingDiv = document.getElementById('typing-indicator');
  if (typingDiv) {
    typingDiv.remove();
  }
}

// Listen for messages from other users
socket.on('recieve-message', (data) => {
  const { name, message } = data;
  displayMessage(`${name}: ${message}`);
});

// Listen for typing and stop-typing events
socket.on('user-typing', (name) => {
  showTypingIndicator(name);
});

socket.on('user-stop-typing', () => {
  hideTypingIndicator();
});
