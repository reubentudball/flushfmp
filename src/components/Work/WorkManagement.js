import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./WorkManagement.css";

const WorkManagement = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current path for relative navigation

  const handleNavigation = (path) => {
    navigate(`${location.pathname}/${path}`); // Append the relative path
  };

  return (
    <div className="work-management-container">
      <h1>Work Management Dashboard</h1>
      <p>Manage all your tickets, work orders, and employees in one place.</p>

      <div className="work-management-sections">
        {/* Tickets Section */}
        <div className="work-section">
          <h2>Tickets</h2>
          <p>Review ticket metrics and create work orders for reported issues.</p>
          <button
            className="section-link"
            onClick={() => handleNavigation("tickets")}
          >
            Manage Tickets
          </button>
        </div>

        {/* Work Orders Section */}
        <div className="work-section">
          <h2>Work Orders</h2>
          <p>View, create, update, or delete work orders.</p>
          <button
            className="section-link"
            onClick={() => handleNavigation("work-orders")}
          >
            Manage Work Orders
          </button>
        </div>

        {/* Employees Section */}
        <div className="work-section">
          <h2>Employees</h2>
          <p>Add employees, assign work orders, and track assignments.</p>
          <button
            className="section-link"
            onClick={() => handleNavigation("employees")}
          >
            Manage Employees
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkManagement;
