import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import Employees from "./components/Work/Employees/Employees";
import AdminPage from "./components/Admin/AdminPage";
import Home from "./components/Home/Home";
import Facilities from "./components/Facilities/Facilities";
import FacilityDashboard from "./components/Facilities/FacilityDashboard";
import EmployeeInfo from "./components/Work/Employees/EmployeeInfo";
import CreateAccount from "./components/CreateAccount/CreateAccount";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { UserProvider } from "./components/context/UserContext";
import WorkManagement from "./components/Work/WorkManagement";
import WorkOrders from "./components/Work/WorkOrders/WorkOrders";
import Tickets from "./components/Work/Tickets/Tickets";
import CreateWorkOrder from "./components/Work/WorkOrders/CreateWorkOrder/CreateWorkOrder";
import WorkOrder from "./components/Work/WorkOrders/WorkOrder/WorkOrder";

import "leaflet/dist/leaflet.css";
import toiletIcon from "./assets/toilet-white.png";

const App = () => {
  React.useEffect(() => {
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = toiletIcon;
    document.head.appendChild(link);
  }, []);

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminPage />}>
              <Route index element={<Home />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />

              {/* Facilities routes */}
              <Route path="facilities" element={<Facilities />} />
              <Route path="facilities/:facilityId" element={<FacilityDashboard />} />

              {/* Work management routes */}
              <Route path="work-management" element={<WorkManagement />} />
              <Route path="work-management/employees" element={<Employees />} />
              <Route path="work-management/employees/:employeeId" element={<EmployeeInfo />} />
              <Route path="work-management/work-orders" element={<WorkOrders />} />
              <Route path="work-management/work-orders/:workOrderId" element={<WorkOrder />} />
              <Route path="work-management/work-orders/new" element={<CreateWorkOrder />} />
              <Route path="work-management/tickets" element={<Tickets />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
