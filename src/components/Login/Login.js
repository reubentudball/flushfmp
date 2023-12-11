// Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const naivgate = useNavigate(); 

  const handleLogin = () => {
    if (username.trim() !== '' && password.trim() !== '') {
      naivgate('/dashboard');
    } else {
      console.log('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h2>Flush FMP Login</h2>
      <form>
        <label htmlFor="username">Admin Userman:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
