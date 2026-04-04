import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, CreditCard, Wallet, PieChart,
  Menu, X, Activity, TrendingUp, Moon, Sun, ShieldCheck, Eye
} from "lucide-react";
import "../src/styling/dashboard.css";
import Logo from "../public/assets/Logo.jpeg";
import { useApp } from "./AppContext";          // ← NEW

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const location = useLocation();

  // ── Context values ────────────────────────────────────────────────────────
  const { role, setRole, isAdmin, darkMode, toggleDarkMode } = useApp();

  // Close sidebar on mobile after navigation
  useEffect(() => {
    if (window.innerWidth <= 768) setIsOpen(false);
  }, [location]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navGroups = [
    {
      label: "Overview",
      items: [
        { path: "/dashboard",  icon: <LayoutDashboard size={20} />, label: "Dashboard" },
        { path: "/analytics",  icon: <Activity size={20} />,        label: "Analytics"  },
      ],
    },
    {
      label: "Finance",
      items: [
        { path: "/transaction", icon: <CreditCard size={20} />, label: "Transactions" },
        { path: "/budget",      icon: <PieChart size={20} />,   label: "Budgeting"    },
      ],
    },
    {
      label: "Insights",
      items: [
        { path: "/prediction", icon: <TrendingUp size={20} />, label: "AI Prediction"  },
        { path: "/goals",      icon: <Wallet size={20} />,     label: "Savings Goals" },
      ],
    },
  ];

  return (
    <>
      {/* Mobile hamburger trigger */}
      <div className="mobile-trigger" onClick={toggleSidebar}>
        <Menu size={24} />
      </div>

      {/* Mobile overlay backdrop */}
      {isOpen && window.innerWidth <= 768 && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}

      <aside className={`sb-container ${isOpen ? "sb-expanded" : "sb-collapsed"}`}>

        {/* ── Logo row ────────────────────────────────────────────────────── */}
        <div className="sb-header">
          <div className="sb-logo-row">
            {isOpen && (
              <div className="sb-brand-box">
                <img src={Logo} alt="Logo" className="sb-logo-img" />
                <span className="sb-brand-title">FinNexus</span>
              </div>
            )}
            <button className="sb-toggle-btn" onClick={toggleSidebar}>
              {isOpen && window.innerWidth <= 768 ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* ── Nav links ───────────────────────────────────────────────────── */}
        <nav className="sb-nav-area">
          {navGroups.map((group, index) => (
            <div key={index} className="sb-group">
              {isOpen && <h4 className="sb-group-header">{group.label}</h4>}
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sb-link-item ${location.pathname === item.path ? "sb-active" : ""}`}
                >
                  <span className="sb-icon-box">{item.icon}</span>
                  {isOpen && <span className="sb-link-text">{item.label}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* ── Bottom controls (role switcher + dark mode) ──────────────────── */}
        <div className="sb-bottom-controls">

          {/* Dark Mode Toggle */}
          <button
            className="sb-icon-btn"
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className="sb-icon-box">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </span>
            {isOpen && (
              <span className="sb-link-text">
                {darkMode ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>

          {/* Role Switcher */}
          {isOpen ? (
            <div className="sb-role-switcher">
              <span className="sb-role-label">View As</span>
              <div className="sb-role-pills">
                <button
                  className={`sb-role-pill ${role === "admin" ? "pill-active-admin" : ""}`}
                  onClick={() => setRole("admin")}
                >
                  <ShieldCheck size={13} /> Admin
                </button>
                <button
                  className={`sb-role-pill ${role === "viewer" ? "pill-active-viewer" : ""}`}
                  onClick={() => setRole("viewer")}
                >
                  <Eye size={13} /> Viewer
                </button>
              </div>
            </div>
          ) : (
            /* Collapsed: show a small role icon */
            <button
              className="sb-icon-btn"
              onClick={() => setRole(role === "admin" ? "viewer" : "admin")}
              title={`Switch to ${role === "admin" ? "Viewer" : "Admin"}`}
            >
              <span className="sb-icon-box">
                {role === "admin" ? <ShieldCheck size={20} /> : <Eye size={20} />}
              </span>
            </button>
          )}

        </div>
      </aside>
    </>
  );
}