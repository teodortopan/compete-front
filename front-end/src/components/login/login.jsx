import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({handleLogin, setEmail, setLoginMessage, setUserId, setUsername, setToken}) => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!validateEmail(usernameOrEmail)) {
        setError('Invalid email format. Please enter a valid email address.');
        return;
      }
      const response = await axios.post('https://us-central1-compete-ce97a.cloudfunctions.net/api/login', {
        email: usernameOrEmail,
        password,
      });

      
      if (response.status === 200) {
        console.log(response)
        sessionStorage.setItem('token', response.data.token)
        sessionStorage.setItem('username', response.data.username);
        sessionStorage.setItem('userId', response.data.userId)
        setUsername(response.data.username)
        setToken(response.data.token)
        setEmail(usernameOrEmail)
        setUserId(response.data.userId)
        handleLogin()
        setLoginMessage(`Successfully logged in as ${response.data.username}!`)
        // Login successful
        // Clear form fields
        setUsernameOrEmail('');
        setPassword('');
        
        navigate(`/user/${response.data.username}`);
        
        setTimeout(() => {
          setLoginMessage('')
          window.location.reload()
        }, 2500)
      } else {
        // Invalid username/email or password
        setError('Invalid username/email or password.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Error logging in.');
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="container-login">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className={`form-group ${error && 'error'}`}>
          <label htmlFor="email">Email Address</label>
          <input
            type="text"
            id="email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)} 
            required
            placeholder='Email Address'
          />
        </div>
        <div className={`form-group ${error && 'error'}`}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} required
            placeholder='Password'
          />
        </div>
        {error && <p className="error-message">Login failed. Please check your email or password and try again</p>}
        <button type="submit" className="login-button">
          Login
        </button>
        <p className="signup-link">
          Don't have an account? <a href="https://compete-ce97a.web.app/signup">Sign Up Now!</a>
        </p>
      </form>
    </div>
  );
};

export default Login;