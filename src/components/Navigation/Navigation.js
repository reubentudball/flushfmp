// Navigation.js

import React from 'react';
import './Navigation.css'; 

const Navigation = () => {
  return (
    <div className="navigation-container">
      <ul>
        <li>Home</li>
        <li>Dashboard</li>
        <li>Profile</li>
        <li>Facilities</li>
        <li>Employees</li>
        {/* Add more navigation items as needed */}
      </ul>
    </div>
  );
};

export default Navigation;
