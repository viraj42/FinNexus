import React, { useState, useEffect } from "react";
import {
    Edit3, TrendingUp, TrendingDown, AlertCircle, CheckCircle, 
    DollarSign, PieChart, Activity, Wallet
} from "lucide-react";
import Sidebar from "./Sidebar"; 
import "../src/styling/dashboard.css"; 
import "../src/styling/budget.css"; 
import Loader from "./Loader"
export default function Budget() {
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State matching your Backend Response Structure
    const [budgetData, setBudgetData] = useState({
        monthlyBudget: 0,
        totalSpent: 0,
        remaining: 0,
        usagePercent: 0,
        currency: "INR",
        overshootRisk: false
    });

    // Form State for Update
    const [newBudgetLimit, setNewBudgetLimit] = useState("");

    // --- 1. Fetch Budget Status (GET) ---
    const fetchBudgetStatus = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/budget/status`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (res.ok) {
                setBudgetData({
                    monthlyBudget: data.monthlyBudget || 0,
                    totalSpent: data.totalSpent || 0,
                    remaining: data.remaining || 0,
                    usagePercent: Number(data.usagePercent) || 0,
                    currency: data.currency || "INR",
                    overshootRisk: data.overshootRisk || false
                });
                setNewBudgetLimit(data.monthlyBudget); // Pre-fill modal
            }
        } catch (error) {
            console.error("Failed to fetch budget", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgetStatus();
    }, []);

    // --- 2. Update Budget (PUT) ---
    const handleUpdateBudget = async () => {
        const token = localStorage.getItem("token");
        if (!token) return alert("Please login first");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/budget`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ 
                    monthlyBudget: Number(newBudgetLimit),
                    currency: budgetData.currency // Keeping existing currency for now
                })
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchBudgetStatus(); // Refresh data to update UI
            } else {
                alert("Failed to update budget");
            }
        } catch (error) {
            console.error("Error updating budget", error);
        }
    };

    // Helper to format currency
    const formatCurrency = (amount) => {
        // Simple formatter, you can replace with Intl.NumberFormat if needed
        const symbol = budgetData.currency === "USD" ? "$" : "₹";
        return `${symbol}${amount.toLocaleString()}`;
    };

    if (isLoading) {
        return <div >
            <Loader />
        </div>
    }

    return (
        <div className="app-container">
            <Sidebar />

            <main className="main-content">
                {/* --- Section A: Header --- */}
                <header className="top-navbar">
                    <div className="header-titles">
                        <h1>Budget</h1>
                        <p>Track your monthly spending limits</p>
                    </div>
                    <div className="header-actions">
                        {/* <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
                            <Edit3 size={16} /> Update Budget
                        </button> */}
                    </div>
                </header>

                <div className="budget-layout">
                    
                    {/* --- LEFT COLUMN: Summary Cards --- */}
                    <div className="budget-left-panel">
                        <div className="budget-cards-grid">
                            
                            {/* Card 1: Total Budget */}
                            <div className="budget-stat-card">
                                <div className="icon-wrapper blue">
                                    <Wallet size={24} />
                                </div>
                                <div className="stat-info">
                                    <span className="label">Total Budget</span>
                                    <h3>{formatCurrency(budgetData.monthlyBudget)}</h3>
                                </div>
                            </div>

                            {/* Card 2: Total Spent */}
                            <div className="budget-stat-card">
                                <div className="icon-wrapper orange">
                                    <TrendingDown size={24} />
                                </div>
                                <div className="stat-info">
                                    <span className="label">Total Spent</span>
                                    <h3>{formatCurrency(budgetData.totalSpent)}</h3>
                                </div>
                            </div>

                            {/* Card 3: Remaining */}
                            <div className="budget-stat-card">
                                <div className={`icon-wrapper ${budgetData.overshootRisk ? "red" : "green"}`}>
                                    <Activity size={24} />
                                </div>
                                <div className="stat-info">
                                    <span className="label">Remaining</span>
                                    <h3 className={budgetData.overshootRisk ? "text-red" : "text-green"}>
                                        {formatCurrency(budgetData.remaining)}
                                    </h3>
                                </div>
                            </div>

                            {/* Card 4: Usage Percentage */}
                            <div className="budget-stat-card">
                                <div className="icon-wrapper purple">
                                    <PieChart size={24} />
                                </div>
                                <div className="stat-info">
                                    <span className="label">Budget Used</span>
                                    <h3>{budgetData.usagePercent}%</h3>
                                </div>
                            </div>

                        </div>

                        {/* Optional: Add a text insight or tip below cards */}
                        <div className="budget-insight-box">
                            {budgetData.overshootRisk ? (
                                <p className="text-red"><AlertCircle size={16} style={{marginBottom:-3}}/> <strong>Warning:</strong> You have exceeded your monthly budget!</p>
                            ) : (
                                <p className="text-muted">You are doing great! You have spent <strong>{budgetData.usagePercent}%</strong> of your allocated budget.</p>
                            )}
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: Tracker (Same as before) --- */}
                    <aside className="budget-sidebar">
                        
                        {/* Monthly Overview Donut Chart */}
                        <div className="section-card summary-card">
                            <div className="card-header-row center-header">
                                <h3>Budget Tracker</h3>
                            </div>
                            
                            <div className="donut-chart-container">
                                <CircularProgress percentage={Math.min(100, budgetData.usagePercent)} color={budgetData.overshootRisk ? "#EA5455" : "#6C5DD3"} />
                                <div className="donut-inner-text">
                                    <span className="label">Spent</span>
                                    <span className="value">{formatCurrency(budgetData.totalSpent)}</span>
                                </div>
                            </div>

                            <div className="budget-status-row">
                                <div className="status-item">
                                    <span className="label">Limit</span>
                                    <span className="val">{formatCurrency(budgetData.monthlyBudget)}</span>
                                </div>
                                <div className="vertical-divider"></div>
                                <div className="status-item">
                                    <span className="label">Left</span>
                                    <span className={`val ${budgetData.remaining < 0 ? "text-red" : "text-green"}`}>
                                        {formatCurrency(budgetData.remaining)}
                                    </span>
                                </div>
                            </div>

                            {budgetData.overshootRisk ? (
                                <div className="alert-badge error">
                                    <AlertCircle size={14} /> Over Budget
                                </div>
                            ) : (
                                <div className="alert-badge success">
                                    <CheckCircle size={14} /> On Track
                                </div>
                            )}
                        </div>
                    </aside>
                </div>

                {/* --- Update Modal --- */}
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-container small-modal">
                            <div className="modal-header">
                                <h2>Set Monthly Budget</h2>
                                <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
                            </div>
                            <div className="modal-body">
                                <label>Total Amount ({budgetData.currency})</label>
                                <div className="input-group">
                                    <span className="prefix">{budgetData.currency === "USD" ? "$" : "₹"}</span>
                                    <input 
                                        type="number" 
                                        value={newBudgetLimit} 
                                        onChange={(e) => setNewBudgetLimit(e.target.value)} 
                                        placeholder="Enter amount"
                                    />
                                </div>
                                <button className="submit-btn full-width" onClick={handleUpdateBudget}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

/* --- Circular Progress Component (Unchanged) --- */
const CircularProgress = ({ percentage, color }) => {
    const radius = 70; // Slightly larger
    const stroke = 14;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="circular-chart-wrapper">
            <svg height={radius * 2} width={radius * 2}>
                <circle
                    stroke="#e2e8f0"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke={color}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className="progress-ring-circle"
                />
            </svg>
        </div>
    );
};