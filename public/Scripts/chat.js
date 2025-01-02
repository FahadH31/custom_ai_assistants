// Client-side error handling if on chatbot.html w/o having a created assistant active.
if (window.location.href.includes("chat.html")) {
  // Fetch the information from the server
  fetch('/api/checkAssistant')
    .then(response => response.json())
    .then(data => {
      if (!data.assistantExists) {
        alert("It seems you haven't created an assistant yet. We'll redirect you to the appropriate page now.");
        window.location.href = "../index.html"; // Redirect to index.html
      }
    })
    .catch(err => {
      console.error('Error fetching assistant status:', err);
    });
}

// Extract company name from URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const companyName = urlParams.get('companyName');
// Set the h1 title to the extracted company name
const companyNameTitle = document.getElementById('title');
if (companyName) {
  title.textContent = companyName + "'s AI Assistant";
}

// Display Assistant ID
document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/assistant-id')
    .then(response => response.json())
    .then(data => {
      const assistantIdElement = document.getElementById('assistant-id');
      assistantIdElement.textContent = `${data.assistantId}`;
    })
    .catch(error => console.error('Error fetching assistant ID:', error));
});

// Copy Assistant ID to Clipboard
function copyToClipboard() {
  const button = document.getElementById('copy-btn');
  const text = document.getElementById("assistant-id").innerText;
  navigator.clipboard.writeText(text).then(() => {
    // Change the tooltip to "Copied"
    button.setAttribute('data-tooltip', 'Copied!');

    // Reset tooltip text after 1 seconds
    setTimeout(() => {
      button.setAttribute('data-tooltip', 'Copy to Clipboard');
    }, 1000);
  });
}

// For Clearing Server Variables
window.addEventListener('beforeunload', function (event) {
  event.preventDefault();
  // Send a signal to the server when the page is unloaded
  fetch('/clearData', { method: 'POST' });
  return (event.returnValue = "");
});

// Allow for message to be submitted with enter key.
document.getElementById('user-input').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

async function sendMessage() {
  const userInput = document.getElementById('user-input').value.trim();
  if (!userInput) return; // Exit if empty

  appendMessage(userInput, 'user'); // Display the user message
  document.getElementById('user-input').value = ''; // Clear Input Field

  // Visual loading bubble for while the assistant response is loading 
  const loadingId = appendMessage('...', 'loading');

  try {
    document.getElementById('user-input').disabled = true;
    document.getElementById('send-btn').disabled = true;
    document.getElementById('expand-btn').disabled = true;

    const response = await fetch('/getResponse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const responseData = await response.json();

    // To replace loading bubble with the server response
    updateLoadingMessage(loadingId, responseData.message, 'server');

    document.getElementById('user-input').disabled = false;
    document.getElementById('send-btn').disabled = false;
    document.getElementById('expand-btn').disabled = false;
  } catch (error) {
    console.error('Error sending message:', error);
    updateLoadingMessage(loadingId, 'Error occurred. Please try again.', 'server');
  }
}

// Responsible for displaying messages on the screen.
function appendMessage(message, sender) {

  const chatContainer = document.getElementById('chat-container');

  const messageContainer = document.createElement('div');
  messageContainer.className = 'message-container';

  const messageDiv = document.createElement('div');
  messageDiv.className = 'message';
  messageDiv.textContent = message;

  const profileImg = document.createElement('img');
  profileImg.className = 'profile-image';

  if (sender === 'user') {
    profileImg.src = '../Images/user-image.png';
    messageDiv.classList.add('user-message');
  } else if (sender === 'server') {
    profileImg.src = '../Images/assistant-image.png';
    messageDiv.classList.add('assistant-message');
  } else if (sender === 'loading') {
    profileImg.src = '../Images/assistant-image.png';
    messageDiv.classList.add('loading-message');
  }

  if (sender === 'user') {
    messageContainer.appendChild(messageDiv);
    messageContainer.appendChild(profileImg);
  } else {
    messageContainer.appendChild(profileImg);
    messageContainer.appendChild(messageDiv);
  }

  chatContainer.appendChild(messageContainer);
  chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom

  // Return the message container for updates
  return messageContainer;
}

function updateLoadingMessage(loadingContainer, message, sender) {
  const messageDiv = loadingContainer.querySelector('.message');

  // For displaying code blocks 
  const codeBlockPattern = /```(\w*)\s*([\s\S]*?)```/g;

  const formattedMessage = message.replace(codeBlockPattern, (match, lang, code) => {
    const highlightedCode = `<code class="language-${lang}">${escapeHtml(code)}</code>`;
    return `<pre>${highlightedCode}</pre>`;
  });

  messageDiv.innerHTML = formattedMessage // Update the message content

  if (sender === 'server') {
    messageDiv.classList.remove('loading-message');
    messageDiv.classList.add('assistant-message');
  }
}

// Escape HTML when displaying code blocks
function escapeHtml(input) {
  const str = String(input);
  return str.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Expand Input Button
document.getElementById("expand-btn").addEventListener("click", function () {
  const userInput = document.getElementById("user-input").value;
  document.getElementById("textarea-input").value = userInput;      // Sync input to textarea
  document.getElementById("textarea-modal").classList.add('show');  // Show modal with fade-in
  document.getElementById("modal-backdrop").classList.add('show');  // Show backdrop with fade-in
});

// Close Modal Button
document.getElementById("modal-close-btn").addEventListener("click", function () {
  const expandedInput = document.getElementById("textarea-input").value;
  document.getElementById("user-input").value = expandedInput;    // Sync textarea back to input
  document.getElementById("textarea-modal").classList.remove('show');
  document.getElementById("modal-backdrop").classList.remove('show');
});

document.getElementById("modal-backdrop").addEventListener("click", function () {
  document.getElementById("modal-close-btn").click();
});





