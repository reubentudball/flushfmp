// Navigation.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css'; 

const Navigation = () => {

  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('facility');
    navigate('/');
  };


  return (
    <div className="navigation-container">
      <ul>
        <li><Link to="/admin">Home</Link></li>
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/profile">Your Profile</Link></li>
        <li><Link to="/admin/facilities">Facilities</Link></li>
        <li><Link to="/admin/employees">Employees</Link></li>
      </ul>
      <button className='logout-button' onClick={handleLogout}>Logout</button>
    </div>
  );
};


export default Navigation;
