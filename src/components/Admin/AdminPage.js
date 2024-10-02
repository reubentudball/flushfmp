import React from "react";
import Navigation from "../Navigation/Navigation";
import "./AdminPage.css";
import { Outlet } from "react-router-dom";

const AdminPage = () => {
    
    return (
        <div className="admin-page-container">
        <Navigation />
        <div className="admin-main-content">
            <Outlet />
        </div>
        </div>
    );
};

export default AdminPage;
