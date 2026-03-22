import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaBriefcase, FaLaptopCode, FaTv, FaHome, FaArrowRight, FaArrowLeft, FaCheck } from "react-icons/fa";
import { MdCurrencyRupee, MdShoppingCart, MdFastfood, MdFlight, MdFitnessCenter, MdComputer } from "react-icons/md";
import { GiFarmer } from "react-icons/gi"
import '../src/styling/onboard.css';
function OnBoard() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    // State Management
    const [step, setStep] = useState(1);
    const [slideDirection, setSlideDirection] = useState("next");

    // Form Data
    const [role, setRole] = useState("");
    const [monthlyIncome, setMonthlyIncome] = useState("");
    const [monthlyBudget, setMonthlyBudget] = useState("");
    // CHANGE 1: spendingPreferences is now an array for multiple selections
    const [spendingPreferences, setSpendingPreferences] = useState([]);

    // UI State
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Navigation Handlers
    const handleNext = () => {
        if (validateStep()) {
            setSlideDirection("next");
            setStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setSlideDirection("back");
        setStep((prev) => prev - 1);
    };

    // Validation per step
    const validateStep = () => {
        setError("");
        if (step === 1 && !role) { setError("Please select a role."); return false; }
        // Ensure income/budget is a positive number
        if (step === 2 && (!monthlyIncome || isNaN(monthlyIncome) || Number(monthlyIncome) <= 0)) { setError("Please enter a valid monthly income."); return false; }
        if (step === 3 && (!monthlyBudget || isNaN(monthlyBudget) || Number(monthlyBudget) <= 0)) { setError("Please set a valid monthly budget."); return false; }
        return true;
    };

    // Final Submission
    const preferenceHandler = async (e) => {
        e.preventDefault();
        // Check if at least one preference is selected
        if (spendingPreferences.length === 0) {
            setError("Please select at least one spending category.");
            return;
        }

        setLoading(true);
        setError("");
        const options = {

            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
                body: JSON.stringify(
                {
                role,
                monthlyIncome: Number(monthlyIncome),
                monthlyBudget: Number(monthlyBudget),
                // Send as a comma-separated string if the backend expects it, or just the array.
                // Assuming string for compatibility with original code's preference type:
                spendingPreferences
            }),

        }
        try {
            const res = await fetch("http://localhost:8000/api/user/onboard", options);

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Onboarding failed");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            // Success - Navigate
            navigate("/login");



        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Helper to select cards
    const selectRole = (r) => setRole(r);

    // CHANGE 2: Multi-select Preference Handler
    const togglePref = (p) => {
        setSpendingPreferences(prev => {
            if (prev.includes(p)) {
                // Remove if already exists
                return prev.filter(pref => pref !== p);
            } else {
                // Add if it doesn't exist
                return [...prev, p];
            }
        });
    };

    return (
        <div className="onboard-wrapper">
            <div className="onboard-container">
                <p>Steps: {step}/4</p>
                {/* Progress Bar */}
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
                </div>

                <div className={`step-content slide-${slideDirection}`}>

                    {/* STEP 1: ROLE */}
                    {step === 1 && (
                        <div className="step-slide">
                            <h2>Who are you?</h2>
                            <p className="subtitle">Help us tailor your financial journey.</p>

                            <div className="card-grid">
                                <div className={`selection-card ${role === "Student" ? "active" : ""}`} onClick={() => selectRole("Student")}>
                                    <FaUserGraduate className="card-icon" />
                                    <span>Student</span>
                                </div>
                                <div className={`selection-card ${role === "Professional" ? "active" : ""}`} onClick={() => selectRole("Professional")}>
                                    <FaBriefcase className="card-icon" />
                                    <span>Professional</span>
                                </div>
                                <div className={`selection-card ${role === "Farmer" ? "active" : ""}`} onClick={() => selectRole("Farmer")}>
                                    <GiFarmer className="card-icon" />
                                    <span>Farmer</span>
                                </div>
                                <div className={`selection-card ${role === "HouseHold" ? "active" : ""}`} onClick={() => selectRole("HouseHold")}>
                                    <FaHome className="card-icon" />
                                    <span>HouseHold</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: INCOME */}
                    {step === 2 && (
                        <div className="step-slide">
                            <h2>Monthly Income</h2>
                            <p className="subtitle">How much do you earn each month?</p>
                            <div className="input-group">
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={monthlyIncome}
                                    onChange={(e) => setMonthlyIncome(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: BUDGET */}
                    {step === 3 && (
                        <div className="step-slide">
                            <h2>Monthly Budget</h2>
                            <p className="subtitle">What is your spending limit target?</p>
                            <div className="input-group">
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={monthlyBudget}
                                    onChange={(e) => setMonthlyBudget(e.target.value)}
                                    autoFocus
                                />
                            </div>

                        </div>
                    )}

                    {/* STEP 4: PREFERENCES */}
                    {/* STEP 4: PREFERENCES */}
                    {step === 4 && (
                        <div className="step-slide">
                            <h2>Top Spending Categories</h2>
                            <p className="subtitle">Select all areas where you spend frequently.</p>

                            {/* UPDATED: Scrollable card container */}
                            <div className="card-grid scroll-cards">

                                <div className={`selection-card ${spendingPreferences.includes("Rent") ? "active" : ""}`} onClick={() => togglePref("Rent")}>
                                    <FaHome className="card-icon" />
                                    <span>House Rent</span>
                                </div>

                                <div className={`selection-card ${spendingPreferences.includes("Shopping") ? "active" : ""}`} onClick={() => togglePref("Shopping")}>
                                    <MdShoppingCart className="card-icon" />
                                    <span>Shopping</span>
                                </div>

                                <div className={`selection-card ${spendingPreferences.includes("Subscriptions") ? "active" : ""}`} onClick={() => togglePref("Subscriptions")}>
                                    <FaLaptopCode className="card-icon" />
                                    <span>Subscriptions & Bills</span>
                                </div>

                                <div className={`selection-card ${spendingPreferences.includes("Healthcare") ? "active" : ""}`} onClick={() => togglePref("Healthcare")}>
                                    <MdFitnessCenter className="card-icon" />
                                    <span>Healthcare</span>
                                </div>

                                <div className={`selection-card ${spendingPreferences.includes("Entertainment") ? "active" : ""}`} onClick={() => togglePref("Entertainment")}>
                                    <FaTv className="card-icon" />
                                    <span>Entertainment</span>
                                </div>

                                <div className={`selection-card ${spendingPreferences.includes("Education") ? "active" : ""}`} onClick={() => togglePref("Education")}>
                                    <FaUserGraduate className="card-icon" />
                                    <span>Education</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Error Message */}
                {error && <p className="error-msg">{error}</p>}

                {/* Navigation Buttons */}
                <div className="nav-buttons">
                    {step > 1 && (
                        <button className="btn-secondary" onClick={handleBack}>
                            <FaArrowLeft /> Back
                        </button>
                    )}

                    {step < 4 ? (
                        <button className="btn-primary" onClick={handleNext}>
                            Next <FaArrowRight />
                        </button>
                    ) : (
                        <button className="btn-primary" onClick={preferenceHandler} disabled={loading}>
                            {loading ? "Setting up..." : "Finish Setup"} <FaCheck />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OnBoard;