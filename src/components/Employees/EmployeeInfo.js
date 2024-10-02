import React, { useState } from 'react';
import './EmployeeInfo.css';

const EmployeeInfo = ({ employeeId }) => {
  const [workOrders, setWorkOrders] = useState([
    { id: 101, description: 'Clean Restroom A', status: 'open' },
    { id: 102, description: 'Repair Sink in Restroom B', status: 'open' },
    { id: 103, description: 'Inspect Restroom C', status: 'completed' },
  ]);
  
  const employee = {
    id: employeeId,
    name: "Reuben Tudball",
    role: "Sanitation Specialist",
    phone: "(555) 123-4567",
    assignedWorkOrders: 5,
    workInProgress: 3,
    completed: 2,
  };

  const handleAssignWorkOrder = (workOrderId) => {
    const updatedWorkOrders = workOrders.map(order => 
      order.id === workOrderId ? { ...order, status: 'assigned' } : order
    );
    setWorkOrders(updatedWorkOrders);
  };

  return (
    <div className="employee-info-page">
      <h2>{employee.name} - {employee.role}</h2>
      <p><strong>Phone:</strong> {employee.phone}</p>
      <p><strong>Assigned Work Orders:</strong> {employee.assignedWorkOrders}</p>
      <p><strong>Work In Progress:</strong> {employee.workInProgress}</p>
      <p><strong>Completed Work Orders:</strong> {employee.completed}</p>

      <h3>Open Work Orders</h3>
      <ul>
        {workOrders.filter(order => order.status === 'open').map((order) => (
          <li key={order.id}>
            {order.description}
            <button onClick={() => handleAssignWorkOrder(order.id)}>Assign</button>
          </li>
        ))}
      </ul>

      <h3>Assigned Work Orders</h3>
      <ul>
        {workOrders.filter(order => order.status === 'assigned').map((order) => (
          <li key={order.id}>{order.description}</li>
        ))}
      </ul>
      <button className='save-button'>Save</button>
    </div>
  );
};

export default EmployeeInfo;
