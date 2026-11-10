// CS1510 - Experiment 07: Shopping Cart Application JavaScript

const STORAGE_USERS = 'cs1510_shop_users';
const STORAGE_CURRENT_USER = 'cs1510_shop_current_user';

// Mock Product Catalogue without emojis
const PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Wireless Mouse',
    category: 'Electronics',
    desc: '2.4GHz optical mouse with silent clicking and 18-month battery life.',
    price: 699,
    stock: 15
  },
  {
    id: 'prod_2',
    name: 'Mechanical Keyboard',
    category: 'Electronics',
    desc: 'Tactile blue switches, multi-color LED backlighting, and anti-ghosting keys.',
    price: 1899,
    stock: 8
  },
  {
    id: 'prod_3',
    name: 'Stereo Headphones',
    category: 'Electronics',
    desc: 'Over-ear Bluetooth headphones with deep bass and 30 hours of playback.',
    price: 2499,
    stock: 12
  },
  {
    id: 'prod_4',
    name: 'Spiral Notebook (A5)',
    category: 'Stationery',
    desc: '300 pages 80 GSM ruled paper with waterproof hardcover for lecture notes.',
    price: 149,
    stock: 50
  },
  {
    id: 'prod_5',
    name: 'Gel Ink Pens (Pack of 5)',
    category: 'Stationery',
    desc: 'Smooth 0.5mm quick-dry Japanese gel ink pens for crisp handwriting.',
    price: 120,
    stock: 40
  },
  {
    id: 'prod_6',
    name: 'Web Development Textbook',
    category: 'Books',
    desc: 'Reference covering modern HTML5, CSS3, JavaScript, and client-side web APIs.',
    price: 650,
    stock: 20
  },
  {
    id: 'prod_7',
    name: 'Data Structures & Algorithms',
    category: 'Books',
    desc: 'In-depth algorithmic analysis with practical lab exercises.',
    price: 550,
    stock: 25
  },
  {
    id: 'prod_8',
    name: 'Laptop Backpack',
    category: 'Accessories',
    desc: 'Spacious multi-compartment 15.6-inch laptop bag with padded shoulder straps.',
    price: 1299,
    stock: 10
  },
  {
    id: 'prod_9',
    name: 'Stainless Steel Water Bottle',
    category: 'Accessories',
    desc: '750ml double-wall vacuum flask keeping beverages hot or cold.',
    price: 499,
    stock: 30
  }
];

let currentUser = null;
let currentCart = [];
let activeCategory = 'all';

// DOM Elements
const authModal = document.getElementById('authModal');
const authLoginTab = document.getElementById('authLoginTab');
const authRegisterTab = document.getElementById('authRegisterTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authAlert = document.getElementById('authAlert');
const loginUserInput = document.getElementById('loginUser');
const loginPassInput = document.getElementById('loginPass');
const regUserInput = document.getElementById('regUser');
const regPassInput = document.getElementById('regPass');
const demoBtn = document.querySelector('.demo-btn');

const appWrapper = document.getElementById('appWrapper');
const headerUsername = document.getElementById('headerUsername');
const logoutBtn = document.getElementById('logoutBtn');
const navCatalogueBtn = document.getElementById('navCatalogueBtn');
const navCartBtn = document.getElementById('navCartBtn');
const navCartBadge = document.getElementById('navCartBadge');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');

const catalogueView = document.getElementById('catalogueView');
const cartView = document.getElementById('cartView');
const productGrid = document.getElementById('productGrid');
const catalogueSearch = document.getElementById('catalogueSearch');
const catBtns = document.querySelectorAll('.cat-btn');

const cartItemsList = document.getElementById('cartItemsList');
const summarySubtotal = document.getElementById('summarySubtotal');
const summaryDiscount = document.getElementById('summaryDiscount');
const summaryTax = document.getElementById('summaryTax');
const summaryGrandTotal = document.getElementById('summaryGrandTotal');
const btnProceedCheckout = document.getElementById('btnProceedCheckout');
const clearCartBtn = document.getElementById('clearCartBtn');

const checkoutReceiptModal = document.getElementById('checkoutReceiptModal');
const closeReceiptBtn = document.getElementById('closeReceiptBtn');
const receiptInvoiceNo = document.getElementById('receiptInvoiceNo');
const receiptCustomer = document.getElementById('receiptCustomer');
const receiptDate = document.getElementById('receiptDate');
const receiptItemsList = document.getElementById('receiptItemsList');
const receiptFinalAmount = document.getElementById('receiptFinalAmount');

function getUsers() {
  const users = localStorage.getItem(STORAGE_USERS);
  if (!users) {
    const defaultUsers = { 'shopper1': '123456' };
    localStorage.setItem(STORAGE_USERS, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(users);
}

function getCartStorageKey() {
  return `cs1510_cart_${currentUser}`;
}

function loadUserCart() {
  const saved = localStorage.getItem(getCartStorageKey());
  currentCart = saved ? JSON.parse(saved) : [];
  updateCartBadge();
}

function saveUserCart() {
  localStorage.setItem(getCartStorageKey(), JSON.stringify(currentCart));
  updateCartBadge();
  if (!cartView.classList.contains('hidden')) {
    renderCart();
  }
}

function showAlert(msg, type = 'error') {
  authAlert.textContent = msg;
  authAlert.className = `alert ${type}`;
  authAlert.classList.remove('hidden');
}

authLoginTab.addEventListener('click', () => {
  authLoginTab.classList.add('active');
  authRegisterTab.classList.remove('active');
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  authAlert.classList.add('hidden');
});

authRegisterTab.addEventListener('click', () => {
  authRegisterTab.classList.add('active');
  authLoginTab.classList.remove('active');
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
    showAlert('Invalid credentials. Use demo account "shopper1" / "123456".');
  }
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const u = regUserInput.value.trim().toLowerCase();
  const p = regPassInput.value;
  const users = getUsers();

  if (users[u]) {
    showAlert('Username already taken.');
    return;
  }
  if (p.length < 4) {
    showAlert('Password must be at least 4 characters.');
    return;
  }

  users[u] = p;
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  showAlert('Account created. Logging in...', 'success');
  setTimeout(() => login(u), 400);
});

function login(username) {
  currentUser = username;
  localStorage.setItem(STORAGE_CURRENT_USER, username);
  authModal.classList.add('hidden');
  appWrapper.classList.remove('hidden');
  headerUsername.textContent = username;
  loadUserCart();
  renderCatalogue();
  showCatalogueView();
}

function logout() {
  currentUser = null;
  localStorage.removeItem(STORAGE_CURRENT_USER);
  appWrapper.classList.add('hidden');
  authModal.classList.remove('hidden');
  loginPassInput.value = '';
}

logoutBtn.addEventListener('click', logout);

function showCatalogueView() {
  catalogueView.classList.remove('hidden');
  cartView.classList.add('hidden');
  navCatalogueBtn.classList.add('active');
  navCartBtn.classList.remove('active');
}

function showCartView() {
  catalogueView.classList.add('hidden');
  cartView.classList.remove('hidden');
  navCartBtn.classList.add('active');
  navCatalogueBtn.classList.remove('active');
  renderCart();
}

navCatalogueBtn.addEventListener('click', showCatalogueView);
navCartBtn.addEventListener('click', showCartView);
continueShoppingBtn.addEventListener('click', showCatalogueView);

function renderCatalogue() {
  productGrid.innerHTML = '';
  const search = catalogueSearch.value.trim().toLowerCase();

  const filtered = PRODUCTS.filter(prod => {
    const matchesCat = activeCategory === 'all' || prod.category === activeCategory;
    const matchesSearch = prod.name.toLowerCase().includes(search) || prod.desc.toLowerCase().includes(search);
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 1.5rem;">No products match your filter.</p>';
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div>
        <div class="product-category">${p.category}</div>
        <div class="product-title">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
      </div>
      <div class="product-card-footer">
        <span class="product-price">Rs. ${p.price.toLocaleString()}</span>
        <button class="btn-add-cart" data-id="${p.id}">+ Add to Cart</button>
      </div>
    `;

    card.querySelector('.btn-add-cart').addEventListener('click', () => addToCart(p));
    productGrid.appendChild(card);
  });
}

catBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.cat;
    renderCatalogue();
  });
});

catalogueSearch.addEventListener('input', renderCatalogue);

function addToCart(product) {
  const existing = currentCart.find(item => item.id === product.id);
  if (existing) {
    if (existing.qty < product.stock) {
      existing.qty += 1;
    } else {
      alert(`Maximum available stock is ${product.stock} units.`);
      return;
    }
  } else {
    currentCart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      maxStock: product.stock,
      qty: 1
    });
  }
  saveUserCart();
}

function updateQuantity(id, delta) {
  const item = currentCart.find(i => i.id === id);
  if (!item) return;

  const newQty = item.qty + delta;
  if (newQty <= 0) {
    currentCart = currentCart.filter(i => i.id !== id);
  } else if (newQty > item.maxStock) {
    alert(`Only ${item.maxStock} units currently in stock.`);
    return;
  } else {
    item.qty = newQty;
  }
  saveUserCart();
}

function removeItem(id) {
  currentCart = currentCart.filter(i => i.id !== id);
  saveUserCart();
}

function updateCartBadge() {
  const totalQty = currentCart.reduce((sum, item) => sum + item.qty, 0);
  navCartBadge.textContent = totalQty;
}

function renderCart() {
  cartItemsList.innerHTML = '';

  if (currentCart.length === 0) {
    cartItemsList.innerHTML = `
      <div style="text-align: center; color: #777; padding: 2rem 1rem;">
        <p>Your shopping cart is empty.</p>
        <button id="emptyStateBrowseBtn" class="btn primary-btn" style="margin-top:8px;">Browse Products</button>
      </div>
    `;
    const btn = document.getElementById('emptyStateBrowseBtn');
    if (btn) btn.addEventListener('click', showCatalogueView);

    summarySubtotal.textContent = 'Rs. 0.00';
    summaryDiscount.textContent = '-Rs. 0.00';
    summaryTax.textContent = 'Rs. 0.00';
    summaryGrandTotal.textContent = 'Rs. 0.00';
    btnProceedCheckout.disabled = true;
    return;
  }

  let subtotal = 0;

  currentCart.forEach(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    const row = document.createElement('div');
    row.className = 'cart-item-row';
    row.innerHTML = `
      <div class="cart-item-meta">
        <h4>${item.name}</h4>
        <span class="cart-item-unit-price">Rs. ${item.price.toLocaleString()} each</span>
      </div>
      <div class="cart-qty-ctrl">
        <button class="ctrl-btn dec-btn" data-id="${item.id}">-</button>
        <span class="qty-number">${item.qty}</span>
        <button class="ctrl-btn inc-btn" data-id="${item.id}">+</button>
      </div>
      <div class="cart-item-total">Rs. ${itemTotal.toLocaleString()}</div>
      <button class="remove-item-btn" title="Remove Item" data-id="${item.id}">&times;</button>
    `;

    row.querySelector('.dec-btn').addEventListener('click', () => updateQuantity(item.id, -1));
    row.querySelector('.inc-btn').addEventListener('click', () => updateQuantity(item.id, 1));
    row.querySelector('.remove-item-btn').addEventListener('click', () => removeItem(item.id));

    cartItemsList.appendChild(row);
  });

  const discount = subtotal * 0.05;
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * 0.10;
  const grandTotal = taxableAmount + tax;

  summarySubtotal.textContent = `Rs. ${subtotal.toFixed(2)}`;
  summaryDiscount.textContent = `-Rs. ${discount.toFixed(2)}`;
  summaryTax.textContent = `Rs. ${tax.toFixed(2)}`;
  summaryGrandTotal.textContent = `Rs. ${grandTotal.toFixed(2)}`;
  btnProceedCheckout.disabled = false;
}

clearCartBtn.addEventListener('click', () => {
  if (currentCart.length > 0 && confirm('Clear all items from your cart?')) {
    currentCart = [];
    saveUserCart();
  }
});

btnProceedCheckout.addEventListener('click', () => {
  if (currentCart.length === 0) return;

  const invoiceNo = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleString();

  receiptInvoiceNo.textContent = `#${invoiceNo}`;
  receiptCustomer.textContent = currentUser;
  receiptDate.textContent = dateStr;

  receiptItemsList.innerHTML = '';
  currentCart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'receipt-item-row';
    div.innerHTML = `
      <span>${item.name} x ${item.qty}</span>
      <strong>Rs. ${(item.price * item.qty).toLocaleString()}</strong>
    `;
    receiptItemsList.appendChild(div);
  });

  receiptFinalAmount.textContent = summaryGrandTotal.textContent;

  currentCart = [];
  saveUserCart();

  checkoutReceiptModal.classList.remove('hidden');
});

closeReceiptBtn.addEventListener('click', () => {
  checkoutReceiptModal.classList.add('hidden');
  showCatalogueView();
});

getUsers();
const existingSession = localStorage.getItem(STORAGE_CURRENT_USER);
if (existingSession && getUsers()[existingSession]) {
  login(existingSession);
}
