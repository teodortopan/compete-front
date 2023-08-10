import React from 'react';
import './Landing.css'; // You can create the CSS file to style the components

const Landing = () => {
  const backgroundImageURL = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.TwmPxPlcrAmrotIYubtlQwHaHa%26pid%3DApi&f=1&ipt=722b98a539ba678da0a51646a05b09227aa5a3a96672fe23434d2268475bf4ec&ipo=images'; // Replace this with the URL of your trophy image
  console.log(window.screen.height, window.screen.width)
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