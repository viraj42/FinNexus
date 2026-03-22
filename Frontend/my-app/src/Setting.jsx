import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaUser, FaTags, FaSignOutAlt, FaBell, FaChevronRight, FaCog } from "react-icons/fa";

import "../src/styling/dashboard.css"; // Global Dashboard Styles
import "../src/styling/setting.css";   // Specific Settings Styles

const Setting = () => {
    const navigate = useNavigate();

    // Mock User Data (Replace with Context or Redux if available)
    const user = JSON.parse(localStorage.getItem("user")) || { 
        name: "User", 
        email: "user@example.com" 
    };

    const handleLogout = () => {
        if(window.confirm("Are you sure you want to log out?")) {
            localStorage.clear();
            navigate("/login");
        }
    };

    return (
        <div className="app-container">
            <Sidebar />

            <main className="main-content">
                {/* --- Top Header --- */}
                <header className="top-navbar">
                    <div className="header-titles">
                        <h1>Settings</h1>
                        <p>Manage your account preferences and application settings.</p>
                    </div>
                    
                </header>

                {/* --- Settings Content --- */}
                <div className="settings-wrapper">
                    
                    {/* Section Label */}
                    <div className="settings-section-header">
                        <FaCog className="section-icon"/>
                        <h2>General</h2>
                    </div>

                    <div className="settings-grid">
                        
                        {/* 1. Account Profile Card */}
                        <div className="settings-card" onClick={() => navigate("/profile")}>
                            <div className="icon-box primary-bg">
                                <FaUser />
                            </div>
                            <div className="card-content">
                                <h3>Account Profile</h3>
                                <p>Update personal details, income, and budget.</p>
                            </div>
                            <div className="action-arrow">
                                <FaChevronRight />
                            </div>
                        </div>

                        {/* 2. Categories Card */}
                        <div className="settings-card" onClick={() => navigate("/categories")}>
                            <div className="icon-box success-bg">
                                <FaTags />
                            </div>
                            <div className="card-content">
                                <h3>Manage Categories</h3>
                                <p>Create, edit, or delete transaction tags.</p>
                            </div>
                            <div className="action-arrow">
                                <FaChevronRight />
                            </div>
                        </div>

                    </div>

                    {/* Section Label */}
                    <div className="settings-section-header danger-zone-header">
                        <h2>Session</h2>
                    </div>

                    <div className="settings-grid">
                        {/* 3. Logout Card */}
                        <div className="settings-card logout-card" onClick={handleLogout}>
                            <div className="icon-box danger-bg">
                                <FaSignOutAlt />
                            </div>
                            <div className="card-content">
                                <h3>Sign Out</h3>
                                <p>Securely log out of your account on this device.</p>
                            </div>
                            <div className="action-arrow">
                                <FaChevronRight />
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Setting;