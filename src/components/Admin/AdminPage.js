import React, { useState } from "react";
import Navigation from "../Navigation/Navigation";
import "./AdminPage.css";
import { Outlet } from "react-router-dom";

const AdminPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`admin-page-container ${isCollapsed ? "collapsed" : ""}`}>
      <Navigation isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="admin-main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
