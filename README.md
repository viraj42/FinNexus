# 💰 FinNexus — Intelligent Personal Finance & Expense Analytics Platform

FinNexus is a full-stack MERN-based personal finance management system designed to help users track expenses, manage budgets, analyze spending patterns, and forecast future financial behavior.

The system emphasizes **clean financial tracking, deterministic analytics, and explainable prediction models**, avoiding black-box complexity while maintaining production-grade backend architecture.

---

# 🎯 Project Objectives

* Secure and scalable user authentication system (JWT-based)
* Structured financial tracking (income, expenses, categories)
* Monthly budgeting with real-time usage insights
* Deterministic analytics (no hidden logic)
* Predictive expense modeling using historical trends
* Clean, modular, and interview-grade backend architecture

---

# 👤 User Capabilities

### Core Features

* Register and authenticate securely
* Complete onboarding with financial preferences
* Set monthly income and budget
* Create, update, delete transactions
* Categorize expenses with custom categories
* Track monthly spending and savings
* View analytics and trends
* Get future expense predictions

---

# 🔐 Authentication & Authorization

* JWT-based authentication
* Token expires in **7 days**
* Password hashing using **bcrypt**
* Email normalization to prevent duplication
* Duplicate user prevention via DB-level constraint (race-condition safe)
* Protected routes using middleware
* Stateless logout (handled client-side)

---

# 👤 User Management

### Implemented Features

* User registration with secure password hashing
* Login with optimized DB queries (`select +passwordHash`)
* Fetch current authenticated user
* Fetch user by ID
* Update user profile:

  * Name
  * Monthly budget
  * Currency
  * Role (stored but not enforced)

### Stored User Attributes

* name
* email
* role
* monthlyIncome
* monthlyBudget
* currency
* onboardingCompleted
* spendingPreferences

---

# 🚀 Onboarding System

* One-time onboarding flow
* Stores:

  * Monthly income
  * Monthly budget
  * Spending preferences
* Automatically generates **custom categories** from preferences
* Marks onboarding as completed

---

# 💸 Transaction Management System

### Features

* Create transaction (income / expense)
* Expense requires category (strict validation)
* Automatic date handling
* Tag support (comma-separated → array conversion)
* Update transaction with ownership validation
* Delete transaction securely
* Fetch transactions with filtering

### Filtering Capabilities

* Date range (default = current month)
* Category
* Type (income / expense)
* Payment method

### Enhancements

* Category population (name, icon, color)
* Sorted by latest transactions
* Strong validation and error handling

---

# 🗂️ Category System

* Custom categories generated during onboarding
* Each category includes:

  * name
  * icon (default)
  * color (default)
* Linked with transactions
* Used in analytics breakdown

---

# 📊 Budget Management System

### Update Budget

* Set monthly budget
* Supports currency selection
* Prevents negative budget values

### Budget Status (Real-Time)

Calculates for current month:

* Total spent
* Remaining budget
* Usage percentage
* Overshoot detection

### Overspend Detection

```text
overshootRisk = remaining < 0
```

---

# 📈 Analytics Engine

## 1. Monthly Summary

Provides:

* Total income
* Total expense
* Net savings
* User-defined monthly income
* Top spending category

### Top Category Logic

* Aggregates expenses
* Sorts by highest spending
* Fetches category metadata

---

## 2. Category Breakdown

* Groups expenses by category
* Calculates:

  * Total spent per category
  * Percentage contribution
* Handles missing categories gracefully
* Includes:

  * category name
  * icon
  * color

---

## 3. Monthly Trend (Last 12 Months)

* Aggregates expenses month-wise
* Returns chronological trend data
* Used for visualization (charts)

---

# 🔮 Prediction System (Advanced Feature)

### Endpoint:

`GET /api/prediction/next-month`

### Features:

* Predicts next month expense
* Uses **historical transaction data**
* Supports configurable history window (1–12 months)

### Model Output:

* predicted expense
* slope (trend direction)
* intercept
* confidence score
* method used (default: linear regression)

### Fallback Handling

If insufficient data:

```json
{
  "predicted": 0,
  "confidence": 0,
  "method": "insufficient_data"
}
```

---

# 🧠 Design Philosophy

* Deterministic analytics (no ML black boxes)
* Explainable predictions
* Clean aggregation pipelines (MongoDB)
* Separation of concerns (controllers/services)
* API-first architecture

---

# 🏗️ Backend Architecture

### Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcrypt (password hashing)

### Structure

```bash
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
* Reusable services (prediction logic)
* Aggregation-heavy analytics
* Clean error handling
* Optimized DB queries

---

# 🗄️ Database Models

* User
* Transaction
* Category

### Indexed for:

* User-based queries
* Monthly aggregations
* Transaction filtering
* Analytics pipelines

---

# 🔒 Security

* Password hashing (bcrypt + salt)
* JWT authentication
* Protected API routes
* Ownership validation (userId checks)
* Controlled data exposure (`select -passwordHash`)
* Input validation across endpoints

---

# 🚀 Project Outcomes

* Fully functional personal finance system
* Real-world budgeting and expense tracking logic
* Advanced analytics using MongoDB aggregation
* Explainable prediction engine
* Clean full-stack architecture
* Strong portfolio-ready project

---

# ⚙️ Setup & Installation

# ENV Setup
  PORT=5000
  MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/fintrack
  JWT_SECRET=your_super_secret_key

```bash
# Clone repository
git clone <repo-url>

# Install backend
cd Backend
npm install

# Install frontend
cd ../Frontend/my-app
npm install

# Setup environment variables
Refer .env.example

# Run backend
cd Backend
npm start

# Run frontend
cd Frontend/my-app
npm start
```

---

# 🛣️ Future Enhancements

* Recurring transactions (subscriptions)
* Smart alerts for overspending
* Multi-currency conversion
* AI-based financial insights
* Export reports (PDF/CSV)
* Mobile app integration
* Real-time notifications

---

# 💡 Final Note

FinNexus is built with a focus on **clarity, correctness, and scalability**—making it not just a functional product, but a strong demonstration of backend system design and real-world financial logic.

---
