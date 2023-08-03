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
                <a className='link-name' href="/services">Services</a>
              </li>
              <li>
                <a className='link-name' href="/about">About</a>
              </li>
              <li>
                <a className='link-name' href="/contact">Contact</a>
              </li>
            </ul>
          </div>
          <p className='copyright-company-text'>&copy; {new Date().getFullYear()} Compete. All rights reserved.</p>
          <div className="footer-right">
            {/* <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form> */}
          </div>
        </div>
      </footer>
  )
}

export default Footer