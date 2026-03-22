import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart
} from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Activity, Target } from 'lucide-react';

// STYLING IMPORTS
import './styling/prediction.css';
import '../src/styling/dashboard.css';
import Loader from "./Loader"
// COMPONENT IMPORTS
import Sidebar from './Sidebar';

const Prediction = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);

  // FETCH DATA FROM REAL BACKEND
  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8000/api/prediction/next-month", {
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
          setPredictionData(data);
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

  // MAIN RENDER CONTENT
  const renderContent = () => {
   if (loading) {
        return <div >
            <Loader />
        </div>
    }
    if (!predictionData) return <div className="prediction-loading">No Data Available</div>;

    const { currency, history, predicted, slope, confidence } = predictionData;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    /** =============================
     *  CHART DATA PREP WORK
     * ============================= */
    const chartData = history.map((item, index) => {
      const trendVal = (slope * index) + predictionData.intercept;
      return {
        name: monthNames[item.month - 1],
        actual: item.total,
        trend: trendVal,
        isPrediction: false
      };
    });

    const nextIndex = history.length;

    chartData.push({
      name: "Next Month",
      actual: null,
      predictionPoint: predicted,
      trend: (slope * nextIndex) + predictionData.intercept,
      isPrediction: true
    });

    /** =============================
     *  HELPER FUNCTIONS
     * ============================= */
    const formatCurrency = (val) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'INR',
        maximumFractionDigits: 0
      }).format(val);
    };

    const isTrendUp = slope > 0;
    const isHighConfidence = confidence > 0.70;

    /** =============================
     *  MAIN RETURN
     * ============================= */
    return (
      <div className="prediction-container">

        {/* HEADER */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Expense Forecast</h1>
            <p className="page-subtitle">AI-Powered Financial Analytics</p>
          </div>
        </div>

        {/* A. SUMMARY SECTION */}
        <div className="summary-grid">

          {/* 1. Hero Card */}
          <div className="card hero-prediction-card">
            <span className="hero-label">Predicted Expense (Next Month)</span>
            <h2 className="hero-amount">{formatCurrency(predicted)}</h2>

            <div className="trend-badge">
              {isTrendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>
                {isTrendUp ? "Trending Upwards" : "Trending Downwards"}
                {" "}by {formatCurrency(Math.abs(slope))}/mo
              </span>
            </div>

            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: '0.1' }}>
              <Activity size={150} />
            </div>
          </div>

          {/* 2. Confidence Score */}
          <div className="card">
            <div className="chart-header">
              <span className="hero-label" style={{ color: 'var(--text-grey)' }}>Model Confidence (R²)</span>
              <Target size={20} color="var(--primary-purple)" />
            </div>

            <h2 style={{ fontSize: '32px', margin: '10px 0' }}>
              {(confidence * 100).toFixed(1)}%
            </h2>

            <div className="confidence-bar-bg">
              <div
                className="confidence-bar-fill"
                style={{
                  width: `${confidence * 100}%`,
                  background: isHighConfidence ? 'var(--accent-green)' : 'var(--accent-orange)'
                }}
              ></div>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-grey)', marginTop: '10px' }}>
              {isHighConfidence
                ? "High accuracy based on stable spend history."
                : "Irregular spending detected. Accuracy may vary."}
            </p>
          </div>

          {/* 3. Last Month Comparison */}
          <div className="card">
            <span className="hero-label" style={{ color: 'var(--text-grey)' }}>vs Last Month</span>
            <h2 style={{ fontSize: '32px', margin: '15px 0' }}>
              {formatCurrency(predicted - history[history.length - 1].total)}
            </h2>

            <span
              style={{
                color: predicted > history[history.length - 1].total
                  ? 'var(--accent-red)'
                  : 'var(--accent-green)',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              {predicted > history[history.length - 1].total
                ? "Likely Increase"
                : "Likely Savings"}
            </span>
          </div>
        </div>

        {/* B. PREDICTION CHART */}
        <div className="card">
          <div className="chart-header">
            <h3 className="chart-title">Expense Trend Analysis</h3>
            <select className="chart-select">
              <option>Last 6 Months</option>
            </select>
          </div>

          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <ComposedChart data={chartData} 
                onTouchStart={(e) => e?.preventDefault()}
  onTouchMove={(e) => e?.preventDefault()}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>

                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C5DD3" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6C5DD3" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9295A3', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9295A3', fontSize: 12 }} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} formatter={(value) => formatCurrency(value)} />

                <Area type="monotone" dataKey="actual" stroke="#6C5DD3" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" name="Actual Expense" />
                <Line type="monotone" dataKey="trend" stroke="#FFB800" strokeDasharray="5 5" strokeWidth={2} dot={false} name="Trend Line" />
                <Line type="monotone" dataKey="predictionPoint" stroke="#FF6B6B" strokeWidth={0} dot={{ r: 6, fill: "#FF6B6B", strokeWidth: 2, stroke: "#fff" }} name="Predicted" />

              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* D. INSIGHTS SECTION */}
        {(!isHighConfidence || slope > 120) && (
          <div className="card" style={{ padding: '20px' }}>
            <h3 className="chart-title">AI Insights & Alerts</h3>

            {!isHighConfidence && (
              <div className="insight-box insight-warning">
                <AlertCircle size={20} />
                <span>
                  <strong>Low Confidence:</strong> Your spending pattern is inconsistent, causing unstable predictions.
                </span>
              </div>
            )}

            {slope > 100 && (
              <div className="insight-box insight-warning">
                <TrendingUp size={20} />
                <span>
                  <strong>Spending Alert:</strong> Strong upward trend detected (+{formatCurrency(slope)}/month).
                </span>
              </div>
            )}

            {slope < 0 && (
              <div className="insight-box insight-success">
                <CheckCircle size={20} />
                <span>
                  <strong>Great Job!</strong> Your average spending is decreasing.
                </span>
              </div>
            )}
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Prediction;
