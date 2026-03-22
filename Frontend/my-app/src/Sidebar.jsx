import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, CreditCard, Wallet, PieChart, Settings, HelpCircle, Menu, X, Activity, TrendingUp } from "lucide-react";
import "../src/styling/dashboard.css";
import Logo from '../public/assets/Logo.jpeg';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const location = useLocation();

  useEffect(() => {
    if (window.innerWidth <= 768) setIsOpen(false);
  }, [location]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navGroups = [
    { label: "Overview", items: [{ path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" }, { path: "/analytics", icon: <Activity size={20} />, label: "Analytics" }] },
    { label: "Finance", items: [{ path: "/transaction", icon: <CreditCard size={20} />, label: "Transactions" }, { path: "/budget", icon: <PieChart size={20} />, label: "Budgeting" }] },
    { label: "Insights", items: [{ path: "/prediction", icon: <TrendingUp size={20} />, label: "AI Prediction" }, { path: "/goals", icon: <Wallet size={20} />, label: "Savings Goals" }] }
  ];

  return (
    <>
      <div className="mobile-trigger" onClick={toggleSidebar}><Menu size={24} /></div>
      {isOpen && window.innerWidth <= 768 && <div className="sidebar-overlay" onClick={toggleSidebar} />}
      <aside className={`sb-container ${isOpen ? "sb-expanded" : "sb-collapsed"}`}>
        <div className="sb-header">
          <div className="sb-logo-row">
            {isOpen && <div className="sb-brand-box"><img src={Logo} alt="Logo" className="sb-logo-img" /><span className="sb-brand-title">FinNexus</span></div>}
            <button className="sb-toggle-btn" onClick={toggleSidebar}>{isOpen && window.innerWidth <= 768 ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
        <nav className="sb-nav-area">
          {navGroups.map((group, index) => (
            <div key={index} className="sb-group">
              {isOpen && <h4 className="sb-group-header">{group.label}</h4>}
              {group.items.map((item) => (
                <Link key={item.path} to={item.path} className={`sb-link-item ${location.pathname === item.path ? "sb-active" : ""}`}><span className="sb-icon-box">{item.icon}</span>{isOpen && <span className="sb-link-text">{item.label}</span>}</Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}