import React from "react";
import './about.css';

const About = () => {
  return (
    <>
      <div className="about-header-container">
        <h1 className="about-header">About us</h1>
        <div className="divider"></div>
        <div className="about-container">
          <p className="about-us">At Compete, we are driven by the belief that every ambitious individual deserves an equal opportunity
          to showcase their skills and capabilities. Our platform places a core focus on accessibility,
          growth, and innovation. Our mission is simple: to streamline access to competitions and contests,
          revolutionizing the way individuals demonstrate their potential to the world. In a world where college acceptance rates are plummeting,
           competitions have become a powerful means for students across the United States to stand out and prove their worth.
            However, we recognize the challenges faced by students from diverse backgrounds and regions in accessing these opportunities.
             Compete. steps in to bridge this gap, providing simple, easy access to a wide array of competitions, both virtual and in-person,
              spanning various subjects from arts to technology
          </p> 
        </div>
      </div>
    </>
  )
}

export default About;