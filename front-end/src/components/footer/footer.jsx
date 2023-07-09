import React from 'react'
import './footer.css'
const Footer = () => {
  return (
    <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <h1 className="website-name">Compete.</h1>
            <ul className="footer-links">
              <li>
                <a href="/services">Services</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-right">
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </footer>
  )
}

export default Footer