// CS1510 - Experiment 09: Project Management Dashboard JavaScript

const STORAGE_USERS = 'cs1510_pm_users';
const STORAGE_CURRENT_USER = 'cs1510_pm_current_user';
const STORAGE_TASKS = 'cs1510_pm_tasks';

let currentUser = null;
let tasks = [];

// DOM Elements
const authModal = document.getElementById('authModal');
const authTabLogin = document.getElementById('authTabLogin');
const authTabRegister = document.getElementById('authTabRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authAlert = document.getElementById('authAlert');
const loginUserInput = document.getElementById('loginUser');
const loginPassInput = document.getElementById('loginPass');
const regUserInput = document.getElementById('regUser');
const regPassInput = document.getElementById('regPass');
const demoBtn = document.querySelector('.demo-btn');

const dashboardWrapper = document.getElementById('dashboardWrapper');
const headerUser = document.getElementById('headerUser');
const logoutBtn = document.getElementById('logoutBtn');
const openCreateModalBtn = document.getElementById('openCreateModalBtn');

const statTotal = document.getElementById('statTotal');
const statPending = document.getElementById('statPending');
const statInProgress = document.getElementById('statInProgress');
const statCompleted = document.getElementById('statCompleted');
const statRate = document.getElementById('statRate');

const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const priorityFilter = document.getElementById('priorityFilter');
const showingCount = document.getElementById('showingCount');
const tasksGrid = document.getElementById('tasksGrid');

const taskModal = document.getElementById('taskModal');
const closeTaskModalBtn = document.getElementById('closeTaskModalBtn');
const taskModalTitle = document.getElementById('taskModalTitle');
const taskForm = document.getElementById('taskForm');
const editTaskId = document.getElementById('editTaskId');
const taskTitle = document.getElementById('taskTitle');
const taskDesc = document.getElementById('taskDesc');
const taskAssignee = document.getElementById('taskAssignee');
const taskPriority = document.getElementById('taskPriority');
const taskDueDate = document.getElementById('taskDueDate');
const taskStatus = document.getElementById('taskStatus');

function initializeTasks() {
  const saved = localStorage.getItem(STORAGE_TASKS);
  if (saved) {
    tasks = JSON.parse(saved);
  } else {
    tasks = [
      {
        id: 'tsk_101',
        title: 'Design HTML Layout Structure',
        desc: 'Construct semantic header, main flex container, and footer elements.',
        assignee: 'Alice Chen',
        priority: 'High',
        dueDate: '2026-11-15',
        status: 'Completed'
      },
      {
        id: 'tsk_102',
        title: 'Implement Interactive Chat Logic',
        desc: 'Write rule-based intent parsing for greetings and fallback handling.',
        assignee: 'Bob Wilson',
        priority: 'Medium',
        dueDate: '2026-11-18',
        status: 'In Progress'
      },
      {
        id: 'tsk_103',
        title: 'Build Arithmetic Calculator',
        desc: 'Handle zero-division boundary checks and float formatting.',
        assignee: 'Charlie Davis',
        priority: 'High',
        dueDate: '2026-11-20',
        status: 'In Progress'
      },
      {
        id: 'tsk_104',
        title: 'Setup Online Survey Admin View',
        desc: 'Display collected response payloads with summary statistics.',
        assignee: 'David Miller',
        priority: 'Low',
        dueDate: '2026-11-25',
        status: 'Pending'
      }
    ];
    saveTasks();
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_TASKS, JSON.stringify(tasks));
  updateStats();
  renderTasks();
}

function getUsers() {
  const users = localStorage.getItem(STORAGE_USERS);
  if (!users) {
    const defaultUsers = { 'manager1': '123456' };
    localStorage.setItem(STORAGE_USERS, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(users);
}

function showAuthAlert(msg, type = 'error') {
  authAlert.textContent = msg;
  authAlert.className = `alert ${type}`;
  authAlert.classList.remove('hidden');
}

authTabLogin.addEventListener('click', () => {
  authTabLogin.classList.add('active');
  authTabRegister.classList.remove('active');
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  authAlert.classList.add('hidden');
});

authTabRegister.addEventListener('click', () => {
  authTabRegister.classList.add('active');
  authTabLogin.classList.remove('active');
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  authAlert.classList.add('hidden');
});

demoBtn.addEventListener('click', () => {
  loginUserInput.value = demoBtn.dataset.u;
  loginPassInput.value = demoBtn.dataset.p;
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const u = loginUserInput.value.trim().toLowerCase();
  const p = loginPassInput.value;
  const users = getUsers();

  if (users[u] && users[u] === p) {
    login(u);
  } else {
    showAuthAlert('Invalid credentials. Use demo account "manager1" / "123456".');
  }
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const u = regUserInput.value.trim().toLowerCase();
  const p = regPassInput.value;
  const users = getUsers();

  if (users[u]) {
    showAuthAlert('Username already registered.');
    return;
  }
  if (p.length < 4) {
    showAuthAlert('Password must be at least 4 characters.');
    return;
  }

  users[u] = p;
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  showAuthAlert('Registered successfully. Logging in...', 'success');
  setTimeout(() => login(u), 400);
});

function login(username) {
  currentUser = username;
  localStorage.setItem(STORAGE_CURRENT_USER, username);
  authModal.classList.add('hidden');
  dashboardWrapper.classList.remove('hidden');
  headerUser.textContent = username;
  initializeTasks();
  updateStats();
  renderTasks();
}

function logout() {
  currentUser = null;
  localStorage.removeItem(STORAGE_CURRENT_USER);
  dashboardWrapper.classList.add('hidden');
  authModal.classList.remove('hidden');
  loginPassInput.value = '';
}

logoutBtn.addEventListener('click', logout);

function updateStats() {
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === 'Pending').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  statTotal.textContent = total;
  statPending.textContent = pending;
  statInProgress.textContent = inProgress;
  statCompleted.textContent = completed;
  statRate.textContent = `${rate}%`;
}

function renderTasks() {
  tasksGrid.innerHTML = '';

  const search = searchInput.value.trim().toLowerCase();
  const stFilter = statusFilter.value;
  const prFilter = priorityFilter.value;

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search) || 
                        t.desc.toLowerCase().includes(search) || 
                        t.assignee.toLowerCase().includes(search);
    const matchStatus = stFilter === 'All' || t.status === stFilter;
    const matchPriority = prFilter === 'All' || t.priority === prFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  showingCount.textContent = `Showing ${filtered.length} of ${tasks.length} Tasks`;

  if (filtered.length === 0) {
    tasksGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 1.5rem;">No tasks match your filter.</p>';
    return;
  }

  filtered.forEach(task => {
    const card = document.createElement('div');
    card.className = 'task-card';

    card.innerHTML = `
      <div>
        <div class="task-top">
          <span class="task-title">${escapeHtml(task.title)}</span>
          <span class="priority-tag ${task.priority}">${task.priority}</span>
        </div>
        <p class="task-desc">${escapeHtml(task.desc)}</p>
      </div>
      <div>
        <div class="task-meta-row">
          <span>Assignee: ${escapeHtml(task.assignee)}</span>
          <span>Due: ${task.dueDate}</span>
        </div>
        <div class="task-bottom">
          <select class="status-dropdown" data-id="${task.id}">
            <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
          <div class="task-actions">
            <button class="btn-action edit-btn" data-id="${task.id}">Edit</button>
            <button class="btn-action delete-btn" data-id="${task.id}">Delete</button>
          </div>
        </div>
      </div>
    `;

    card.querySelector('.status-dropdown').addEventListener('change', (e) => {
      updateTaskStatus(task.id, e.target.value);
    });

    card.querySelector('.edit-btn').addEventListener('click', () => {
      openEditModal(task);
    });

    card.querySelector('.delete-btn').addEventListener('click', () => {
      deleteTask(task.id);
    });

    tasksGrid.appendChild(card);
  });
}

function updateTaskStatus(id, newStatus) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = newStatus;
    saveTasks();
  }
}

function deleteTask(id) {
  if (confirm('Delete this task?')) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
  }
}

openCreateModalBtn.addEventListener('click', () => {
  editTaskId.value = '';
  taskModalTitle.textContent = 'Create Task';
  taskForm.reset();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  taskDueDate.value = tomorrow.toISOString().split('T')[0];
  taskModal.classList.remove('hidden');
});

closeTaskModalBtn.addEventListener('click', () => {
  taskModal.classList.add('hidden');
});

function openEditModal(task) {
  editTaskId.value = task.id;
  taskModalTitle.textContent = 'Edit Task';
  taskTitle.value = task.title;
  taskDesc.value = task.desc;
  taskAssignee.value = task.assignee;
  taskPriority.value = task.priority;
  taskDueDate.value = task.dueDate;
  taskStatus.value = task.status;
  taskModal.classList.remove('hidden');
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = editTaskId.value;
  const title = taskTitle.value.trim();
  const desc = taskDesc.value.trim();
  const assignee = taskAssignee.value.trim();
  const priority = taskPriority.value;
  const dueDate = taskDueDate.value;
  const status = taskStatus.value;

  if (id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.title = title;
      task.desc = desc;
      task.assignee = assignee;
      task.priority = priority;
      task.dueDate = dueDate;
      task.status = status;
    }
  } else {
    const newTask = {
      id: `tsk_${Date.now()}`,
      title,
      desc,
      assignee,
      priority,
      dueDate,
      status
    };
    tasks.unshift(newTask);
  }

  saveTasks();
  taskModal.classList.add('hidden');
});

searchInput.addEventListener('input', renderTasks);
statusFilter.addEventListener('change', renderTasks);
priorityFilter.addEventListener('change', renderTasks);

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

getUsers();
const session = localStorage.getItem(STORAGE_CURRENT_USER);
if (session && getUsers()[session]) {
  login(session);
}
