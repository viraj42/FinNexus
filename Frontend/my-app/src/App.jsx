import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import OnBoard from "./OnBoard";
import Dashboard from "./Dashboard";
import Transaction from "./Transaction";
import Budget from "./Budget";
import Analytics from "./Analytics";
import Prediction from "./Prediction";
import Home from "./Home";

import Setting from './Setting'
import ProtectedRoute from "./services/ProtectedRoute";
import Profile from "./Profile";
import Category from "./Category";
import NotFound from "./NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/onboard" element={<OnBoard />} />

        {/* Protected Wrapper */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/categories" element={<Category />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
