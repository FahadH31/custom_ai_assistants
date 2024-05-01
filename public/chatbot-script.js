// Allow for message to be submitted with enter key.
document.getElementById('userInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
  // Remove whitespace from user input.
  const userInput = document.getElementById('userInput').value.trim();
  if (!userInput) return; // Exit if empty

  appendMessage(userInput, 'user'); // Display the user message
  document.getElementById('userInput').value = ''; // Clear Input Field


}

// Responsible for displaying messages on the screen.
function appendMessage(message, sender) {
    const chatContainer = document.getElementById('chatContainer');
    
    // Create a div called messageContainer
    const messageContainer = document.createElement('div');
    // Assign it the same class name.
    messageContainer.className = 'message-container';
    
    // Set text content of messageDiv to be the one obtained from the parameter.
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = message;
  
    // Create respective profile img elements for each message based on sender.
    const profileImg = document.createElement('img');
    profileImg.className = 'profile-image';
    if (sender === 'user') {
      profileImg.src = 'Images/user-image.png';
      messageDiv.classList.add('user-message');
    } else {
      profileImg.src = 'Images/bot-image.png'; 
      messageDiv.classList.add('bot-message');
    }
  
    // Ensure correct display for each sender 
    // (pic and message positioning)
    if (sender === 'user') {
      messageContainer.appendChild(messageDiv);
      messageContainer.appendChild(profileImg);
    } else {
      messageContainer.appendChild(profileImg);
      messageContainer.appendChild(messageDiv);
    }
  
    // Append message container to chat container
    chatContainer.appendChild(messageContainer);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom
  }
  

  