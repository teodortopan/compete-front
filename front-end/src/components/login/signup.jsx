import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signup.css';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://us-central1-compete-ce97a.cloudfunctions.net/api/post_user', {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: password,
        firstName,
        lastName,
        phoneNumber: phoneNumber
      });
      setFirstName('');
      setLastName('');
      setEmail('');
      setUsername('');
      setPassword('');
      navigate(`/home`);
    } catch (error) {
      console.error('Error creating user:', error.response.data);
      setError(error.response.data.error);
    }
  };

  return (
    <div className="container-signup" autoComplete="off">
      <form className="signup-form" onSubmit={handleSubmit} autoComplete="off">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <div className={`form-group ${error ? 'error' : ''}`}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required // Add required attribute
            placeholder='Enter your first name'
          />
        </div>
        <div className={`form-group ${error ? 'error' : ''}`}>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required // Add required attribute
            placeholder='Enter your last name'
          />
        </div>
        <div className={`form-group ${error ? 'error' : ''}`}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name='username'
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            pattern="^\S+$" // Add pattern validation for disallowing spaces
            title="Spaces are not allowed"
            autoComplete="false"
            required // Add required attribute
            placeholder='Create a (permanent) username'
          />
        </div>
        <div className={`form-group ${error ? 'error' : ''}`}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="false"
            required // Add required attribute
            placeholder='Enter your email address (will be used for login)'
            autoSave='on'
          />
        </div>
        <div className={`form-group ${error ? 'error' : ''}`}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required // Add required attribute
            autoComplete="false"
            placeholder='Create a strong password'
          />
        </div>
        <div className={`form-group ${error ? 'error' : ''}`}>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            pattern="^\d{10}$" // Add pattern validation for 10 digits
            title="Please enter a 10-digit phone number"
            required // Add required attribute
            placeholder='Enter phone number (XXXXXXXXXX)'
          />
        </div>
        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;