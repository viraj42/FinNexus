import React, { useEffect, useState } from "react";
import {
    Search, Plus, TrendingDown, TrendingUp, X, Activity, Filter, Calendar
} from "lucide-react";
import { Eye, Trash2, Pencil } from "lucide-react";
import Sidebar from "./Sidebar";
import "../src/styling/dashboard.css";
import "../src/styling/transaction.css";
import { useApp } from "./AppContext";

const defaultForm = {
    title: "",
    amount: "",
    type: "expense",
    categoryId: "",
    paymentMethod: "other",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    tags: "",
};

export default function Transactions() {
    const [selectedTx, setSelectedTx] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [filterCategory, setFilterCategory] = useState("");
    const [filterType, setFilterType] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(defaultForm);

    const { isAdmin } = useApp();

    // ---- Fetch Categories ----
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setCategories(Array.isArray(data) ? data : data.categories || []));
    }, []);

    // ---- Fetch Transactions With Filters ----
    const fetchTransactions = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const query = new URLSearchParams();
        if (startDate)      query.append("startDate",  startDate);
        if (endDate)        query.append("endDate",    endDate);
        if (filterCategory) query.append("categoryId", filterCategory);
        if (filterType)     query.append("type",       filterType);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions?${query.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!data.transactions) return;

        const formatted = data.transactions.map((tx) => ({
            id:           tx._id,
            name:         tx.title,
            amount:       tx.amount,
            type:         tx.type,
            category:     tx.categoryId?.name || "Unknown",
            categoryId:   tx.categoryId?._id  || "",
            method:       tx.paymentMethod,
            date:         tx.date?.split("T")[0],
            note:         tx.notes || "",
            categoryIcon: <Activity size={16} />,
        }));

        let sorted = [...formatted];
        if (sortOrder === "amountAsc")  sorted.sort((a, b) => a.amount - b.amount);
        if (sortOrder === "amountDesc") sorted.sort((a, b) => b.amount - a.amount);
        if (sortOrder === "dateAsc")    sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        if (sortOrder === "dateDesc")   sorted.sort((a, b) => new Date(b.date) - new Date(a.date));

        setTransactions(sorted);
    };

    useEffect(() => {
        fetchTransactions();
    }, [filterCategory, filterType, startDate, endDate, sortOrder]);

    // ---- Form handlers ----
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "type" && value === "income") {
            setFormData((p) => ({ ...p, type: value, categoryId: "" }));
            return;
        }
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) return alert("Login required");

        const payload = {
            ...formData,
            amount: Number(formData.amount),
            tags: formData.tags ? formData.tags.split(",").map((x) => x.trim()) : [],
        };
        if (payload.type === "income") delete payload.categoryId;

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) return alert(data.message || "Error");

        setFormData(defaultForm);
        setIsModalOpen(false);
        fetchTransactions();
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token   = localStorage.getItem("token");
        const payload = { ...formData, amount: Number(formData.amount) };
        if (payload.type === "income") delete payload.categoryId;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/${formData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error();
            setIsModalOpen(false);
            fetchTransactions();
        } catch {
            alert("Update failed");
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (!window.confirm("Delete this transaction?")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            fetchTransactions();
        } catch {
            alert("Delete failed");
        }
    };

    const openView = (tx) => { setSelectedTx(tx); setIsViewOpen(true); setIsEditMode(false); };
    const openEdit = (tx) => {
        setFormData({
            id:            tx.id,
            title:         tx.name,
            amount:        tx.amount,
            type:          tx.type,
            category:      tx.categoryId?.name || "Unknown",
            categoryId:    tx.categoryId,
            paymentMethod: tx.method,
            date:          tx.date,
            notes:         tx.note,
            tags:          "",
        });
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const filtered = transactions.filter((t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const total    = transactions.length;
    const credited = transactions.filter((t) => t.type === "income") .reduce((a, b) => a + b.amount, 0);
    const debited  = transactions.filter((t) => t.type === "expense").reduce((a, b) => a + b.amount, 0);

    return (
        <div className="app-container">
            <Sidebar />

            <main className="main-content">
                {/* Header */}
                <header className="top-navbar">
                    <div className="header-titles">
                        <h1>Transactions</h1>
                        <p>Track every rupee in and out</p>
                    </div>
                </header>

                {/* Summary Cards */}
                <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
                    <StatCard title="Total"    value={total}                            icon={<Activity size={20} />}     color="blue"  />
                    <StatCard title="Credited" value={`₹${credited.toLocaleString()}`} icon={<TrendingUp size={20} />}   color="green" />
                    <StatCard title="Debited"  value={`₹${debited.toLocaleString()}`}  icon={<TrendingDown size={20} />}  color="red"   />
                </div>

                {/* ── Filter Bar — fully styled, no raw date overflow ── */}
                <div className="txn-filter-bar">
                    {/* Date range group */}
                    <div className="txn-date-group">
                        <Calendar size={14} className="date-icon" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            title="Start Date"
                        />
                        <span className="date-sep">—</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            title="End Date"
                        />
                    </div>

                    {/* Dropdowns */}
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>

                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>

                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="">Sort By...</option>
                        <option value="amountAsc">Amount ↑</option>
                        <option value="amountDesc">Amount ↓</option>
                        <option value="dateAsc">Date (Oldest)</option>
                        <option value="dateDesc">Date (Newest)</option>
                    </select>
                </div>

                {/* Table Section */}
                <div className="section-card table-section" style={{ marginTop: "1rem" }}>
                    <div className="section-header">
                        <h2>All Transactions</h2>

                        <div className="section-actions">
                            <div className="table-search">
                                <Search size={16} />
                                <input
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {isAdmin && (
                                <button
                                    className="primary-btn"
                                    onClick={() => { setIsEditMode(false); setFormData(defaultForm); setIsModalOpen(true); }}
                                >
                                    <Plus size={16} /> <span>Add</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {!isAdmin && (
                        <div className="viewer-banner">
                            👁 Viewer Mode — switch to Admin in the sidebar to add, edit, or delete transactions.
                        </div>
                    )}

                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Method</th>
                                    <th>Note</th>
                                    <th className="text-right">Amount</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
                                            No transactions found.
                                        </td>
                                    </tr>
                                ) : filtered.map((t) => (
                                    <tr key={t.id}>
                                        <td>
                                            <div className="td-name">
                                                <span className="icon-box cat-icon">{t.categoryIcon}</span>
                                                {t.name}
                                            </div>
                                        </td>
                                        <td><span className="category-pill">{t.category}</span></td>
                                        <td className="text-muted">{t.date}</td>
                                        <td className="text-capitalize">{t.method}</td>
                                        <td className="text-muted truncate-text">{t.note}</td>
                                        <td className={`text-right fw-bold ${t.type === "income" ? "text-green" : "text-red"}`}>
                                            {t.type === "income" ? "+" : "-"}₹{t.amount}
                                        </td>
                                        <td className="action-cell">
                                            <div className="action-strip">
                                                <button className="action-btn view" onClick={() => openView(t)}>
                                                    <Eye size={16} />
                                                </button>
                                                {isAdmin && (
                                                    <>
                                                        <button className="action-btn edit" onClick={() => openEdit(t)}>
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button className="action-btn delete" onClick={() => handleDelete(t.id)}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add / Edit Modal — Admin only */}
                {isAdmin && isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-container">
                            <div className="modal-header">
                                <h2>{isEditMode ? "Edit Transaction" : "Add New Transaction"}</h2>
                                <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                            </div>

                            <form onSubmit={isEditMode ? handleUpdate : handleSubmit}>
                                <div className="form-group type-select">
                                    <label className={`type-option ${formData.type === "expense" ? "active expense" : ""}`}>
                                        <input type="radio" name="type" value="expense" checked={formData.type === "expense"} onChange={handleInputChange} />
                                        Expense
                                    </label>
                                    <label className={`type-option ${formData.type === "income" ? "active income" : ""}`}>
                                        <input type="radio" name="type" value="income" checked={formData.type === "income"} onChange={handleInputChange} />
                                        Income
                                    </label>
                                </div>

                                <div className="form-group">
                                    <label>Title</label>
                                    <input required name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Amount</label>
                                        <input required type="number" name="amount" value={formData.amount} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Date</label>
                                        <input required type="date" name="date" value={formData.date} onChange={handleInputChange} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    {formData.type === "expense" && (
                                        <div className="form-group">
                                            <label>Category</label>
                                            <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} required>
                                                <option value="">Select Category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <label>Payment Method</label>
                                        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
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
                                    <textarea name="notes" value={formData.notes} onChange={handleInputChange} />
                                </div>

                                <div className="form-group">
                                    <label>Tags</label>
                                    <input name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Urgent, monthly..." />
                                </div>

                                <button type="submit" className="submit-btn">Save Transaction</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Details Modal — all roles */}
                {isViewOpen && selectedTx && (
                    <div className="modal-overlay">
                        <div className="modal-container">
                            <div className="modal-header">
                                <h2>Transaction Details</h2>
                                <button className="close-btn" onClick={() => setIsViewOpen(false)}><X size={20} /></button>
                            </div>
                            <div className="view-body">
                                <p><strong>Title:</strong>  {selectedTx.name}</p>
                                <p><strong>Amount:</strong> ₹{selectedTx.amount}</p>
                                <p><strong>Type:</strong>   {selectedTx.type}</p>
                                <p><strong>Date:</strong>   {selectedTx.date}</p>
                                <p><strong>Method:</strong> {selectedTx.method}</p>
                                <p><strong>Note:</strong>   {selectedTx.note}</p>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

const StatCard = ({ title, value, icon, color }) => (
    <div className="stat-card">
        <div className={`stat-icon text-${color}`}>{icon}</div>
        <div className="stat-content">
            <span className="stat-title">{title}</span>
            <h3 className="stat-value">{value}</h3>
        </div>
    </div>
);