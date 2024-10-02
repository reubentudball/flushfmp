import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Login.css';
import axios from 'axios';
import flushLogo from '../../assets/FlushLogo.png'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = () => {
    if (username.trim() !== '' && password.trim() !== '') {
      axios.get('http://localhost:8000/login', {
        params:{
          'username': username,
          'password': password
        }
      }).then((response) => {
        console.log(response.data);
        navigate('/dashboard');
      }).catch((error) => {
        console.log(error);
        alert("Invalid credentials");
      });
    } else {
      console.log('Invalid credentials');
      alert('Please enter something dawg');
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <img src={flushLogo} alt="Flush Logo" className="toilet-icon" />
        <h2>Facilities Management Portal</h2>
        <form>
          <label htmlFor="username">Admin Username:</label>
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
    </div>
  );
};

export default Login;
