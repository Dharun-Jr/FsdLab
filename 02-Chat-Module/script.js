// CS1510 - Experiment 02: Chat Module JavaScript

const STORAGE_KEY = 'cs1510_chat_history';

const chatBody = document.getElementById('chatBody');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const clearChatBtn = document.getElementById('clearChatBtn');
const promptChips = document.querySelectorAll('.chip');

// Predefined replies
const PREDEFINED_RESPONSES = [
  {
    triggers: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
    reply: "Hello! How can I assist you with your lab queries?"
  },
  {
    triggers: ['how are you', 'how are you doing'],
    reply: "I am functioning properly and ready to help. How are you?"
  },
  {
    triggers: ['bye', 'goodbye', 'exit'],
    reply: "Goodbye! Have a productive lab session."
  },
  {
    triggers: ['what is cs1510', 'cs1510'],
    reply: "CS1510 is the Full Stack Development Laboratory covering HTML, CSS, JavaScript, and client-side web development."
  },
  {
    triggers: ['what time is it', 'time', 'date'],
    reply: () => `Current browser time is ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}.`
  },
  {
    triggers: ['help'],
    reply: "Available commands: 'hello', 'how are you', 'what is cs1510', 'time', or 'bye'."
  }
];

const FALLBACK_RESPONSE = "I did not understand that. You can try typing: 'hello', 'how are you', 'what is cs1510', or 'bye'.";

function loadChatHistory() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return [
    {
      sender: 'bot',
      text: "Hello! Ask me queries like 'hello', 'how are you', 'what is cs1510', or 'bye'.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];
}

let chatHistory = loadChatHistory();

function saveChatHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
}

function renderMessages() {
  chatBody.innerHTML = '';
  chatHistory.forEach(msg => {
    const row = document.createElement('div');
    row.className = `message-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`;

    const bubble = document.createElement('div');
    bubble.className = `bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`;
    bubble.textContent = msg.text;

    const time = document.createElement('div');
    time.className = 'timestamp';
    time.textContent = `${msg.sender === 'user' ? 'You' : 'Bot'} | ${msg.timestamp}`;

    row.appendChild(bubble);
    row.appendChild(time);
    chatBody.appendChild(row);
  });
  chatBody.scrollTop = chatBody.scrollHeight;
}

function getBotResponse(userText) {
  const clean = userText.trim().toLowerCase().replace(/[?!.,]/g, '');
  for (const item of PREDEFINED_RESPONSES) {
    for (const trigger of item.triggers) {
      if (clean === trigger || clean.includes(trigger)) {
        if (typeof item.reply === 'function') {
          return item.reply();
        }
        return item.reply;
      }
    }
  }
  return FALLBACK_RESPONSE;
}

function sendMessage(text) {
  if (!text || !text.trim()) return;
  const userText = text.trim();
  const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  chatHistory.push({
    sender: 'user',
    text: userText,
    timestamp: timeNow
  });
  renderMessages();
  saveChatHistory();

  userInput.value = '';
  userInput.focus();

  setTimeout(() => {
    const botReply = getBotResponse(userText);
    chatHistory.push({
      sender: 'bot',
      text: botReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    renderMessages();
    saveChatHistory();
  }, 300);
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage(userInput.value);
});

clearChatBtn.addEventListener('click', () => {
  if (confirm('Clear chat history?')) {
    chatHistory = [
      {
        sender: 'bot',
        text: "Chat cleared. How can I help you?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    saveChatHistory();
    renderMessages();
  }
});

promptChips.forEach(chip => {
  chip.addEventListener('click', () => {
    sendMessage(chip.getAttribute('data-msg'));
  });
});

renderMessages();
