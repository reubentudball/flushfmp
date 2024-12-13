import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./EmployeePage.css";

const EmployeePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useUser(); 

  const getActiveTab = () => {
    if (location.pathname.includes("/employee/dashboard")) return "dashboard";
    if (location.pathname.includes("/employee/tasks")) return "tasks";
    if (location.pathname.includes("/employee/profile")) return "profile";
    return "";
  };

  const activeTab = getActiveTab();

  const handleTabClick = (tab) => {
    navigate(`/employee/${tab}`);
  };

  const handleLogout = () => {
    logout(); 
    navigate("/"); 
  };

  return (
    <div className="employee-page-container">
      <div className="employee-header">
        <h1 className="employee-header-title">Flush Employee Portal</h1>
        <p className="employee-header-description">
          Manage your tasks, view your performance, and stay updated.
        </p>
        <button className="employee-logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="employee-main-content">
        <Outlet />
      </div>
      <div className="employee-bottom-navigation">
        <button
          className={`employee-nav-tab ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => handleTabClick("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`employee-nav-tab ${activeTab === "tasks" ? "active" : ""}`}
          onClick={() => handleTabClick("tasks")}
        >
          Tasks
        </button>
        <button
          className={`employee-nav-tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => handleTabClick("profile")}
        >
          Profile
        </button>
      </div>
    </div>
  );
};

export default EmployeePage;
