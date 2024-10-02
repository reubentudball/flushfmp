import React, { useState } from 'react';
import { FaTh, FaList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Employees.css';

const Employees = () => {
  const [viewType, setViewType] = useState('card'); 
  const navigate = useNavigate();

  const employees = [
    {
      name: "Reuben Tudball",
      role: "Sanitation Specialist",
      phone: "(555) 123-4567",
      assignedWorkOrders: 5,
      workInProgress: 3,
      completed: 2,
    },
    {
      name: "Tyler Makris",
      role: "Maintenance Technician",
      phone: "(555) 987-6543",
      assignedWorkOrders: 7,
      workInProgress: 4,
      completed: 3,
    },
    {
      name: "Harris Mahmood",
      role: "Facility Inspector",
      phone: "(555) 555-5555",
      assignedWorkOrders: 3,
      workInProgress: 1,
      completed: 2,
    },
  ];

  const handleEmployeeClick = (id) => {
    navigate(`/admin/employees/${id}`);
  }

  return (
    <div className="employees-container">
      <h2>Employees and Work Orders</h2>

      <div className="toggle-buttons">
        <button onClick={() => setViewType('card')}>
          <FaTh /> 
        </button>
        <button onClick={() => setViewType('list')}>
          <FaList /> 
        </button>
      </div>

      <div className={viewType === 'card' ? 'employee-list card-view' : 'employee-list list-view'}>
        {employees.map((employee, index) => (
          <div className={viewType === 'card' ? 'employee-card' : 'employee-list-item'} key={index} onClick={handleEmployeeClick}>
            <h3>{employee.name}</h3>
            <p><strong>Role:</strong> {employee.role}</p>
            <p><strong>Phone:</strong> {employee.phone}</p>
            <p><strong>Assigned Work Orders:</strong> {employee.assignedWorkOrders}</p>
            <p><strong>Work In Progress:</strong> {employee.workInProgress}</p>
            <p><strong>Completed Work Orders:</strong> {employee.completed}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employees;
