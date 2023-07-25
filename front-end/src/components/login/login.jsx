import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({handleLogin, setEmail, setLoginMessage, setUserId}) => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/login', {
        usernameOrEmail,
        password,
      });

      
      if (response.status === 200) {
        console.log(response.data)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('username', response.data.username);
        console.log('Token:', response.data.token);
        console.log('Username:', response.data.username);
        setEmail(usernameOrEmail)
        handleLogin()
        setLoginMessage(`Successfully logged in as ${response.data.username}!`)
        // Login successful
        console.log('Login successful!');
        // Clear form fields
        setUsernameOrEmail('');
        setPassword('');
        
        navigate(`/user/${response.data.username}`);
        
        setTimeout(() => {
          setLoginMessage('')
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

  return (
    <div className="container-login">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className={`form-group ${error && 'error'}`}>
          <label htmlFor="usernameOrEmail">Email</label>
          <input
            type="text"
            id="usernameOrEmail"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)} required
          />
        </div>
        <div className={`form-group ${error && 'error'}`}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} required
          />
        </div>
        {error && <p className="error-message">Login failed. Please check your username or email and password and try again</p>}
        <button type="submit" className="login-button">
          Login
        </button>
        <p className="signup-link">
          Don't have an account? <a href="http://localhost:5173/signup">Sign Up Now!</a>
        </p>
      </form>
    </div>
  );
};

export default Login;