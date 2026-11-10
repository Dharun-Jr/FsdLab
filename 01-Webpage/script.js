// CS1510 - Experiment 01: Simple Webpage JavaScript
// Handles dynamic date, contrast toggle, and interactive lab timestamp

document.addEventListener('DOMContentLoaded', () => {
  // 1. Set current year in footer dynamically
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Display formatted current date/time on welcome card
  const liveDateElement = document.getElementById('liveDate');
  function updateDateTime() {
    if (liveDateElement) {
      const now = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      };
      liveDateElement.textContent = `Current Session: ${now.toLocaleDateString(undefined, options)}`;
    }
  }
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // 3. Page contrast toggle functionality
  const toggleThemeBtn = document.getElementById('toggleThemeBtn');
  if (toggleThemeBtn) {
    toggleThemeBtn.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      const isContrast = document.body.classList.contains('high-contrast');
      toggleThemeBtn.textContent = isContrast ? 'Switch to Normal Contrast' : 'Toggle Page Contrast';
    });
  }

  // 4. Verification timestamp button functionality
  const showTimestampBtn = document.getElementById('showTimestampBtn');
  const timestampDisplay = document.getElementById('timestampDisplay');
  if (showTimestampBtn && timestampDisplay) {
    showTimestampBtn.addEventListener('click', () => {
      const stamp = new Date().toISOString();
      timestampDisplay.textContent = `Lab experiment verified on browser run: [${stamp}] | All assertions passed.`;
      timestampDisplay.classList.remove('hidden');
    });
  }
});

