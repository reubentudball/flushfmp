import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navigation.css";

const Navigation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("facility");
    navigate("/");
  };

  const toggleCollapse = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  return (
    <nav className={`navigation-container ${isCollapsed ? "collapsed" : ""}`}>
      <button className="collapse-button" onClick={toggleCollapse}>
        {isCollapsed ? <FaBars /> : <FaTimes />}
      </button>
      <div className="nav-header">
        <h2>Flush FMP</h2>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/admin">Home</Link>
        </li>
        <li>
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/facilities">Facilities</Link>
        </li>
        <li>
          <Link to="/admin/work-management">Work Management</Link>
        </li>
        <li>
          <Link to="/admin/profile">Your Profile</Link>
        </li>
      </ul>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navigation;
