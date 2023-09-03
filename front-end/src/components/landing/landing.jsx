import React from 'react';
import './Landing.css'; // You can create the CSS file to style the components

const Landing = () => {
    return (
    <div className="saas-landing">
      <div className="saas-landing-header">
        <h1 className="saas-landing-title">Compete. Win. Achieve.</h1>
        <p className="saas-landing-description">
          Discover competitions near you and showcase your skills to win awards and recognition, or just to have some fun!
        </p>
        <a href="/home" className="saas-landing-button">Compete Now!</a>
      </div>
    </div>
  );
};

export default Landing;