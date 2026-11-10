// CS1510 - Experiment 06: Food Delivery Website JavaScript

const STORAGE_CART = 'cs1510_food_cart';
const STORAGE_ORDERS = 'cs1510_food_orders';

// 4 Campus Restaurants with full menus (Clean, minimal data without emojis)
const RESTAURANTS = [
  {
    id: 'rest_1',
    name: 'Campus Pizza Bistro',
    cuisine: 'Italian, Pizza, Fast Food',
    rating: '4.8 / 5',
    deliveryTime: '20-30 mins',
    minOrder: 'Rs. 150',
    menu: [
      { id: 'm1_1', name: 'Margherita Classic Pizza', desc: 'Fresh basil, mozzarella cheese and tomato sauce on hand-tossed crust.', price: 199, isVeg: true },
      { id: 'm1_2', name: 'Farmhouse Veggie Supreme', desc: 'Capsicum, sweet corn, black olives, onions and golden mushrooms.', price: 279, isVeg: true },
      { id: 'm1_3', name: 'BBQ Chicken Feast', desc: 'Smoked grilled chicken chunks, red paprika, and smoky BBQ drizzle.', price: 349, isVeg: false },
      { id: 'm1_4', name: 'Cheesy Garlic Breadsticks', desc: 'Baked breadsticks infused with garlic butter and melted cheddar.', price: 129, isVeg: true }
    ]
  },
  {
    id: 'rest_2',
    name: 'Spice Delight Biryani',
    cuisine: 'Hyderabadi, Indian, Biryani',
    rating: '4.7 / 5',
    deliveryTime: '25-35 mins',
    minOrder: 'Rs. 200',
    menu: [
      { id: 'm2_1', name: 'Hyderabadi Chicken Biryani', desc: 'Aromatic basmati rice cooked with tender marinated chicken and spices.', price: 280, isVeg: false },
      { id: 'm2_2', name: 'Paneer Dum Biryani', desc: 'Cottage cheese cubes tossed in royal biryani spices and mint leaves.', price: 230, isVeg: true },
      { id: 'm2_3', name: 'Butter Chicken Masala', desc: 'Slow-cooked chicken in butter tomato gravy. Served with 2 rotis.', price: 260, isVeg: false },
      { id: 'm2_4', name: 'Gulab Jamun (2 Pcs)', desc: 'Warm milk dumplings soaked in cardamom sugar syrup.', price: 70, isVeg: true }
    ]
  },
  {
    id: 'rest_3',
    name: 'Green Garden Healthy Cafe',
    cuisine: 'Salads, Smoothies, Wraps',
    rating: '4.6 / 5',
    deliveryTime: '15-25 mins',
    minOrder: 'Rs. 100',
    menu: [
      { id: 'm3_1', name: 'Mediterranean Greek Salad', desc: 'Feta cheese, crisp cucumber, kalamata olives, and olive oil dressing.', price: 180, isVeg: true },
      { id: 'm3_2', name: 'Grilled Paneer Protein Wrap', desc: 'Whole wheat flatbread rolled with marinated paneer, hummus and vegetables.', price: 160, isVeg: true },
      { id: 'm3_3', name: 'Grilled Chicken Caesar Wrap', desc: 'Tender chicken breast, parmesan, romaine lettuce and caesar dressing.', price: 195, isVeg: false },
      { id: 'm3_4', name: 'Berry Blast Fruit Smoothie', desc: 'Fresh blueberries, strawberries, bananas blended with milk.', price: 140, isVeg: true }
    ]
  },
  {
    id: 'rest_4',
    name: 'The Burger & Shake Hub',
    cuisine: 'Burgers, Fries, Milkshakes',
    rating: '4.5 / 5',
    deliveryTime: '15-20 mins',
    minOrder: 'Rs. 120',
    menu: [
      { id: 'm4_1', name: 'Crispy Veg Double Patty Burger', desc: 'Crisp vegetable patties with cheddar slice and house secret sauce.', price: 149, isVeg: true },
      { id: 'm4_2', name: 'Smoky Crispy Chicken Burger', desc: 'Spiced chicken breast fillet topped with crunchy coleslaw.', price: 199, isVeg: false },
      { id: 'm4_3', name: 'Peri-Peri Crinkle Fries', desc: 'Crinkle-cut potato fries dusted with peri-peri seasoning.', price: 99, isVeg: true },
      { id: 'm4_4', name: 'Chocolate Thick Shake', desc: 'Melted chocolate whipped with vanilla ice cream.', price: 159, isVeg: true }
    ]
  }
];

let selectedRestaurant = null;
let cart = loadCart();
const DELIVERY_FEE = 30;

// DOM Elements
const restaurantsView = document.getElementById('restaurantsView');
const menuView = document.getElementById('menuView');
const restaurantsGrid = document.getElementById('restaurantsGrid');
const restaurantSearch = document.getElementById('restaurantSearch');
const backToRestaurantsBtn = document.getElementById('backToRestaurantsBtn');
const restaurantBanner = document.getElementById('restaurantBanner');
const menuItemsGrid = document.getElementById('menuItemsGrid');
const dietFilterRadios = document.querySelectorAll('input[name="dietFilter"]');

const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartBadge = document.getElementById('cartBadge');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartDeliveryFee = document.getElementById('cartDeliveryFee');
const cartGrandTotal = document.getElementById('cartGrandTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

const checkoutModal = document.getElementById('checkoutModal');
const closeCheckoutModalBtn = document.getElementById('closeCheckoutModalBtn');
const orderForm = document.getElementById('orderForm');
const modalPayableAmount = document.getElementById('modalPayableAmount');
const successModal = document.getElementById('successModal');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');
const confirmedOrderId = document.getElementById('confirmedOrderId');
const confirmedOrderSummary = document.getElementById('confirmedOrderSummary');
const viewHistoryBtn = document.getElementById('viewHistoryBtn');
const historyModal = document.getElementById('historyModal');
const closeHistoryModalBtn = document.getElementById('closeHistoryModalBtn');
const historyListContainer = document.getElementById('historyListContainer');

function loadCart() {
  const saved = localStorage.getItem(STORAGE_CART);
  return saved ? JSON.parse(saved) : [];
}

function saveCart() {
  localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
  updateCartUI();
}

function renderRestaurants(filterTerm = '') {
  restaurantsGrid.innerHTML = '';
  const term = filterTerm.trim().toLowerCase();

  const filtered = RESTAURANTS.filter(r => 
    r.name.toLowerCase().includes(term) || r.cuisine.toLowerCase().includes(term)
  );

  if (filtered.length === 0) {
    restaurantsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#666; padding:1.5rem;">No restaurants match your search.</p>';
    return;
  }

  filtered.forEach(r => {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.innerHTML = `
      <div class="rest-title-row">
        <h3>${r.name}</h3>
        <span class="rating-pill">${r.rating}</span>
      </div>
      <div class="cuisine-tag">${r.cuisine}</div>
      <div class="delivery-meta">
        <span>Delivery: ${r.deliveryTime}</span>
        <span>Min: ${r.minOrder}</span>
      </div>
    `;
    card.addEventListener('click', () => openRestaurantMenu(r));
    restaurantsGrid.appendChild(card);
  });
}

function openRestaurantMenu(restaurant) {
  selectedRestaurant = restaurant;
  restaurantsView.classList.add('hidden');
  menuView.classList.remove('hidden');

  restaurantBanner.innerHTML = `
    <h2>${restaurant.name}</h2>
    <p style="margin-top:2px;">${restaurant.cuisine}</p>
    <div class="banner-meta">
      <span>Rating: ${restaurant.rating}</span>
      <span>Estimated Delivery: ${restaurant.deliveryTime}</span>
      <span>Delivery Fee: Rs. ${DELIVERY_FEE}</span>
    </div>
  `;

  document.querySelector('input[name="dietFilter"][value="all"]').checked = true;
  renderMenuItems('all');
}

function renderMenuItems(diet = 'all') {
  menuItemsGrid.innerHTML = '';
  if (!selectedRestaurant) return;

  let items = selectedRestaurant.menu;
  if (diet === 'veg') items = items.filter(i => i.isVeg);
  if (diet === 'non-veg') items = items.filter(i => !i.isVeg);

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-item-card';
    card.innerHTML = `
      <div>
        <div class="item-top">
          <span class="item-title">${item.name}</span>
          <span class="diet-tag ${item.isVeg ? 'veg' : 'non-veg'}">${item.isVeg ? 'Veg' : 'Non-Veg'}</span>
        </div>
        <p class="item-desc">${item.desc}</p>
      </div>
      <div class="item-bottom">
        <span class="item-price">Rs. ${item.price.toFixed(2)}</span>
        <button class="btn-add" data-id="${item.id}">+ Add</button>
      </div>
    `;

    card.querySelector('.btn-add').addEventListener('click', () => addToCart(item, selectedRestaurant.name));
    menuItemsGrid.appendChild(card);
  });
}

backToRestaurantsBtn.addEventListener('click', () => {
  menuView.classList.add('hidden');
  restaurantsView.classList.remove('hidden');
  selectedRestaurant = null;
});

restaurantSearch.addEventListener('input', (e) => {
  renderRestaurants(e.target.value);
});

dietFilterRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    renderMenuItems(e.target.value);
  });
});

function addToCart(item, restaurantName) {
  const existing = cart.find(c => c.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      restaurant: restaurantName,
      qty: 1
    });
  }
  saveCart();
  cartDrawer.classList.remove('hidden');
}

function updateItemQuantity(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
  }
  saveCart();
}

function updateCartUI() {
  const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
  cartBadge.textContent = totalItemsCount;

  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div style="text-align: center; color: #777; padding: 2rem 0.5rem; font-size: 0.9rem;">
        <p>Your cart is currently empty.</p>
      </div>
    `;
    cartSubtotal.textContent = 'Rs. 0.00';
    cartDeliveryFee.textContent = 'Rs. 0.00';
    cartGrandTotal.textContent = 'Rs. 0.00';
    checkoutBtn.disabled = true;
    return;
  }

  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">Rs. ${item.price} x ${item.qty} = Rs. ${itemTotal.toFixed(2)}</div>
      </div>
      <div class="cart-qty-controls">
        <button class="qty-btn dec-btn" data-id="${item.id}">-</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn inc-btn" data-id="${item.id}">+</button>
      </div>
    `;

    row.querySelector('.dec-btn').addEventListener('click', () => updateItemQuantity(item.id, -1));
    row.querySelector('.inc-btn').addEventListener('click', () => updateItemQuantity(item.id, 1));
    cartItemsContainer.appendChild(row);
  });

  const grandTotal = subtotal + DELIVERY_FEE;
  cartSubtotal.textContent = `Rs. ${subtotal.toFixed(2)}`;
  cartDeliveryFee.textContent = `Rs. ${DELIVERY_FEE.toFixed(2)}`;
  cartGrandTotal.textContent = `Rs. ${grandTotal.toFixed(2)}`;
  checkoutBtn.disabled = false;
}

cartBtn.addEventListener('click', () => {
  cartDrawer.classList.toggle('hidden');
});

closeCartBtn.addEventListener('click', () => {
  cartDrawer.classList.add('hidden');
});

checkoutBtn.addEventListener('click', () => {
  cartDrawer.classList.add('hidden');
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  modalPayableAmount.textContent = `Rs. ${(subtotal + DELIVERY_FEE).toFixed(2)}`;
  checkoutModal.classList.remove('hidden');
});

closeCheckoutModalBtn.addEventListener('click', () => {
  checkoutModal.classList.add('hidden');
});

orderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('custName').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const payment = document.getElementById('paymentMode').value;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal + DELIVERY_FEE;
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  const orderRecord = {
    orderId,
    name,
    address,
    phone,
    payment,
    items: [...cart],
    total: total.toFixed(2),
    timestamp: new Date().toLocaleString()
  };

  const existingOrders = JSON.parse(localStorage.getItem(STORAGE_ORDERS) || '[]');
  existingOrders.unshift(orderRecord);
  localStorage.setItem(STORAGE_ORDERS, JSON.stringify(existingOrders));

  cart = [];
  saveCart();

  checkoutModal.classList.add('hidden');
  confirmedOrderId.textContent = `#${orderId}`;
  confirmedOrderSummary.innerHTML = `
    <p><strong>Customer:</strong> ${name} (${phone})</p>
    <p><strong>Address:</strong> ${address}</p>
    <p><strong>Payment:</strong> ${payment}</p>
    <p><strong>Items:</strong> ${orderRecord.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</p>
    <p style="margin-top:4px;"><strong>Total Paid:</strong> Rs. ${orderRecord.total}</p>
  `;
  successModal.classList.remove('hidden');
  orderForm.reset();
});

closeSuccessBtn.addEventListener('click', () => {
  successModal.classList.add('hidden');
  menuView.classList.add('hidden');
  restaurantsView.classList.remove('hidden');
});

viewHistoryBtn.addEventListener('click', () => {
  renderHistory();
  historyModal.classList.remove('hidden');
});

closeHistoryModalBtn.addEventListener('click', () => {
  historyModal.classList.add('hidden');
});

function renderHistory() {
  const orders = JSON.parse(localStorage.getItem(STORAGE_ORDERS) || '[]');
  historyListContainer.innerHTML = '';

  if (orders.length === 0) {
    historyListContainer.innerHTML = '<p style="text-align:center; color:#888; padding:1.5rem;">No orders placed yet.</p>';
    return;
  }

  orders.forEach(ord => {
    const div = document.createElement('div');
    div.className = 'history-order-card';
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
        <strong>#${ord.orderId}</strong>
        <span style="font-size:0.75rem; color:#666;">${ord.timestamp}</span>
      </div>
      <div style="font-size:0.85rem; color:#444; margin-bottom:4px;">
        ${ord.items.map(i => `${i.name} x ${i.qty}`).join(', ')}
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.8rem; border-top:1px dashed #ccc; padding-top:4px;">
        <span>Payment: ${ord.payment}</span>
        <strong>Total: Rs. ${ord.total}</strong>
      </div>
    `;
    historyListContainer.appendChild(div);
  });
}

renderRestaurants();
updateCartUI();
