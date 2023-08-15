import React from 'react';
import './Landing.css'; // You can create the CSS file to style the components

const Landing = () => {
    return (
    <div className="saas-landing">
      <div className="saas-landing-header">
        <h1 className="saas-landing-title">Compete. Win. Achieve.</h1>
        <p className="saas-landing-description">
          Discover competitions near you and showcase your skills to win awards and recognition.
        </p>
        <a href="/login" className="saas-landing-button">Get Started</a>
      </div>
    </div>
  );
};

export default Landing;