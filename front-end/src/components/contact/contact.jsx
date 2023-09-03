import React from "react"
import './contact.css'

const Contact = () => {
  return (
    <>
      <div className="header-container">
        <h1 className="contact-header">Contact us</h1>
        <div className="divider"></div>
      </div>
      <div className="contact-container">
        <div className="contact-method">
          <h2 className="contact-method-name">By Email</h2>
          <p className="contact-method-description">Email us at compete.win.achieve@gmail.com with any questions or feedback!</p>
        </div>
        <div className="contact-method">
          <h2 className="contact-method-name">By Phone</h2>
          <p className="contact-method-description">Give us a call! (Coming Soon!)</p>
        </div>
        <div className="contact-method">
          <h2 className="contact-method-name">By making a formal request</h2>
          <p className="contact-method-description">Submit a request (Coming Soon!)</p>
        </div>
      </div>
    </>
  )
}

export default Contact