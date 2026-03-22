import React, { useEffect } from 'react';
import './styling/home.css';
import { Link } from "react-router-dom";

// Import images
import ETE_Finance from "/assets/ETE_Finance.png";
import Modular_Backend from "/assets/Modular_Backend.png";
import ML_Powered from "/assets/ML_Powered.png";
import Advanced_Analytics from "/assets/Advanced_Analytics.png";
import Secure_Authentication from "/assets/Secure_Authentication.png";

const Home = () => {

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll('.scroll-card').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-wrapper">

      {/* NAVBAR — Reduced spacing */}
      <nav className="navbar" style={{ padding: "10px 40px", height: "60px" }}>
        <div className="logo" style={{ fontSize: "1.4rem", fontWeight: "600" }}>FinNexus</div>
        <div className="nav-buttons">
          <Link to="/login"><div className="btn-login">Login</div></Link>
          <Link to="/register"><div className="btn-signup">Get Started</div></Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero-section">
        <div className="hero-badge">AI-POWERED PERSONAL FINANCE SYSTEM</div>

        <h1 className="hero-title">
          Smarter Finance Begins  
          <br /> With <span>FinNexus</span>
        </h1>

        <p className="hero-subtitle">
          An intelligent platform that manages your income, expenses, budgets, 
          analytics, categories, and financial predictions—powered by real-time data 
          and machine learning.
        </p>

        <button className="cta-button">Explore Dashboard</button>
      </header>

      {/* FEATURES */}
      <section className="features-container">

        {/* CARD 1 – Full System Overview */}
        <div className="scroll-card card-left">
          <div className="card-content">
            <div className="icon-circle purple">🧭</div>
            <h3 className="card-title">End-to-End Finance Management</h3>
            <p className="card-desc">
              Track your income, expenses, categories, budgets, and transactions 
              seamlessly. Every action updates analytics, summaries, and reports in 
              real-time—making FinNexus a complete personal finance ecosystem.
            </p>
          </div>

          <div className="card-visual">
            <img src={ETE_Finance} alt="End-to-End Finance" style={{ width: "100%", borderRadius: "10px" }} />
          </div>
        </div>

        {/* CARD 2 – Modular Architecture */}
        <div className="scroll-card card-right">
          <div className="card-content">
            <div className="icon-circle yellow">🗂️</div>
            <h3 className="card-title">Modular Backend Architecture</h3>
            <p className="card-desc">
              Designed using MVC principles, the backend separates controllers, routes, 
              services, middleware, and database models—ensuring scalability, clarity, 
              and maintainability for future expansions.
            </p>
          </div>

          <div className="card-visual">
            <img src={Modular_Backend} alt="Modular Backend" style={{ width: "100%", borderRadius: "10px" }} />
          </div>
        </div>

        {/* CARD 3 – AI Prediction */}
        <div className="scroll-card card-left">
          <div className="card-content">
            <div className="icon-circle purple">🤖</div>
            <h3 className="card-title">ML-Powered Expense Prediction</h3>
            <p className="card-desc">
              Using a trained Linear Regression model, FinNexus forecasts next-month 
              expenses based on your last six months' spending data—offering accuracy, 
              slope/intercept insights, and prediction confidence (R²).
            </p>
          </div>

          <div className="card-visual">
            <img src={ML_Powered} alt="ML Prediction" style={{ width: "100%", borderRadius: "10px" }} />
          </div>
        </div>

        {/* CARD 4 – Analytics */}
        <div className="scroll-card card-right">
          <div className="card-content">
            <div className="icon-circle yellow">📊</div>
            <h3 className="card-title">Advanced Analytics & Insights</h3>
            <p className="card-desc">
              Get monthly summaries, category-wise breakdowns, trend lines, spending 
              habits, and overshoot detection. Visual reports powered by Recharts and 
              custom SVG dashboards ensure clarity and precision.
            </p>
          </div>

          <div className="card-visual">
            <img src={Advanced_Analytics} alt="Analytics" style={{ width: "100%", borderRadius: "10px" }} />
          </div>
        </div>

        {/* CARD 5 – Secure Authentication */}
        <div className="scroll-card card-left">
          <div className="card-content">
            <div className="icon-circle red">🔐</div>
            <h3 className="card-title">Secure Authentication & Protection</h3>
            <p className="card-desc">
              Every dashboard and financial module is fully protected using JWT 
              authentication, bcrypt-hashed passwords, and middleware-secured routes—
              ensuring that your financial data stays private and safe.
            </p>
          </div>

          <div className="card-visual">
            <img src={Secure_Authentication} alt="Security" style={{ width: "100%", borderRadius: "10px" }} />
          </div>
        </div>

      </section>

      <footer className="footer">
        © 2025 FinNexus — Full-Stack Finance Manager with ML Predictions.
      </footer>
    </div>
  );
};

export default Home;
