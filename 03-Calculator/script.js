// CS1510 - Experiment 03: Arithmetic Calculator JavaScript
// Implements two-operand arithmetic, input validation, division-by-zero check, and history logging

const STORAGE_KEY = 'cs1510_calc_history';

// DOM Elements
const num1Input = document.getElementById('num1');
const num2Input = document.getElementById('num2');
const resultBox = document.getElementById('resultBox');
const resultDisplay = document.getElementById('resultDisplay');
const resetBtn = document.getElementById('resetBtn');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const opButtons = document.querySelectorAll('.op-btn');

// Load history from localStorage
function loadHistory() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error loading calculation history:", e);
    }
  }
  return [];
}

let historyData = loadHistory();

// Save history to localStorage
function saveHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(historyData));
}

// Render history records
function renderHistory() {
  historyList.innerHTML = '';
  if (historyData.length === 0) {
    historyList.innerHTML = '<li class="empty-history">No calculations performed yet.</li>';
    return;
  }

  // Show up to 10 latest calculations
  historyData.slice(-10).reverse().forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${item.expr}</span> <strong>= ${item.res}</strong>`;
    historyList.appendChild(li);
  });
}

// Set status display
function showResult(text, isError = false) {
  resultDisplay.textContent = text;
  resultBox.className = 'result-box';
  if (isError) {
    resultBox.classList.add('error');
  } else {
    resultBox.classList.add('success');
  }
}

// Format number nicely to avoid IEEE 754 precision issues like 0.30000000000000004
function formatNumber(num) {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  // Round to max 6 decimal places and strip trailing zeros
  return parseFloat(num.toFixed(6)).toString();
}

// Perform calculation
function calculate(operation) {
  const val1Str = num1Input.value.trim();
  const val2Str = num2Input.value.trim();

  // 1. Validation: Check if inputs are provided
  if (val1Str === '' || val2Str === '') {
    showResult('Error: Both Operand 1 and Operand 2 are required.', true);
    return;
  }

  const n1 = Number(val1Str);
  const n2 = Number(val2Str);

  // 2. Validation: Check if inputs are valid numbers
  if (isNaN(n1) || isNaN(n2)) {
    showResult('Error: Please enter valid numeric values.', true);
    return;
  }

  let result = 0;
  let symbol = '';

  switch (operation) {
    case 'add':
      result = n1 + n2;
      symbol = '+';
      break;

    case 'subtract':
      result = n1 - n2;
      symbol = '-';
      break;

    case 'multiply':
      result = n1 * n2;
      symbol = '×';
      break;

    case 'divide':
      // 3. Validation: Prevent division by zero
      if (n2 === 0) {
        showResult('Error: Division by zero is undefined.', true);
        return;
      }
      result = n1 / n2;
      symbol = '÷';
      break;

    default:
      showResult('Error: Unknown arithmetic operation.', true);
      return;
  }

  const formattedResult = formatNumber(result);
  const expression = `${formatNumber(n1)} ${symbol} ${formatNumber(n2)}`;

  // Display result
  showResult(`${expression} = ${formattedResult}`, false);

  // Record history
  historyData.push({
    expr: expression,
    res: formattedResult,
    timestamp: new Date().toLocaleTimeString()
  });
  saveHistory();
  renderHistory();
}

// Event Listeners for Operations
opButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const op = btn.getAttribute('data-op');
    calculate(op);
  });
});

// Reset fields
resetBtn.addEventListener('click', () => {
  num1Input.value = '';
  num2Input.value = '';
  resultBox.className = 'result-box';
  resultDisplay.textContent = 'Enter numbers and select an operation';
  num1Input.focus();
});

// Clear History
clearHistoryBtn.addEventListener('click', () => {
  if (historyData.length > 0 && confirm('Clear calculation history?')) {
    historyData = [];
    saveHistory();
    renderHistory();
  }
});

// Allow Enter key to trigger default add or repeat
[num1Input, num2Input].forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      calculate('add');
    }
  });
});

// Initial History Render
renderHistory();

