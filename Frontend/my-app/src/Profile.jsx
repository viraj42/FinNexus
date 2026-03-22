import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaUserCircle, FaCamera, FaSave, FaSpinner } from "react-icons/fa";
import Sidebar from "./Sidebar";

// Styles
import '../src/styling/dashboard.css';
import "../src/styling/profile.css";

// --- Configuration Constants ---
const ROLES = [
  { value: "student", label: "Student" },
  { value: "working", label: "Working Professional" },
  { value: "farmer", label: "Farmer" },
  { value: "household", label: "Household / Homemaker" },
  { value: "other", label: "Other" }
];

const CURRENCIES = [
  { value: "INR", label: "🇮🇳 INR (₹)" },
  { value: "USD", label: "🇺🇸 USD ($)" },
  { value: "EUR", label: "🇪🇺 EUR (€)" }
];

const PREFERENCE_OPTIONS = [
  "Food", "Transport", "Shopping", "Utilities", "Health", "Entertainment"
];

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Initialize state from localStorage safely
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || {});
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    role: user?.role || "other",
    monthlyIncome: user?.monthlyIncome || 0,
    monthlyBudget: user?.monthlyBudget || 0,
    currency: user?.currency || "INR",
    spendingPreferences: user?.spendingPreferences || []
  });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Toggle for Preferences
  const handleCheckbox = (pref) => {
    const value = pref.toLowerCase();
    setFormData(prev => ({
      ...prev,
      spendingPreferences: prev.spendingPreferences.includes(value)
        ? prev.spendingPreferences.filter(p => p !== value)
        : [...prev.spendingPreferences, value]
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token || !user?._id) {
        alert("Authentication required. Please login again.");
        return;
      }

      // API Call
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/${user._id}`,
        formData, // Send formData directly
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update Local User State & Storage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      alert("Profile updated successfully!");
      
    } catch (error) {
      console.error("Update Error:", error);
      alert(error.response?.data?.error || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        {/* --- Header --- */}
        <header className="page-header">
          <button type="button" className="back-btn" onClick={() => navigate("/settings")}>
            <FaArrowLeft />
          </button>
          <div className="header-text">
            <h1>Account Settings</h1>
            <p>Update your personal details and financial preferences.</p>
          </div>
        </header>

        <div className="profile-wrapper">
          <form className="profile-form" onSubmit={handleSubmit}>
            
            {/* --- 1. Identity Section --- */}
            <section className="profile-card identity-section">
              <div className="avatar-wrapper">
                <div className="avatar-circle">
                   <FaUserCircle className="avatar-icon" />
                   <span className="edit-avatar-badge" title="Change Avatar">
                     <FaCamera />
                   </span>
                </div>
                <div className="identity-info">
                  <h2>{formData.name || "User Name"}</h2>
                  <span className="email-badge">{user?.email || "email@example.com"}</span>
                </div>
              </div>
            </section>

            {/* --- 2. Personal Info Section --- */}
            <section className="profile-card details-section">
              <div className="card-header">
                <h3>Personal Information</h3>
              </div>
              <div className="form-grid">
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="input-group">
                  <label>Role / Occupation</label>
                  <select name="role" value={formData.role} onChange={handleChange}>
                    {ROLES.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group disabled-group">
                   <label>Email Address</label>
                   <input type="email" value={user?.email || ""} disabled />
                   <span className="helper-text">Email cannot be changed</span>
                </div>
              </div>
            </section>

            {/* --- 3. Financial Section --- */}
            <section className="profile-card finance-section">
              <div className="card-header">
                <h3>Financial Settings</h3>
              </div>
              <div className="form-grid">
                <div className="input-group">
                  <label>Currency Preference</label>
                  <select name="currency" value={formData.currency} onChange={handleChange}>
                    {CURRENCIES.map(curr => (
                      <option key={curr.value} value={curr.value}>{curr.label}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Monthly Income</label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <div className="input-group">
                  <label>Monthly Budget Limit</label>
                  <input
                    type="number"
                    name="monthlyBudget"
                    value={formData.monthlyBudget}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>
            </section>
            {/* --- Footer Actions --- */}
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? <FaSpinner className="spinner" /> : <FaSave />} 
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;