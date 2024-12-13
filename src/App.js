import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Public/Login/Login";
import Dashboard from "./components/Admin/Dashboard/Dashboard";
import Profile from "./components/Admin/Profile/Profile";
import Employees from "./components/Admin/Work/Employees/Employees";
import AdminPage from "./components/Admin/AdminPage";
import Home from "./components/Admin/Home/Home";
import Facilities from "./components/Admin/Facilities/Facilities";
import FacilityDashboard from "./components/Admin/Facilities/FacilityDashboard";
import EmployeeInfo from "./components/Admin/Work/Employees/EmployeeInfo";
import CreateAccount from "./components/Public/CreateAccount/CreateAccount";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { UserProvider } from "./components/context/UserContext";
import WorkManagement from "./components/Admin/Work/WorkManagement";
import WorkOrders from "./components/Admin/Work/WorkOrders/WorkOrders";
import Tickets from "./components/Admin/Work/Tickets/Tickets";
import CreateWorkOrder from "./components/Admin/Work/WorkOrders/CreateWorkOrder/CreateWorkOrder";
import WorkOrder from "./components/Admin/Work/WorkOrders/WorkOrder/WorkOrder";
import SubmitReview from "./components/Public/SubmitReview/SubmitReview";
import EmployeeSignup from "./components/Public/CreateAccount/EmployeeSignup";
import Unauthorized from "./components/Public/Auth/Unauthorized";
import EmployeeDashboard from "./components/Employee/EmployeeDashboard/EmployeeDashboard";
import EmployeePage from "./components/Employee/EmployeePage";
import EmployeeTasks from "./components/Employee/EmployeeTasks/EmployeeTasks";
import EmployeeProfile from "./components/Employee/EmployeeProfile/EmployeeProfile";

import "leaflet/dist/leaflet.css";
import toiletIcon from "./assets/toilet-white.png";

const App = () => {
  React.useEffect(() => {
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = toiletIcon;
    document.head.appendChild(link);
  }, []);


  // Theres role based routing in this app, so we need to wrap the entire app in the UserProvider. Dunno if this is the best way to do it, but it works.
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/employee-signup" element={<EmployeeSignup />} />
          <Route path="/submit-review/:bathroomId" element={<SubmitReview />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Management/Admin Routes */}
          <Route
            element={<ProtectedRoute allowedRoles={["admin", "management"]} />}
          >
            <Route path="/admin" element={<AdminPage />}>
              <Route index element={<Home />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="facilities" element={<Facilities />} />
              <Route path="facilities/:facilityId" element={<FacilityDashboard />} />
              <Route path="work-management" element={<WorkManagement />} />
              <Route path="work-management/employees" element={<Employees />} />
              <Route path="work-management/employees/:employeeId" element={<EmployeeInfo />} />
              <Route path="work-management/work-orders" element={<WorkOrders />} />
              <Route path="work-management/work-orders/:workOrderId" element={<WorkOrder />} />
              <Route path="work-management/work-orders/new" element={<CreateWorkOrder />} />
              <Route path="work-management/tickets" element={<Tickets />} />
            </Route>
          </Route>

          {/* Employee Routes */}
          <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
          <Route path="/employee" element={<EmployeePage />}>
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="tasks" element={<EmployeeTasks />} />
            <Route path="profile" element={<EmployeeProfile />} />
          </Route>
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
