<img width="1867" height="904" alt="image" src="https://github.com/user-attachments/assets/c0b3c109-68a1-4162-8c92-96a3b35524f6" /># 💰 FinNexus — Intelligent Personal Finance & Expense Analytics Platform

FinNexus is a **full-stack MERN-based personal finance platform** designed to help users **track expenses, manage budgets, analyze spending patterns, and forecast future financial behavior**.

The system combines a **modern, responsive frontend dashboard** with a **production-grade backend**, emphasizing:

* 📊 Clear financial visibility
* 🧠 Deterministic analytics (no black-box logic)
* 🔮 Explainable prediction models
* ⚙️ Scalable and modular architecture

---

# Demo Profile
> Email- test123@gmail.com
> Password - test123

# 🚀 Live Demo

🔗 *https://finnexus-xi.vercel.app/*

---

# 📸 Screenshots

## 📊 Dashboard Overview

> <img width="1889" height="914" alt="image" src="https://github.com/user-attachments/assets/0e33c0a8-bb85-4a96-b985-3136c04aa55b" />

## 💳 AI Prediction Module

> <img width="1880" height="914" alt="image" src="https://github.com/user-attachments/assets/531e1310-5342-42a5-b530-50f1f29d3a2d" />


## 🔐 Role-Based UI (Admin vs Viewer)

> <img width="1872" height="913" alt="image" src="https://github.com/user-attachments/assets/cc7abfef-2f03-4011-9a95-fbd0be230392" />
> <img width="1867" height="904" alt="image" src="https://github.com/user-attachments/assets/fc55e52a-a959-448a-8582-70313c1b18fd" />


## 🌙 Dark Mode + Sidebar

> *<img width="1884" height="916" alt="image" src="https://github.com/user-attachments/assets/ef2842cc-3dce-4795-ba29-2c8ba6c96f2b" />
*

---

# 🧠 What This Project Demonstrates

* End-to-end **full-stack system design**
* Real-world **finance domain modeling**
* Clean **state management architecture**
* Strong **UI/UX decision making**
* Scalable **backend engineering practices**

---

# 🏗️ Tech Stack

## 🔹 Frontend

* React (Vite)
* Context API (Global State Management)
* Recharts (Data Visualization)
* Custom CSS (Responsive + Dark Mode)
* Lucide Icons

## 🔹 Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcrypt (Password Hashing)

---

# ✨ Frontend Features (Core + Enhancements)

---

## 📊 Dashboard Overview

* Financial Summary Cards:

  * Total Income
  * Total Expense
  * Budget Usage
  * Predicted Expense
* Monthly Expense Trend Visualization
* Real-time API integration

---

## 💳 Transactions Management

* Add / Edit / Delete transactions (**Admin only**)
* Smart Search
* Advanced Filtering:

  * Date range
  * Category
  * Type (Income / Expense)
* Sorting:

  * Amount
  * Date

---

## 🔐 Role-Based UI (Key Feature)

* **Admin → Full control (CRUD)**
* **Viewer → Read-only mode**

✔ UI dynamically adapts
✔ Viewer restriction banners
✔ Persisted via localStorage

---

## 🌙 Dark Mode (Advanced UX)

* Light / Dark theme toggle
* Persistent across sessions
* Implemented using global CSS variables

---

## 🧠 Global State Management

Centralized using **Context API**:

* Role management
* Theme control
* Permission abstraction (`isAdmin`)

✔ Clean separation of concerns
✔ Scalable architecture

---

## 📈 Insights & Visualization

* Monthly expense trends
* Budget utilization tracking
* Next-month expense prediction

---

## 📱 Responsive Design

* Mobile-first sidebar system
* Adaptive tables & charts
* Overflow and layout handling

---

## 🎯 UI/UX Highlights

* Minimal, clean dashboard layout
* Modal-driven interactions
* Visual feedback (colors, icons)
* Graceful empty states

---

# 🧩 Frontend Architecture

```
Frontend/
├── components/
│   ├── Dashboard.jsx
│   ├── Transactions.jsx
│   ├── Sidebar.jsx
│   ├── AppContext.jsx
│
├── styling/
│   ├── dashboard.css
│   ├── transaction.css
│
└── App.jsx
```

---

# 🔄 State Management Strategy

| State        | Handling               |
| ------------ | ---------------------- |
| Role         | Context + localStorage |
| Theme        | Context + localStorage |
| Transactions | API + local state      |
| Filters      | Component-level state  |

---

# ⚙️ Backend System

---

## 🎯 Core Objectives

* Secure authentication system
* Structured financial tracking
* Real-time budget insights
* Deterministic analytics engine
* Explainable prediction system
* Interview-grade backend architecture

---

## 👤 User Capabilities

* Register and authenticate securely
* Complete onboarding flow
* Set income and monthly budget
* Manage transactions (CRUD)
* Categorize expenses
* Track spending patterns
* View analytics & insights
* Get future expense predictions

---

## 🔐 Authentication & Authorization

* JWT-based authentication (7-day expiry)
* Password hashing using bcrypt
* Email normalization
* Duplicate user prevention (DB-safe)
* Protected routes via middleware
* Stateless logout (client-handled)

---

## 👤 User Management

### Features

* Register / Login
* Fetch authenticated user
* Update profile:

  * Name
  * Budget
  * Currency
  * Role (stored, not enforced at backend)

### Stored Attributes

* name, email, role
* monthlyIncome, monthlyBudget
* currency
* onboardingCompleted
* spendingPreferences

---

## 🚀 Onboarding System

* One-time onboarding flow
* Stores:

  * Monthly income
  * Monthly budget
  * Spending preferences
* Automatically generates categories
* Marks onboarding completion

---

## 💸 Transaction Management System

### Features

* Create transaction (income / expense)
* Strict validation (category required for expenses)
* Tag support (comma → array)
* Update with ownership validation
* Secure deletion
* Fetch transactions with filters

### Filtering Capabilities

* Date range (default: current month)
* Category
* Type
* Payment method

### Enhancements

* Category population (name, icon, color)
* Sorted by latest
* Strong validation & error handling

---

## 🗂️ Category System

* Auto-generated during onboarding
* Each category includes:

  * name
  * icon
  * color
* Used in analytics breakdown

---

## 📊 Budget Management System

### Features

* Set monthly budget
* Supports currency selection
* Prevents negative values

### Real-Time Status

* Total spent
* Remaining budget
* Usage percentage
* Overspend detection

---

## 📈 Analytics Engine

### 1. Monthly Summary

* Total income
* Total expense
* Net savings
* Top spending category

### 2. Category Breakdown

* Total spent per category
* Percentage contribution
* Handles missing data gracefully

### 3. Monthly Trend

* Last 12 months aggregation
* Used for visualization

---

## 🔮 Prediction System

**Endpoint:**
`GET /api/prediction/next-month`

### Features

* Predicts next-month expense
* Based on historical trends
* Uses linear regression

### Output

* predicted value
* slope (trend direction)
* intercept
* confidence score

### Fallback

```
{
  "predicted": 0,
  "confidence": 0,
  "method": "insufficient_data"
}
```

---

## 🧠 Design Philosophy

* Deterministic analytics (no black-box ML)
* Explainable predictions
* MongoDB aggregation-first design
* Service-layer abstraction
* API-first architecture

---

# 🏗️ Backend Architecture

```
Backend/
├── controllers/
├── models/
├── routes/
├── services/
├── middleware/
└── server.js
```

### Principles

* Thin controllers
* Reusable services
* Optimized DB queries
* Clean error handling

---

## 🗄️ Database Models

* User
* Transaction
* Category

✔ Indexed for performance
✔ Optimized for analytics queries

---

## 🔒 Security

* bcrypt hashing + salt
* JWT authentication
* Route protection
* Ownership validation
* Controlled data exposure
* Input validation

---

# ⚙️ Setup & Installation

---

## 🔧 Environment Variables

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
VITE_API_URL=http://localhost:5000
```

---

## 📦 Installation

```
git clone <repo-url>

# Backend
cd Backend
npm install

# Frontend
cd ../Frontend/my-app
npm install
```

---

## ▶️ Run Project

```
# Backend
cd Backend
npm start

# Frontend
cd Frontend/my-app
npm run dev
```

---

# 🧪 Edge Case Handling

* Empty transaction states
* API failures
* Viewer restrictions
* Invalid inputs
* Responsive overflow issues

---

# 🚀 Optional Enhancements Implemented

* ✅ Dark Mode
* ✅ Role-Based UI
* ✅ LocalStorage persistence
* ✅ Advanced filtering
* ✅ Responsive design



# 🛣️ Future Enhancements

* Recurring transactions
* Smart overspending alerts
* Multi-currency conversion
* AI-driven financial insights
* Export reports (CSV/PDF)
* Mobile app integration

---

# 📬 Author

**Viraj Vijay Padaval**
GitHub: *https://github.com/viraj42*
LinkedIn: *https://www.linkedin.com/in/virajpadaval/*

---

# 🏁 Final Note

FinNexus is built with a strong focus on:

* **clarity**
* **correctness**
* **scalability**

It serves not only as a functional product but also as a **high-quality demonstration of full-stack system design and real-world financial logic**.

---
