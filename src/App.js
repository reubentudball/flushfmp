// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';
import Employees from './components/Employees/Employees';
import AdminPage from './components/Admin/AdminPage';
import Home from './components/Home/Home';
import Facilities from './components/Facilities/Facilities';
import FacilityDashboard from './components/Facilities/FacilityDashboard';
import EmployeeInfo from './components/Employees/EmployeeInfo';
import 'leaflet/dist/leaflet.css';
import toiletIcon from './assets/toilet-white.png';

const App = () => {

  React.useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = toiletIcon;
    document.head.appendChild(link);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="profile" element={<Profile/>} />
          <Route path="facilities" element={<Facilities/>} />
          <Route path="facilities/:facilityId" element={<FacilityDashboard />} />
          <Route path="employees" element={<Employees/>} />
          <Route path="employees/:employeeId" element={<EmployeeInfo />} />
        </Route>
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
