import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import "../src/styling/Login.css";
function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Registration failed");
                return;
            }
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setSuccess("Registered successfully! Redirecting to login...");
            setTimeout(() => navigate("/onboard"), 1500);
        } catch (err) {
            setError("Something went wrong. Try again.");
        }
    };

    return (
        <div className="main-page-container">

            {/* LEFT Section */}
            <div className="illustration-panel">
                <div className="illustration-content">
                    <img src="/assets/SignUp.png" alt="SignUp Img" />
                    <p>Get started for free & integrate in minutes</p>
                    <h3>Get Structured Financial Data</h3>
                </div>
            </div>

            {/* RIGHT Section */}
            <div className="login-container">
                <div className="login-card">
                    <h2>Create Account</h2>
                    <p className="subtitle">Sign up to get started.</p>

                    <form className="login-form" onSubmit={handleRegister}>

                        <div style={{ position: "relative" }}>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <span className="input-icon">👤</span>
                        </div>

                        <div style={{ position: "relative" }}>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <span className="input-icon">📧</span>
                        </div>

                        <div style={{ position: "relative" }}>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="input-icon">🔒</span>
                        </div>

                        {error && <p style={{ color: "red" }}>{error}</p>}
                        {success && <p style={{ color: "green" }}>{success}</p>}

                        <button type="submit">Sign Up</button>
                    </form>

                    <p className="signup-redirect">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
