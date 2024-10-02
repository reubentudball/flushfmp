import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="homepage-container">
      <h2>Welcome to the Flush Facilities Management Portal</h2>
      <p>Manage work orders, employees, and restroom facilities with ease.</p>

      <div className="quick-links">
        <Link to="/admin/dashboard" className="homepage-link">
          Go to Dashboard
        </Link>
        <Link to="/admin/facilities" className="homepage-link">
          View Facilities
        </Link>
        <Link to="/admin/employees" className="homepage-link">
          Manage Employees
        </Link>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ul>
          <li>Work Order #123 assigned to Tyler Makris</li>
          <li>Facility inspection completed for Restroom A</li>
          <li>New maintenance request for Restroom C</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
