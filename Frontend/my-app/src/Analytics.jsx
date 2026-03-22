import React, { useEffect, useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts";
import {
    TrendingUp, TrendingDown, DollarSign, Wallet, Activity
} from "lucide-react";
import Sidebar from "./Sidebar";
import "../src/styling/analytics.css";
import Loader from "./Loader";

export default function Analytics() {
    const [summary, setSummary] = useState(null);
    const [breakdown, setBreakdown] = useState([]);
    const [trend, setTrend] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Analytics Data
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            const headers = { Authorization: `Bearer ${token}` };

            try {
                const [resSum, resCat, resTrend] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/analytics/summary`, { headers }),
                    fetch(`${import.meta.env.VITE_API_URL}/api/analytics/category-breakdown`, { headers }),
                    fetch(`${import.meta.env.VITE_API_URL}/api/analytics/monthly-trend`, { headers })
                ]);

                const dSum = await resSum.json();
                const dCat = await resCat.json();
                const dTrend = await resTrend.json();

                setSummary(dSum);

                // Ensure fallback colors for categories
                const COLORS = ["#6C5DD3", "#FF9F43", "#00CFE8", "#28C76F", "#EA5455", "#1B2850"];
                const coloredCats = (dCat.categories || []).map((c, idx) => ({
                    ...c,
                    color: c.color && c.color !== "#000000"
                        ? c.color
                        : COLORS[idx % COLORS.length]
                }));

                setBreakdown(coloredCats);

                // Format trend data (convert "11-2025" → "Nov")
                const formattedTrend = (dTrend.trend || []).map(t => {
                    const [month, year] = t.month.split('-');
                    const date = new Date(year, month - 1);
                    return {
                        name: date.toLocaleString('default', { month: 'short' }),
                        total: t.total
                    };
                });
                setTrend(formattedTrend);


            } catch (err) {
                console.error("Error fetching analytics:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div >
            <Loader />
        </div>
    }

    const COLORS = ["#6C5DD3", "#FF9F43", "#00CFE8", "#28C76F", "#EA5455", "#1B2850"];

    return (
        <div className="app-container">
            <Sidebar />

            <main className="main-content">
                {/* Header */}
                <header className="top-navbar">
                    <div className="header-titles">
                        <h1>Financial Analytics</h1>
                        <p>Overview of your financial health and spending habits</p>
                    </div>
                    <div className="header-actions">
                        {/* <span className="current-date-badge">
                            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span> */}
                    </div>
                </header>

                {/* ⭐ SECTION 1 — Summary Cards */}
                <div className="analytics-summary-grid">
                    <SummaryCard
                        title="Total Income"
                        amount={summary?.totalIncome}
                        icon={<DollarSign size={24} />}
                        color="green"
                        subtext="Earnings this month"
                    />
                    <SummaryCard
                        title="Total Spent"
                        amount={summary?.totalExpense}
                        icon={<TrendingDown size={24} />}
                        color="red"
                        subtext="Expenses this month"
                    />
                    <SummaryCard
                        title="Net Savings"
                        amount={summary?.netSavings}
                        icon={<Wallet size={24} />}
                        color="blue"
                        subtext="Income - Expense"
                    />
                    <div className="stat-card">
                        <div className="stat-icon text-purple"><Activity size={24} /></div>
                        <div className="stat-content">
                            <span className="stat-title">Top Category</span>
                            <h3 className="stat-value text-capitalize">
                                {summary?.topCategory?.name || "N/A"}
                            </h3>
                            <p className="stat-subtext">
                                ₹{summary?.topCategory?.amount?.toLocaleString() || 0} spent
                            </p>
                        </div>
                    </div>
                </div>

                {/* ⭐ SECTION 2 — Category Breakdown */}
                <div className="charts-grid-layout">

                    <div className="section-card chart-card">
                        <div className="card-header">
                            <h3>Expense Breakdown</h3>
                        </div>

                        <div className="breakdown-content">
                            {/* Donut chart */}
                            <div className="pie-chart-wrapper">
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={breakdown}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="amount"
                                        >
                                            {breakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `₹${value}`} />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="chart-center-text">
                                    <span>Total</span>
                                    <h5>₹{summary?.totalExpense?.toLocaleString()}</h5>
                                </div>
                            </div>

                            {/* Category list */}
                            <div className="category-list-scroll">
                                {breakdown.map((item, index) => (
                                    <div className="cat-list-item" key={item.categoryId}>
                                        <div className="cat-item-left">
                                            <div className="cat-color-dot" style={{ backgroundColor: item.color }}></div>
                                            <div className="cat-details">
                                                <span className="cat-name">{item.name}</span>
                                                <span className="cat-percent text-muted">{item.percentage}%</span>
                                            </div>
                                        </div>
                                        <span className="cat-amount">₹{item.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ⭐ SECTION 3 — Monthly Trend */}
                    <div className="section-card chart-card">
                        <div className="card-header">
                            <h3>Spending Trends</h3>
                        </div>

                        <div className="trend-chart-wrapper">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={trend} 
  onTouchStart={(e) => e && e.preventDefault()}   // ✅ enable touch
  onTouchMove={(e) => e && e.preventDefault()}
                                >
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6C5DD3" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6C5DD3" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                                    <YAxis tick={{ fill: '#94a3b8' }} />
                                    <Tooltip formatter={(value) => [`₹${value}`, "Spent"]} />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#6C5DD3"
                                        strokeWidth={3}
                                        fill="url(#colorTotal)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                </div>

                {/* ⭐ NEW SECTION — Category Ring Charts */}
                <div className="section-card category-rings-section">
                    <h3 className="section-title">Category Performance</h3>

                    <div className="rings-grid">
                        {breakdown.map((cat, index) => (
                            <div className="ring-card" key={cat.categoryId}>
                                <ResponsiveContainer width={120} height={120}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { value: Number(cat.percentage) },
                                                { value: 100 - Number(cat.percentage) }
                                            ]}
                                            startAngle={90}
                                            endAngle={-270}
                                            innerRadius={40}
                                            outerRadius={55}
                                            dataKey="value"
                                        >
                                            <Cell fill={cat.color} />
                                            <Cell fill="#e2e8f0" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="ring-label">
                                    <p className="ring-title">{cat.name}</p>
                                    <p className="ring-percent">{cat.percentage}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
}

/* Reusable Summary Card */
const SummaryCard = ({ title, amount, icon, color, subtext }) => (
    <div className="stat-card">
        <div className={`stat-icon text-${color}`}>{icon}</div>
        <div className="stat-content">
            <span className="stat-title">{title}</span>
            <h3 className={`stat-value ${amount < 0 ? 'text-red' : ''}`}>
                ₹{amount?.toLocaleString() || 0}
            </h3>
            <p className="stat-subtext">{subtext}</p>
        </div>
    </div>
);
