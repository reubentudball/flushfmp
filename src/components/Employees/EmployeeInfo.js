import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { getEmployeeById, getWorkOrdersByEmployee } from "../Repo/employeeRepository"; 
import "./EmployeeInfo.css";

const EmployeeInfo = () => {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);

        const fetchedEmployee = await getEmployeeById(employeeId);

        const fetchedWorkOrders = await getWorkOrdersByEmployee(employeeId);

        setEmployee(fetchedEmployee);
        setWorkOrders(fetchedWorkOrders);
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError("Failed to load employee data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [employeeId]);

  const handleAssignWorkOrder = async (workOrderId) => {
    const updatedWorkOrders = workOrders.map((order) =>
      order.id === workOrderId ? { ...order, status: "assigned" } : order
    );
    setWorkOrders(updatedWorkOrders);

  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!employee) {
    return <div>No employee found.</div>;
  }

  return (
    <div className="employee-info-page">
      <h2>
        {employee.firstName} {employee.lastName}
      </h2>
      <p>
        <strong>Phone:</strong> {employee.phone}
      </p>
      <p>
        <strong>Assigned Work Orders:</strong>{" "}
        {workOrders.filter((order) => order.status === "assigned").length}
      </p>
      <p>
        <strong>Work In Progress:</strong>{" "}
        {workOrders.filter((order) => order.status === "in progress").length}
      </p>
      <p>
        <strong>Completed Work Orders:</strong>{" "}
        {workOrders.filter((order) => order.status === "completed").length}
      </p>

      <h3>Open Work Orders</h3>
      <ul>
        {workOrders.filter((order) => order.status === "open").map((order) => (
          <li key={order.id}>
            {order.description}
            <button onClick={() => handleAssignWorkOrder(order.id)}>Assign</button>
          </li>
        ))}
      </ul>

      <h3>Assigned Work Orders</h3>
      <ul>
        {workOrders.filter((order) => order.status === "assigned").map((order) => (
          <li key={order.id}>{order.description}</li>
        ))}
      </ul>

      <button className="save-button">Save</button>
    </div>
  );
};

export default EmployeeInfo;
