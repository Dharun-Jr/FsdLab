# CS1510 - Full Stack Development Laboratory

This repository contains all **10 completed frontend laboratory experiments** for the **CS1510 Full Stack Development Laboratory** course. Every application has been crafted strictly using standard **HTML5, CSS3, and Vanilla JavaScript**, with **zero external dependencies, zero frameworks, and zero npm build tools**.

All data persistence (user accounts, session states, tasks, posts, shopping baskets, orders, leave records, and survey submissions) is implemented using the browser's native `localStorage` API.

---

## 📂 Laboratory Folder Structure

```
CS1510-Full-Stack-Lab/
├── 01-Webpage/               # Experiment 1: Simple Responsive Webpage
│   ├── index.html
│   ├── style.css
│   └── script.js
├── 02-Chat-Module/           # Experiment 2: Campus Bot Assistant
│   ├── index.html
│   ├── style.css
│   └── script.js
├── 03-Calculator/            # Experiment 3: Arithmetic Calculator
│   ├── index.html
│   ├── style.css
│   └── script.js
├── 04-Todo-Management/       # Experiment 4: Multi-User Todo Application
│   ├── index.html
│   ├── style.css
│   └── script.js
├── 05-Microblogging/         # Experiment 5: MiniBlog Social Platform
│   ├── index.html
│   ├── style.css
│   └── script.js
├── 06-Food-Delivery/         # Experiment 6: QuickBite Express Food Delivery
│   ├── index.html
│   ├── style.css
│   └── script.js
├── 07-Shopping-Cart/         # Experiment 7: CampusStore E-Commerce Portal
│   ├── index.html
│   ├── style.css
│   └── script.js
├── 08-Leave-Management/      # Experiment 8: Staff & Faculty Leave Portal
│   ├── index.html
│   ├── style.css
│   └── script.js
├── 09-Project-Dashboard/     # Experiment 9: TaskFlow Project Scrum Board
│   ├── index.html
│   ├── style.css
│   └── script.js
├── 10-Online-Survey/         # Experiment 10: Academic Course Survey
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md                 # Lab documentation and run instructions
```

---

## 🚀 How to Run the Applications

No installation, Node.js, server, or configuration is required!

### Method 1: Direct Browser Launch (Simplest)
1. Navigate into any experiment folder (e.g., `01-Webpage` or `03-Calculator`).
2. Double-click `index.html` to open it in any modern browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

### Method 2: VS Code Live Server Extension
1. Open the folder `CS1510-Full-Stack-Lab` in Visual Studio Code.
2. Install the **Live Server** extension (by Ritwick Dey) if not already installed.
3. Right-click on any experiment's `index.html` and choose **"Open with Live Server"**.

---

## 📑 Detailed Experiment Summary

### 1. `01-Webpage` — Simple Responsive Webpage
- **Aim:** Design a responsive academic webpage utilizing semantic HTML5 tags and CSS3 Flexbox.
- **Features:**
  - Dark-blue header (`#0a3663`) and light-blue background (`#e6f2ff`).
  - Institutional logo, welcome message, and external link to the college website.
  - Complete Aim, Algorithm (7 steps), and Result documentation cards.
  - Dynamic live clock/date display and high-contrast toggle in `script.js`.
- **Exam Explanation Focus:** Semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`) and CSS Flexbox alignment (`display: flex`, `justify-content: center`).

---

### 2. `02-Chat-Module` — Campus Bot Assistant
- **Aim:** Build a client-side conversational chat interface with rule-based responses.
- **Features:**
  - Messenger card layout with distinctive user and bot speech bubbles.
  - Enter key and Send button message submission.
  - Predefined replies for queries like `hello`, `how are you`, `bye`, `what is cs1510`, `time`, and `help`.
  - Generic fallback response for unrecognized queries.
  - Automatic scrolling (`chatBody.scrollTop = chatBody.scrollHeight`).
  - Chat history persistence in `localStorage` with a "Clear Chat" option.
  - Quick-prompt suggestions chips.
- **Exam Explanation Focus:** Event listeners on form submit/keypress, string parsing with `.toLowerCase()` and `.includes()`, DOM manipulation via `document.createElement()`.

---

### 3. `03-Calculator` — Arithmetic Calculator
- **Aim:** Develop a two-operand arithmetic calculator with robust input validation.
- **Features:**
  - Addition (`+`), Subtraction (`-`), Multiplication (`×`), and Division (`÷`).
  - Strict input validation ensuring both operands are valid numeric entries.
  - Explicit division-by-zero check (`num2 === 0`) displaying clear error feedback.
  - IEEE 754 precision rounding using `.toFixed()` to prevent floating-point artifacts.
  - Operation history logged to `localStorage` with a clear log option.
- **Exam Explanation Focus:** Parsing form values with `Number()`, conditional branches with `switch`, handling mathematical edge cases.

---

### 4. `04-Todo-Management` — Multi-User Todo Management
- **Aim:** Construct a todo app featuring user authentication and user-isolated task storage.
- **Features:**
  - Registration and Login system; seeded demo users `student1` and `student2` (password: `123456`).
  - Each user's tasks stored separately in `localStorage` (`cs1510_tasks_${username}`).
  - Add tasks with priority tags (High, Normal, Low).
  - Toggle completion status, delete individual tasks, or clear all completed tasks.
  - Dynamic status counters: Total Tasks, Pending, and Completed.
  - Filter by All, Pending, or Completed.
- **Exam Explanation Focus:** User isolation with dynamic `localStorage` keys, array manipulation (`filter`, `map`, `unshift`), state-driven rendering.

---

### 5. `05-Microblogging` — MiniBlog Social Platform
- **Aim:** Implement a client-side microblogging web application with social interactions.
- **Features:**
  - User authentication with profile bio (Demo users: `alice`, `bob`, `charlie` / `123456`).
  - Post composer with a 280-character live counter.
  - Dual feed view: **Public Feed (All)** vs **Following Feed**.
  - Follow / Unfollow directory of community members.
  - Post like/unlike toggle and threaded comments section for each post.
  - Modal user profile inspection displaying authored posts, follower count, and following count.
- **Exam Explanation Focus:** Relational data structures stored as JSON in `localStorage`, array lookups, modal dialog toggling.

---

### 6. `06-Food-Delivery` — QuickBite Express Food Delivery
- **Aim:** Create a campus food delivery portal simulating menu navigation, shopping cart, and order placement.
- **Features:**
  - 4 campus restaurants with distinct cuisines, ratings, and delivery estimates.
  - Search filter by restaurant name and cuisine.
  - Restaurant menu view with Veg / Non-Veg filter toggle.
  - Side cart drawer showing itemized subtotals, quantity adjustments (`+` / `-`), and flat delivery fees.
  - Order placement modal capturing customer name, hostel room, phone, and payment mode.
  - Order confirmation receipt with unique `#ORD-XXXXXX` reference ID.
  - Order history saved to `localStorage`.
- **Exam Explanation Focus:** Multi-view DOM switching, accumulator calculations (`reduce` for cart subtotals), form validation.

---

### 7. `07-Shopping-Cart` — CampusStore E-Commerce Portal
- **Aim:** Build an e-commerce shopping cart system with separate catalogue and cart views.
- **Features:**
  - User authentication with session state (Demo user: `shopper1` / `123456`).
  - Product catalogue spanning Electronics, Stationery, Books, and Accessories.
  - Category filter pills and live search bar.
  - Dedicated cart review view with item table, unit price, quantity modifier, and stock limits.
  - Automatic pricing calculation: Subtotal, 5% Student Discount, 10% GST Tax, and Net Payable.
  - Checkout invoice modal displaying receipt number, timestamp, and purchased item breakdown.
- **Exam Explanation Focus:** Separation of views without page reload, financial calculations, cart synchronization with badge notifications.

---

### 8. `08-Leave-Management` — Staff & Faculty Leave Portal
- **Aim:** Develop an employee leave management portal with quota tracking and cancellation refunds.
- **Features:**
  - Employee sign-in / registration (Demo account: `emp101` / `123456`).
  - Sample quotas: **Casual Leave = 12 Days**, **Medical Leave = 10 Days**.
  - Date inputs with automatic date math (`Math.round((end - start) / 1 day) + 1`).
  - Validation blocking requests when duration exceeds remaining quota or end date precedes start date.
  - Live progress bars for remaining balances.
  - Leave history table with "Approved" badges.
  - **Cancel & Refund action:** Cancelling any approved leave immediately refunds the days back to the employee's quota!
- **Exam Explanation Focus:** Date object manipulation in JavaScript, input boundary validation, rollback/refund transactions in client state.

---

### 9. `09-Project-Dashboard` — TaskFlow Agile Project Board
- **Aim:** Implement a project management dashboard for tracking tasks across agile states.
- **Features:**
  - User authentication (Demo user: `manager1` / `123456`).
  - Task fields: Title, Description, Assignee, Priority (High/Medium/Low), Due Date, and Status.
  - Status progression: `Pending` &rarr; `In Progress` &rarr; `Completed`.
  - Statistics metrics row: Total Tasks, Pending count, In Progress count, Completed count, and Completion Rate (%).
  - Search filter and dropdown filters for Status and Priority.
  - Create and Edit modals with form pre-population.
  - Delete task action with confirmation.
- **Exam Explanation Focus:** Full CRUD (Create, Read, Update, Delete) architecture in pure JavaScript, dynamic UI metric calculations.

---

### 10. `10-Online-Survey` — Academic Course Survey
- **Aim:** Create an online survey application with random question sampling and an administrative review panel.
- **Features:**
  - Bank of 12 questions containing both Multiple-Choice (radio) and free-text opinion questions.
  - **Randomization:** Automatically samples **exactly 5 questions** each session using the Fisher-Yates algorithm.
  - Re-shuffle button to load 5 fresh questions on demand.
  - Form validation: Ensures all 5 questions are answered before submission, highlighting missed questions in red.
  - Submission receipt with unique `#SRV-XXXXX` reference.
  - **Admin View / Inspector:** Switch to inspect all submitted student responses, view overall metrics, and audit answer payloads.
- **Exam Explanation Focus:** Fisher-Yates shuffle algorithm (`Math.random()`), radio button group validation, dual-mode UI (Participant vs Administrator).

---

## 🛠️ Technology Stack
- **HTML5:** Semantic layout tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<form>`).
- **CSS3:** Modern responsive styling, CSS Flexbox, CSS Grid, media queries, CSS variables.
- **Vanilla JavaScript (ES6+):** Arrow functions, template literals, array methods (`map`, `filter`, `reduce`, `find`, `slice`), `localStorage` API, DOM event handling.

---

## 🎓 Tips for Lab Exam & Viva Voce
1. **Explain `localStorage`:**
   - Writing data: `localStorage.setItem('key', JSON.stringify(object))`
   - Reading data: `JSON.parse(localStorage.getItem('key') || '[]')`
   - Clearing data: `localStorage.removeItem('key')`
2. **Explain Flexbox vs Grid:**
   - Flexbox is 1-dimensional (used in navigation bars, centered cards, and button groups).
   - Grid is 2-dimensional (used in restaurant lists, product catalogues, and metric cards).
3. **Explain Event Handling:**
   - Using `addEventListener('submit', (e) => { e.preventDefault(); ... })` prevents default form submission and page reload.
4. **Explain Input Validation:**
   - Always sanitize string inputs using `.trim()`.
   - Validate numbers using `isNaN()` and check edge conditions like division by zero.

