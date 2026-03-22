import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styling/UnAuthorized.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="whole-page-container">
      <div className="oops-card-wrapper">
        <div className="emoji-top-part">
          ❌
        </div>

        <h2 className="big-scary-title">404 - Page Not Found</h2>

        <p className="description-text-thing">
          The page you are looking for does not exist.
        </p>

        <button 
          className="go-back-pls-btn" 
          onClick={() => navigate(-1)}
        >
          ← Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;