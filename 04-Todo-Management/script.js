// CS1510 - Experiment 04: Todo Management JavaScript
// Implements user auth, separate localStorage per user, CRUD tasks, filtering & counters

const USERS_KEY = 'cs1510_todo_users';
const CURRENT_USER_KEY = 'cs1510_todo_current_user';

// DOM Elements - Auth
const authSection = document.getElementById('authSection');
const todoSection = document.getElementById('todoSection');
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authAlert = document.getElementById('authAlert');
const loginUsernameInput = document.getElementById('loginUsername');
const loginPasswordInput = document.getElementById('loginPassword');
const regUsernameInput = document.getElementById('regUsername');
const regPasswordInput = document.getElementById('regPassword');
const demoBtns = document.querySelectorAll('.demo-btn');

// DOM Elements - Todo Workspace
const currentUserDisplay = document.getElementById('currentUserDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const totalCount = document.getElementById('totalCount');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');
const addTaskForm = document.getElementById('addTaskForm');
const taskTitleInput = document.getElementById('taskTitleInput');
const taskPrioritySelect = document.getElementById('taskPrioritySelect');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

let currentFilter = 'all';
let currentUser = null;
let currentTasks = [];

// Seed default users if none exist
function initUsers() {
  const users = localStorage.getItem(USERS_KEY);
  if (!users) {
    const defaultUsers = {
      'student1': '123456',
      'student2': '123456'
    };
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));

    // Seed some initial tasks for student1
    const student1Tasks = [
      { id: '1', title: 'Complete CS1510 Lab Experiment 01', priority: 'High', completed: true, createdAt: '09:00 AM' },
      { id: '2', title: 'Design Chat Module responsive interface', priority: 'Normal', completed: true, createdAt: '09:30 AM' },
      { id: '3', title: 'Implement arithmetic calculator validation', priority: 'Normal', completed: false, createdAt: '10:00 AM' },
      { id: '4', title: 'Review JavaScript localStorage APIs', priority: 'Low', completed: false, createdAt: '10:30 AM' }
    ];
    localStorage.setItem('cs1510_tasks_student1', JSON.stringify(student1Tasks));
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
}

function setAlert(msg, type = 'error') {
  authAlert.textContent = msg;
  authAlert.className = `alert ${type}`;
  authAlert.classList.remove('hidden');
}

function clearAlert() {
  authAlert.classList.add('hidden');
  authAlert.textContent = '';
}

// User Authentication Handlers
tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('active');
  tabRegister.classList.remove('active');
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  clearAlert();
});

tabRegister.addEventListener('click', () => {
  tabRegister.classList.add('active');
  tabLogin.classList.remove('active');
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  clearAlert();
});

demoBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    loginUsernameInput.value = btn.getAttribute('data-user');
    loginPasswordInput.value = btn.getAttribute('data-pass');
  });
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = loginUsernameInput.value.trim().toLowerCase();
  const password = loginPasswordInput.value;
  const users = getUsers();

  if (users[username] && users[username] === password) {
    loginUser(username);
  } else {
    setAlert('Invalid username or password. Try demo user "student1" (pwd: 123456).');
  }
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = regUsernameInput.value.trim().toLowerCase();
  const password = regPasswordInput.value;
  const users = getUsers();

  if (users[username]) {
    setAlert('Username is already registered. Please choose another.');
    return;
  }
  if (password.length < 4) {
    setAlert('Password must be at least 4 characters long.');
    return;
  }

  users[username] = password;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  setAlert('Account created successfully! Please sign in.', 'success');
  tabLogin.click();
  loginUsernameInput.value = username;
  loginPasswordInput.value = '';
});

function loginUser(username) {
  currentUser = username;
  localStorage.setItem(CURRENT_USER_KEY, username);
  authSection.classList.add('hidden');
  todoSection.classList.remove('hidden');
  currentUserDisplay.textContent = username;
  loadTasksForUser();
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem(CURRENT_USER_KEY);
  todoSection.classList.add('hidden');
  authSection.classList.remove('hidden');
  loginPasswordInput.value = '';
  clearAlert();
}

logoutBtn.addEventListener('click', logoutUser);

// Task Management functions
function getTaskStorageKey() {
  return `cs1510_tasks_${currentUser}`;
}

function loadTasksForUser() {
  const saved = localStorage.getItem(getTaskStorageKey());
  currentTasks = saved ? JSON.parse(saved) : [];
  renderTasks();
}

function saveTasksForUser() {
  localStorage.setItem(getTaskStorageKey(), JSON.stringify(currentTasks));
  renderTasks();
}

function renderTasks() {
  // Update Counts
  const total = currentTasks.length;
  const completed = currentTasks.filter(t => t.completed).length;
  const pending = total - completed;

  totalCount.textContent = total;
  completedCount.textContent = completed;
  pendingCount.textContent = pending;

  // Filter tasks
  let filtered = currentTasks;
  if (currentFilter === 'pending') {
    filtered = currentTasks.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filtered = currentTasks.filter(t => t.completed);
  }

  taskList.innerHTML = '';

  if (filtered.length === 0) {
    taskList.innerHTML = `<li class="empty-state">No ${currentFilter === 'all' ? '' : currentFilter} tasks found.</li>`;
    return;
  }

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    const left = document.createElement('div');
    left.className = 'task-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.title;

    const tag = document.createElement('span');
    tag.className = `priority-tag ${task.priority}`;
    tag.textContent = task.priority;

    left.appendChild(checkbox);
    left.appendChild(tag);
    left.appendChild(textSpan);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.title = 'Delete Task';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(left);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

function toggleTask(id) {
  currentTasks = currentTasks.map(t => {
    if (t.id === id) {
      return { ...t, completed: !t.completed };
    }
    return t;
  });
  saveTasksForUser();
}

function deleteTask(id) {
  currentTasks = currentTasks.filter(t => t.id !== id);
  saveTasksForUser();
}

addTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = taskTitleInput.value.trim();
  const priority = taskPrioritySelect.value;
  if (!title) return;

  const newTask = {
    id: Date.now().toString(),
    title: title,
    priority: priority,
    completed: false,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  currentTasks.unshift(newTask);
  saveTasksForUser();
  taskTitleInput.value = '';
  taskTitleInput.focus();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    renderTasks();
  });
});

clearCompletedBtn.addEventListener('click', () => {
  const hasCompleted = currentTasks.some(t => t.completed);
  if (hasCompleted) {
    if (confirm('Clear all completed tasks?')) {
      currentTasks = currentTasks.filter(t => !t.completed);
      saveTasksForUser();
    }
  }
});

// App Startup
initUsers();
const existingSession = localStorage.getItem(CURRENT_USER_KEY);
if (existingSession && getUsers()[existingSession]) {
  loginUser(existingSession);
}

