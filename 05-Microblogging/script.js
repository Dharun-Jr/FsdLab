// CS1510 - Experiment 05: Microblogging Application JavaScript

const STORAGE_USERS = 'cs1510_mb_users';
const STORAGE_CURRENT_USER = 'cs1510_mb_current_user';
const STORAGE_POSTS = 'cs1510_mb_posts';
const STORAGE_FOLLOWS = 'cs1510_mb_follows';

let currentUser = null;
let activeFeedTab = 'all';

// DOM Elements
const authOverlay = document.getElementById('authOverlay');
const authTabLogin = document.getElementById('authTabLogin');
const authTabRegister = document.getElementById('authTabRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authAlert = document.getElementById('authAlert');
const loginUserInput = document.getElementById('loginUser');
const loginPassInput = document.getElementById('loginPass');
const regUserInput = document.getElementById('regUser');
const regBioInput = document.getElementById('regBio');
const regPassInput = document.getElementById('regPass');
const demoChips = document.querySelectorAll('.demo-chip');

const navUsername = document.getElementById('navUsername');
const logoutBtn = document.getElementById('logoutBtn');
const viewProfileBtn = document.getElementById('viewProfileBtn');
const summaryName = document.getElementById('summaryName');
const summaryBio = document.getElementById('summaryBio');
const summaryPostsCount = document.getElementById('summaryPostsCount');
const summaryFollowingCount = document.getElementById('summaryFollowingCount');
const summaryFollowersCount = document.getElementById('summaryFollowersCount');

const postContentInput = document.getElementById('postContentInput');
const charCount = document.getElementById('charCount');
const publishPostBtn = document.getElementById('publishPostBtn');
const feedTabAll = document.getElementById('feedTabAll');
const feedTabFollowing = document.getElementById('feedTabFollowing');
const postsFeed = document.getElementById('postsFeed');
const usersDirectoryList = document.getElementById('usersDirectoryList');

const profileModal = document.getElementById('profileModal');
const closeProfileModalBtn = document.getElementById('closeProfileModalBtn');
const modalProfileTitle = document.getElementById('modalProfileTitle');
const modalProfileBody = document.getElementById('modalProfileBody');

function initializeData() {
  if (!localStorage.getItem(STORAGE_USERS)) {
    const defaultUsers = {
      'alice': { password: '123456', bio: 'Computer Science student' },
      'bob': { password: '123456', bio: 'Web development learner' },
      'charlie': { password: '123456', bio: 'CSE 3rd Year' }
    };
    localStorage.setItem(STORAGE_USERS, JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem(STORAGE_FOLLOWS)) {
    const defaultFollows = {
      'alice': ['bob'],
      'bob': ['alice', 'charlie'],
      'charlie': ['alice']
    };
    localStorage.setItem(STORAGE_FOLLOWS, JSON.stringify(defaultFollows));
  }

  if (!localStorage.getItem(STORAGE_POSTS)) {
    const defaultPosts = [
      {
        id: 'post_1',
        author: 'alice',
        text: 'Welcome to CS1510 Full Stack Development lab. Today we are practicing client-side scripting and localStorage.',
        timestamp: '10:15 AM',
        likes: ['bob', 'charlie'],
        comments: [
          { author: 'bob', text: 'All experiments are running smoothly.', time: '10:20 AM' }
        ]
      },
      {
        id: 'post_2',
        author: 'bob',
        text: 'Working on client-side state persistence without any backend server.',
        timestamp: '11:00 AM',
        likes: ['alice'],
        comments: []
      },
      {
        id: 'post_3',
        author: 'charlie',
        text: 'Make sure to check responsive layout on mobile viewports.',
        timestamp: '11:45 AM',
        likes: ['alice', 'bob'],
        comments: []
      }
    ];
    localStorage.setItem(STORAGE_POSTS, JSON.stringify(defaultPosts));
  }
}

function getUsers() { return JSON.parse(localStorage.getItem(STORAGE_USERS) || '{}'); }
function getPosts() { return JSON.parse(localStorage.getItem(STORAGE_POSTS) || '[]'); }
function savePosts(posts) { localStorage.setItem(STORAGE_POSTS, JSON.stringify(posts)); }
function getFollows() { return JSON.parse(localStorage.getItem(STORAGE_FOLLOWS) || '{}'); }
function saveFollows(follows) { localStorage.setItem(STORAGE_FOLLOWS, JSON.stringify(follows)); }

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

demoChips.forEach(chip => {
  chip.addEventListener('click', () => {
    loginUserInput.value = chip.dataset.user;
    loginPassInput.value = chip.dataset.pass;
  });
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = loginUserInput.value.trim().toLowerCase();
  const password = loginPassInput.value;
  const users = getUsers();

  if (users[username] && users[username].password === password) {
    loginUser(username);
  } else {
    showAuthAlert('Invalid credentials. Try demo user "alice" / "123456".');
  }
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = regUserInput.value.trim().toLowerCase();
  const bio = regBioInput.value.trim();
  const password = regPassInput.value;
  const users = getUsers();

  if (users[username]) {
    showAuthAlert('Username already registered.');
    return;
  }
  if (password.length < 4) {
    showAuthAlert('Password must be at least 4 characters.');
    return;
  }

  users[username] = { password, bio: bio || 'CS1510 Student' };
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));

  const follows = getFollows();
  follows[username] = [];
  saveFollows(follows);

  showAuthAlert('Registered successfully. Logging in...', 'success');
  setTimeout(() => loginUser(username), 400);
});

function loginUser(username) {
  currentUser = username;
  localStorage.setItem(STORAGE_CURRENT_USER, username);
  authOverlay.classList.add('hidden');

  updateUserProfileUI();
  renderFollowSuggestions();
  renderFeed();
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem(STORAGE_CURRENT_USER);
  authOverlay.classList.remove('hidden');
  loginPassInput.value = '';
}

logoutBtn.addEventListener('click', logoutUser);

function updateUserProfileUI() {
  if (!currentUser) return;
  const users = getUsers();
  const profile = users[currentUser] || { bio: 'Student' };
  const follows = getFollows();
  const myFollowing = follows[currentUser] || [];

  let followerCount = 0;
  for (const user in follows) {
    if (follows[user].includes(currentUser)) followerCount++;
  }

  const posts = getPosts();
  const myPostsCount = posts.filter(p => p.author === currentUser).length;

  navUsername.textContent = currentUser;
  summaryName.textContent = currentUser;
  summaryBio.textContent = profile.bio;
  summaryPostsCount.textContent = myPostsCount;
  summaryFollowingCount.textContent = myFollowing.length;
  summaryFollowersCount.textContent = followerCount;
}

function toggleFollow(targetUser) {
  const follows = getFollows();
  if (!follows[currentUser]) follows[currentUser] = [];

  const index = follows[currentUser].indexOf(targetUser);
  if (index > -1) {
    follows[currentUser].splice(index, 1);
  } else {
    follows[currentUser].push(targetUser);
  }

  saveFollows(follows);
  updateUserProfileUI();
  renderFollowSuggestions();
  if (activeFeedTab === 'following') {
    renderFeed();
  }
}

function renderFollowSuggestions() {
  const users = getUsers();
  const follows = getFollows();
  const myFollowing = follows[currentUser] || [];

  usersDirectoryList.innerHTML = '';
  const otherUsers = Object.keys(users).filter(u => u !== currentUser);

  if (otherUsers.length === 0) {
    usersDirectoryList.innerHTML = '<li style="color:#888; font-size:0.85rem;">No other users.</li>';
    return;
  }

  otherUsers.forEach(username => {
    const isFollowing = myFollowing.includes(username);
    const li = document.createElement('li');
    li.className = 'user-row';

    li.innerHTML = `
      <span class="user-name-tag">${username}</span>
      <button class="follow-btn ${isFollowing ? 'following' : ''}">
        ${isFollowing ? 'Following' : 'Follow'}
      </button>
    `;

    li.querySelector('.follow-btn').addEventListener('click', () => toggleFollow(username));
    usersDirectoryList.appendChild(li);
  });
}

postContentInput.addEventListener('input', () => {
  charCount.textContent = `${postContentInput.value.length} / 280`;
});

publishPostBtn.addEventListener('click', () => {
  const text = postContentInput.value.trim();
  if (!text) return;

  const posts = getPosts();
  const newPost = {
    id: `post_${Date.now()}`,
    author: currentUser,
    text: text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    likes: [],
    comments: []
  };

  posts.unshift(newPost);
  savePosts(posts);

  postContentInput.value = '';
  charCount.textContent = '0 / 280';
  updateUserProfileUI();
  renderFeed();
});

feedTabAll.addEventListener('click', () => {
  activeFeedTab = 'all';
  feedTabAll.classList.add('active');
  feedTabFollowing.classList.remove('active');
  renderFeed();
});

feedTabFollowing.addEventListener('click', () => {
  activeFeedTab = 'following';
  feedTabFollowing.classList.add('active');
  feedTabAll.classList.remove('active');
  renderFeed();
});

function renderFeed() {
  const posts = getPosts();
  const follows = getFollows();
  const myFollowing = follows[currentUser] || [];

  let displayPosts = posts;
  if (activeFeedTab === 'following') {
    displayPosts = posts.filter(p => myFollowing.includes(p.author) || p.author === currentUser);
  }

  postsFeed.innerHTML = '';

  if (displayPosts.length === 0) {
    postsFeed.innerHTML = `
      <div class="card" style="padding: 1.5rem; text-align: center; color: #777;">
        <p>No posts available.</p>
      </div>
    `;
    return;
  }

  displayPosts.forEach(post => {
    const card = document.createElement('article');
    card.className = 'post-card';

    const isLiked = post.likes && post.likes.includes(currentUser);
    const likeCount = post.likes ? post.likes.length : 0;
    const commentsCount = post.comments ? post.comments.length : 0;

    card.innerHTML = `
      <div class="post-header">
        <span class="post-author">${escapeHtml(post.author)}</span>
        <span class="post-time">${post.timestamp}</span>
      </div>
      <div class="post-text">${escapeHtml(post.text)}</div>
      <div class="post-actions">
        <button class="action-btn like-btn ${isLiked ? 'liked' : ''}">
          ${isLiked ? 'Liked' : 'Like'} (${likeCount})
        </button>
        <button class="action-btn comment-toggle-btn">
          Comments (${commentsCount})
        </button>
      </div>
      <div class="comments-container hidden">
        <ul class="comment-list">
          ${(post.comments || []).map(c => `
            <li class="comment-item">
              <span class="comment-author">${escapeHtml(c.author)}:</span>
              <span>${escapeHtml(c.text)}</span>
            </li>
          `).join('')}
        </ul>
        <form class="comment-form" onsubmit="return false;">
          <input type="text" placeholder="Write a comment..." required>
          <button type="submit" class="btn primary-btn small-btn">Reply</button>
        </form>
      </div>
    `;

    card.querySelector('.post-author').addEventListener('click', () => openProfileModal(post.author));
    card.querySelector('.like-btn').addEventListener('click', () => toggleLike(post.id));

    const commentsBox = card.querySelector('.comments-container');
    card.querySelector('.comment-toggle-btn').addEventListener('click', () => {
      commentsBox.classList.toggle('hidden');
    });

    const commentForm = card.querySelector('.comment-form');
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = commentForm.querySelector('input');
      const val = input.value.trim();
      if (val) {
        addComment(post.id, val);
        input.value = '';
      }
    });

    postsFeed.appendChild(card);
  });
}

function toggleLike(postId) {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  if (!post.likes) post.likes = [];
  const idx = post.likes.indexOf(currentUser);

  if (idx > -1) {
    post.likes.splice(idx, 1);
  } else {
    post.likes.push(currentUser);
  }

  savePosts(posts);
  renderFeed();
}

function addComment(postId, text) {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  if (!post.comments) post.comments = [];
  post.comments.push({
    author: currentUser,
    text: text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  savePosts(posts);
  renderFeed();
}

viewProfileBtn.addEventListener('click', () => openProfileModal(currentUser));
closeProfileModalBtn.addEventListener('click', () => profileModal.classList.add('hidden'));

function openProfileModal(targetUsername) {
  const users = getUsers();
  const user = users[targetUsername] || { bio: 'User not found' };
  const follows = getFollows();
  const targetFollowing = follows[targetUsername] || [];

  let followerCount = 0;
  for (const u in follows) {
    if (follows[u].includes(targetUsername)) followerCount++;
  }

  const posts = getPosts().filter(p => p.author === targetUsername);

  modalProfileTitle.textContent = `${targetUsername} - Profile`;
  modalProfileBody.innerHTML = `
    <div style="margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem;">
      <h4 style="color:#003366; font-size:1.1rem;">${targetUsername}</h4>
      <p style="color:#666; font-size:0.85rem; margin-top:0.2rem;">${escapeHtml(user.bio)}</p>
      <div style="display:flex; gap:1.5rem; margin-top:0.5rem; font-size:0.85rem;">
        <span><strong>${posts.length}</strong> Posts</span>
        <span><strong>${targetFollowing.length}</strong> Following</span>
        <span><strong>${followerCount}</strong> Followers</span>
      </div>
    </div>
    <h5 style="margin-bottom: 0.5rem; color:#333;">Authored Posts:</h5>
    <div style="max-height: 200px; overflow-y: auto;">
      ${posts.length === 0 ? '<p style="color:#888; font-size:0.85rem;">No posts published.</p>' : ''}
      ${posts.map(p => `
        <div style="border-bottom: 1px solid #f0f0f0; padding: 0.4rem 0; font-size:0.85rem;">
          <div>${escapeHtml(p.text)}</div>
          <div style="color:#888; font-size:0.75rem; margin-top:0.15rem;">${p.timestamp} | ${p.likes ? p.likes.length : 0} likes</div>
        </div>
      `).join('')}
    </div>
  `;

  profileModal.classList.remove('hidden');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

initializeData();
const session = localStorage.getItem(STORAGE_CURRENT_USER);
if (session && getUsers()[session]) {
  loginUser(session);
}
