// Dashboard.js

import React from 'react';
import Navigation from '../Navigation/Navigation'; 
import './Dashboard.css'; 

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Navigation />

      <div className="main-content">
        <h2>Welcome to the Flush Facilities Management Portal!</h2>
        {/* Add more dashboard content here */}
      </div>
    </div>
  );
};

export default Dashboard;
