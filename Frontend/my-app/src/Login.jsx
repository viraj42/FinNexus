import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import "../src/styling/Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:8000/api/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/dashboard");
        } catch (err) {
            setError("Something went wrong. Try again.");
        }
    };

    return (
        <div className="main-page-container">

            {/* LEFT Section */}
            <div className="illustration-panel">
                <div className="illustration-content">
                    <video
                        src="/assets/login_animate.webm"
                        autoPlay
                        loop
                        muted
                        playsInline
                        disablePictureInPicture
                        controlsList="nodownload noremoteplayback nofullscreen noplaybackrate"
                        style={{ width: "100%", borderRadius: "12px" }}
                    />
                    <p>Get started for free & integrate in minutes</p>
                    <h3>Get Structured Financial Data</h3>
                </div>
            </div>

            {/* RIGHT Section */}
            <div className="login-container">
                <div className="login-card">
                    <h2>Welcome</h2>
                    <p className="subtitle">Sign into your account.</p>

                    <form className="login-form" onSubmit={handleLogin}>
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

                        <button type="submit">Submit</button>
                    </form>

                    {/* 👉 Signup text now aligned under form */}
                    <p className="signup-redirect">
                        Not registered yet? <Link to="/register">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
