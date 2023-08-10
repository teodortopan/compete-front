import React, { useState } from 'react'
import axios from 'axios'
import './footer.css'
const Footer = ({userData, userEventData, eventData}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [popupMessage, setPopupMessage] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  if(!userData && !userEventData && !eventData) {
    return (
      <div></div>
    )
  }

  const handleNewsletterSubmit = async(e) => {
    try {
      setNewsletterEmail('')
      e.preventDefault()
      const response = await axios.post('http://localhost:3000/newsletter', {
        passedEmail: newsletterEmail
      })

      if(response.status === 200) {
        console.log('Succesfully signed up for the newsletter!')
      }
    } catch (error) {
      console.error('Error signing up for the newsletter:', error);
      setPopupMessage('You are already subscribed to the newsletter!')
      setShowPopup(true)
      setTimeout(() => {
        setShowPopup(false);
      }, 3000); // Hide popup after 3 seconds
    }
  }
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <a className="website-name" href="/home">Compete.</a>
          <ul className="footer-links">
            {/* <li>
              <a className='link-name' href="/services">Services</a>
            </li> */}
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
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Subscribe to our newsletter"
              className='newsletter-input'
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
            <div className="newsletter-wrapper">
              <button type="submit">Subscribe</button>
              {showPopup && <div className="newsletter-popup">You are already subscribed!</div>}
            </div>
          </form>
        </div>
      </div>
    </footer>
  )
}

export default Footer