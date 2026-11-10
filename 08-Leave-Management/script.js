// CS1510 - Experiment 08: Leave Management System JavaScript
// Handles employee auth, quota balance calculation, date math, validation, and request cancellation

const STORAGE_USERS = 'cs1510_leave_users';
const STORAGE_CURRENT_EMP = 'cs1510_leave_current_emp';
const DEFAULT_CASUAL_QUOTA = 12;
const DEFAULT_MEDICAL_QUOTA = 10;

// State
let currentEmpId = null;
let currentLeaveData = null;

// DOM Elements - Auth
const authModal = document.getElementById('authModal');
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authAlert = document.getElementById('authAlert');
const empIdInput = document.getElementById('empIdInput');
const empPassInput = document.getElementById('empPassInput');
const regEmpId = document.getElementById('regEmpId');
const regName = document.getElementById('regName');
const regPass = document.getElementById('regPass');
const demoBtns = document.querySelectorAll('.demo-btn');

// DOM Elements - Shell
const appPortal = document.getElementById('appPortal');
const displayEmpName = document.getElementById('displayEmpName');
const displayEmpId = document.getElementById('displayEmpId');
const logoutBtn = document.getElementById('logoutBtn');

// DOM Elements - Quota & Cards
const casualBalance = document.getElementById('casualBalance');
const casualProgress = document.getElementById('casualProgress');
const medicalBalance = document.getElementById('medicalBalance');
const medicalProgress = document.getElementById('medicalProgress');
const totalConsumed = document.getElementById('totalConsumed');
const requestsCount = document.getElementById('requestsCount');

// DOM Elements - Form
const leaveApplicationForm = document.getElementById('leaveApplicationForm');
const leaveTypeSelect = document.getElementById('leaveType');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const durationDisplay = document.getElementById('durationDisplay');
const leaveReasonInput = document.getElementById('leaveReason');
const formAlert = document.getElementById('formAlert');
const leaveRequestsTableBody = document.getElementById('leaveRequestsTableBody');

// 1. Data Initialization & Storage Helpers
function getUsers() {
  const users = localStorage.getItem(STORAGE_USERS);
  if (!users) {
    const defaultUsers = {
      'emp101': { name: 'Dr. Alice Adams', pass: '123456' },
      'emp102': { name: 'Prof. Robert Vance', pass: '123456' }
    };
    localStorage.setItem(STORAGE_USERS, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(users);
}

function getEmployeeDataKey() {
  return `cs1510_leave_data_${currentEmpId}`;
}

function loadEmployeeLeaveData() {
  const saved = localStorage.getItem(getEmployeeDataKey());
  if (saved) {
    currentLeaveData = JSON.parse(saved);
  } else {
    // Initial Quota and empty requests
    currentLeaveData = {
      casualQuota: DEFAULT_CASUAL_QUOTA,
      casualUsed: 0,
      medicalQuota: DEFAULT_MEDICAL_QUOTA,
      medicalUsed: 0,
      requests: []
    };
    saveEmployeeLeaveData();
  }
  updateUI();
}

function saveEmployeeLeaveData() {
  localStorage.setItem(getEmployeeDataKey(), JSON.stringify(currentLeaveData));
}

// 2. Auth Handlers
function showAuthAlert(msg, type = 'error') {
  authAlert.textContent = msg;
  authAlert.className = `alert ${type}`;
  authAlert.classList.remove('hidden');
}

tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('active');
  tabRegister.classList.remove('active');
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  authAlert.classList.add('hidden');
});

tabRegister.addEventListener('click', () => {
  tabRegister.classList.add('active');
  tabLogin.classList.remove('active');
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  authAlert.classList.add('hidden');
});

demoBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    empIdInput.value = btn.dataset.u;
    empPassInput.value = btn.dataset.p;
  });
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = empIdInput.value.trim().toLowerCase();
  const pass = empPassInput.value;
  const users = getUsers();

  if (users[id] && users[id].pass === pass) {
    loginEmployee(id, users[id].name);
  } else {
    showAuthAlert('Invalid Employee credentials. Demo user: "emp101" / "123456".');
  }
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = regEmpId.value.trim().toLowerCase();
  const name = regName.value.trim();
  const pass = regPass.value;
  const users = getUsers();

  if (users[id]) {
    showAuthAlert('Employee ID already registered.');
    return;
  }
  if (pass.length < 4) {
    showAuthAlert('Password must be at least 4 characters.');
    return;
  }

  users[id] = { name: name || 'Faculty Member', pass };
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  showAuthAlert('Employee registration successful! Logging in...', 'success');
  setTimeout(() => loginEmployee(id, users[id].name), 600);
});

function loginEmployee(id, name) {
  currentEmpId = id;
  localStorage.setItem(STORAGE_CURRENT_EMP, id);
  authModal.classList.add('hidden');
  appPortal.classList.remove('hidden');
  displayEmpId.textContent = id.toUpperCase();
  displayEmpName.textContent = name;
  setupDateDefaults();
  loadEmployeeLeaveData();
}

function logoutEmployee() {
  currentEmpId = null;
  localStorage.removeItem(STORAGE_CURRENT_EMP);
  appPortal.classList.add('hidden');
  authModal.classList.remove('hidden');
  empPassInput.value = '';
}

logoutBtn.addEventListener('click', logoutEmployee);

// 3. Date Maths & Calculations
function setupDateDefaults() {
  const today = new Date().toISOString().split('T')[0];
  startDateInput.value = today;
  startDateInput.min = today;
  endDateInput.value = today;
  endDateInput.min = today;
  calculateDuration();
}

function calculateDuration() {
  const startVal = startDateInput.value;
  const endVal = endDateInput.value;

  if (!startVal || !endVal) return 0;

  const start = new Date(startVal);
  const end = new Date(endVal);

  if (end < start) {
    durationDisplay.textContent = 'Invalid date range (End date before Start date)';
    durationDisplay.style.color = '#dc2626';
    return -1;
  }

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24)) + 1;

  durationDisplay.textContent = `${diffDays} Day(s)`;
  durationDisplay.style.color = '#166534';
  return diffDays;
}

startDateInput.addEventListener('change', () => {
  if (endDateInput.value < startDateInput.value) {
    endDateInput.value = startDateInput.value;
  }
  endDateInput.min = startDateInput.value;
  calculateDuration();
});

endDateInput.addEventListener('change', calculateDuration);

// 4. Update UI: Balances, Progress bars & History Table
function updateUI() {
  if (!currentLeaveData) return;

  const casualRem = currentLeaveData.casualQuota - currentLeaveData.casualUsed;
  const medicalRem = currentLeaveData.medicalQuota - currentLeaveData.medicalUsed;
  const totalUsed = currentLeaveData.casualUsed + currentLeaveData.medicalUsed;

  casualBalance.textContent = casualRem;
  casualProgress.style.width = `${(casualRem / currentLeaveData.casualQuota) * 100}%`;

  medicalBalance.textContent = medicalRem;
  medicalProgress.style.width = `${(medicalRem / currentLeaveData.medicalQuota) * 100}%`;

  totalConsumed.textContent = totalUsed;
  requestsCount.textContent = `${currentLeaveData.requests.length} Application(s) Logged`;

  renderRequestsTable();
}

function renderRequestsTable() {
  leaveRequestsTableBody.innerHTML = '';

  if (currentLeaveData.requests.length === 0) {
    leaveRequestsTableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: #94a3b8; padding: 2rem;">
          No leave applications filed yet. Fill the form above to apply.
        </td>
      </tr>
    `;
    return;
  }

  currentLeaveData.requests.forEach(req => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${req.id}</strong></td>
      <td>${req.type}</td>
      <td>${req.startDate} to ${req.endDate}</td>
      <td><strong>${req.days}</strong></td>
      <td>${req.reason}</td>
      <td>
        <span class="status-badge ${req.status.toLowerCase()}">${req.status}</span>
      </td>
      <td>
        ${req.status === 'Approved' ? `
          <button class="cancel-action-btn" data-id="${req.id}">Cancel &amp; Refund</button>
        ` : `
          <span style="color:#94a3b8; font-size:0.8rem;">N/A</span>
        `}
      </td>
    `;

    const cancelBtn = tr.querySelector('.cancel-action-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => cancelLeaveRequest(req.id));
    }

    leaveRequestsTableBody.appendChild(tr);
  });
}

// 5. Apply for Leave with Validations
leaveApplicationForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formAlert.classList.add('hidden');

  const type = leaveTypeSelect.value;
  const days = calculateDuration();

  // Validate range
  if (days <= 0) {
    showFormAlert('Invalid Date Range: End date must be on or after start date.');
    return;
  }

  // Check quota balance
  const casualRem = currentLeaveData.casualQuota - currentLeaveData.casualUsed;
  const medicalRem = currentLeaveData.medicalQuota - currentLeaveData.medicalUsed;

  if (type === 'Casual Leave') {
    if (days > casualRem) {
      showFormAlert(`Quota Exceeded: Requested ${days} day(s), but only ${casualRem} Casual Leave day(s) remain.`);
      return;
    }
    currentLeaveData.casualUsed += days;
  } else if (type === 'Medical Leave') {
    if (days > medicalRem) {
      showFormAlert(`Quota Exceeded: Requested ${days} day(s), but only ${medicalRem} Medical Leave day(s) remain.`);
      return;
    }
    currentLeaveData.medicalUsed += days;
  }

  // Record approved request
  const newReq = {
    id: `LEV-${Math.floor(1000 + Math.random() * 9000)}`,
    type: type,
    startDate: startDateInput.value,
    endDate: endDateInput.value,
    days: days,
    reason: leaveReasonInput.value.trim(),
    status: 'Approved',
    appliedAt: new Date().toLocaleDateString()
  };

  currentLeaveData.requests.unshift(newReq);
  saveEmployeeLeaveData();
  updateUI();

  showFormAlert(`Success! Application ${newReq.id} approved for ${days} day(s).`, 'success');
  leaveReasonInput.value = '';
});

function showFormAlert(msg, type = 'error') {
  formAlert.textContent = msg;
  formAlert.className = `alert ${type}`;
  formAlert.classList.remove('hidden');
}

// 6. Cancel Request and Refund Quota
function cancelLeaveRequest(reqId) {
  const req = currentLeaveData.requests.find(r => r.id === reqId);
  if (!req || req.status !== 'Approved') return;

  if (confirm(`Are you sure you want to cancel request ${reqId}? ${req.days} day(s) will be refunded to your ${req.type} quota.`)) {
    req.status = 'Cancelled';

    if (req.type === 'Casual Leave') {
      currentLeaveData.casualUsed = Math.max(0, currentLeaveData.casualUsed - req.days);
    } else if (req.type === 'Medical Leave') {
      currentLeaveData.medicalUsed = Math.max(0, currentLeaveData.medicalUsed - req.days);
    }

    saveEmployeeLeaveData();
    updateUI();
    showFormAlert(`Request ${reqId} has been cancelled and ${req.days} day(s) refunded to your balance.`, 'success');
  }
}

// Startup Check
getUsers();
const existingSession = localStorage.getItem(STORAGE_CURRENT_EMP);
if (existingSession && getUsers()[existingSession]) {
  loginEmployee(existingSession, getUsers()[existingSession].name);
}

