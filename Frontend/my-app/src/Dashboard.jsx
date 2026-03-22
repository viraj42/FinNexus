import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, CreditCard, Wallet, Target, PieChart, Settings,
  HelpCircle, LogOut, Search, Bell, ChevronDown, TrendingUp,
  TrendingDown, DollarSign, Activity, Filter, Plus, X,
  ShoppingBag, Coffee, Home, Zap, Briefcase, Smartphone,
  IndianRupee
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import '../src/styling/dashboard.css';
import { useNavigate, Link, data } from 'react-router-dom';
import Sidebar from './Sidebar';

const defaultForm = {
  title: '',
  amount: '',
  type: 'expense',
  categoryId: '',
  paymentMethod: 'other',
  date: new Date().toISOString().split('T')[0],
  notes: '',
  tags: ''
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  
  const [summary, setSummary] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [predictData,setPredictionData]=useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  /* ✅ FIX: REFRESH USER AFTER ONBOARDING */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data?.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      })
      .catch(err => console.error("User refresh error:", err));
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  

  /* FETCH CATEGORIES */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => res.json())
      .then(data => {
        const cats = Array.isArray(data) ? data : data.categories || [];
        setCategories(cats);
      })
      .catch(err => console.error('Error fetching categories', err));
  }, []);

  /* FETCH RECENT TRANSACTIONS */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => res.json())
      .then(data => {
        if (!data || !data.transactions) return;
        const mapped = data.transactions.map(tx => ({
          id: tx._id,
          name: tx.title || (tx.notes ? tx.notes.split(" ")[0] : "Transaction"),
          amount: tx.amount,
          type: tx.type,
          category: tx.categoryId?.name || "Category",
          categoryIcon: <Activity size={16} />,
          method: tx.paymentMethod,
          date: tx.date.split("T")[0],
          note: tx.notes || ""
        }));
        setTransactions(mapped);
      })
      .catch(err => console.error("Error fetching transactions:", err));
  }, []);

    // FETCH DATA FROM REAL BACKEND
    useEffect(() => {
      const fetchPrediction = async () => {
        try {
          const token = localStorage.getItem("token");
  
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/prediction/next-month`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          
  
          const data = await response.json();
             console.log(data.predicted);
  
          if (!data.success) {
            console.error("Prediction API Error:", data.error);
            setPredictionData(null);
          } else {
            setPredictionData(data.predicted);
          }
  
        } catch (err) {
          console.error("Prediction Fetch Failed:", err);
          setPredictionData(null);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPrediction();
    }, []);

  /* FETCH REAL SUMMARY (income + expense) */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/analytics/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => res.json())
      .then(data => setSummary(data))
      .catch(err => console.error("Summary API Error:", err));
  }, []);

  /* FETCH REAL BUDGET STATUS */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/budget/status`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => res.json())
      .then(data => setBudgetData(data))
      .catch(err => console.error("Budget API Error:", err));
  }, []);

  /* FETCH REAL MONTHLY TREND FOR CHART */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/analytics/monthly-trend`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => res.json())
      .then(data => {
        const formatted = (data.trend || []).map(t => {
          const [month, year] = t.month.split('-');
          const date = new Date(year, month - 1);
          return {
            month: date.toLocaleString('default', { month: 'short' }),
            expense: t.total
          };
        });
        setTrendData(formatted);
      })
      .catch(err => console.error("Trend API Error:", err));
  }, []);

  /* UI handlers unchanged */
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* CREATE TRANSACTION */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert('Login required');

      const payload = {
        ...formData,
        amount: Number(formData.amount),
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : []
      };

      // 🔥 IMPORTANT FIX
      if (payload.type === "income") {
        delete payload.categoryId;
      }


      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Error creating transaction");

      const tx = data.transaction;
      const newTxn = {
        id: tx._id,
        name: tx.title,
        amount: tx.amount,
        type: tx.type,
        category: tx.type === "income" ? "-" : tx.categoryId?.name,
        categoryIcon: <Activity size={16} />,
        method: tx.paymentMethod,
        date: tx.date.split("T")[0],
        note: tx.notes
      };

      setTransactions(prev => [newTxn, ...prev]);
      setIsModalOpen(false);
      setFormData(defaultForm);
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  const filteredTransactions = transactions.filter(t =>
    (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.note || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

      const formatCurrency = (val) => {
      return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0
      }).format(val);
    };

  const setNavigate=()=>{
    navigate("/settings")
  }

  return (
    <div className="app-container">

      <Sidebar />

      <main className="main-content">

<header className="top-navbar">
  <div className="header-titles">
    {/* CSS handles the margin-left to avoid overlap with trigger */}
    <h1>Dashboard</h1>
    <p>Welcome Back!!</p>
  </div>


  <div className="header-controls">
    <div className="user-profile clickable" onClick={() => navigate("/settings")}>
      <img 
        src="https://www.shutterstock.com/image-vector/default-avatar-social-media-display-600nw-2632690107.jpg" 
        alt="User" 
      />
      {/* user-info is hidden via CSS on mobile for alignment */}
      <div className="user-info" onClick={setNavigate}>
        <span className="user-name">{user?.name || "User"}</span>
        <span className="user-email">{user?.email || ""}</span>
      </div>
    </div>
  </div>
</header>

        <div className="dashboard-viewport">

          <div className="stats-grid">
            <StatCard
              title="Total Income"
              value={`₹${(summary?.totalIncome ?? 0).toLocaleString()}`}
              trendType="up"
              color="green"
              icon={<IndianRupee size={24} />}
            />

            <StatCard
              title="Total Expense"
              value={`₹${summary?.totalExpense?.toLocaleString() || 0}`}
              trendType="down-bad"
              color="red"
              icon={<TrendingDown size={24} />}
            />

            <StatCard
              title="Budget Used"
              value={`${budgetData?.usagePercent || 0}%`}
              subValue={`₹${budgetData?.remaining?.toLocaleString() || 0} left`}
              trendType="neutral"
              color="amber"
              icon={<PieChart size={24} />}
            />

            <StatCard
              title="Predicted Expense"
              value={formatCurrency(predictData)}
              trend="Next Month"
              trendType="neutral"
              color="purple"
              icon={<Activity size={24} />}
            />
          </div>

          <div className="content-split">

            <div className="section-card table-section">
              <div className="section-header">
                <h2>Recent Transactions</h2>
                <div className="section-actions">
                  {/* <div className="table-search">
                    <Search size={16} />
                    <input type="text" placeholder="Search transactions..."
                      value={searchTerm} onChange={handleSearch} />
                  </div> */}
                  <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} /> Add New
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Transaction</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Method</th>
                      <th>Note</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTransactions.slice(0, 4).map(t => (
                      <tr key={t.id}>
                        <td><div className="td-name"><span className="icon-box cat-icon">{t.categoryIcon}</span>{t.name}</div></td>
                        <td><span className="category-pill">{t.category}</span></td>
                        <td className="text-muted">{t.date}</td>
                        <td className="text-capitalize">{t.method}</td>
                        <td className="text-muted truncate-text">{t.note}</td>
                        <td className={`text-right fw-bold ${t.type === 'income' ? 'text-green' : 'text-red'}`}>
                          {t.type === 'income' ? '+' : '-'}₹{t.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>

            <div className="section-card chart-section">
              <div className="section-header">
                <h2>Expense Trends</h2>
                <div className="period-selector"><span>Monthly</span><ChevronDown size={14} /></div>
              </div>
              <div className="chart-summary">
                <h3>₹{(summary?.totalExpense || 0).toLocaleString()}</h3>
                <p>Real-time monthly spending trend</p>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={trendData}
                    onTouchStart={(e) => e?.preventDefault()}
  onTouchMove={(e) => e?.preventDefault()}
                  >
                    <defs>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="expense"
                      stroke="#EF4444"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorExpense)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Add New Transaction</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>

            <form className="txn-form" onSubmit={handleSubmit}>
              <div className="form-group type-select">
                <label className={`type-option ${formData.type === "expense" ? "active expense" : ""}`}>
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={formData.type === "expense"}
                    onChange={handleInputChange}
                  />
                  Expense
                </label>

                <label className={`type-option ${formData.type === "income" ? "active income" : ""}`}>
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={formData.type === "income"}
                    onChange={handleInputChange}
                  />
                  Income
                </label>
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Title"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    required
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    required
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                {formData.type === "expense" && (
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="wallet">Wallet</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Tags</label>
                <input
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Urgent, monthly..."
                />
              </div>

              <button type="submit" className="submit-btn">
                Save Transaction
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

const StatCard = ({ title, value, subValue, trend, trendType, color, icon }) => (
  <div className="stat-card">
    <div className={`stat-icon bg-${color}-light text-${color}`}>{icon}</div>
    <div className="stat-content">
      <span className="stat-title">{title}</span>
      <h3 className="stat-value">{value}</h3>

      <div className="stat-footer">
        {subValue && <span className="stat-sub">{subValue}</span>}
        {trend && <span className={`stat-trend ${trendType}`}>{trend}</span>}
      </div>
    </div>
  </div>
);

export default Dashboard;
