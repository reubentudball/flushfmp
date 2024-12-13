import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getEmployeeById,
  getWorkOrdersByEmployee,
  assignWorkOrderToEmployee,
} from "../../../Repo/employeeRepository";
import { getOpenWorkOrders } from "../../../Repo/workOrderRepository";
import "./EmployeeInfo.css";

const EmployeeInfo = () => {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [employeeWorkOrders, setEmployeeWorkOrders] = useState([]);
  const [openWorkOrders, setOpenWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        const fetchedEmployee = await getEmployeeById(employeeId);
        const fetchedEmployeeWorkOrders = await getWorkOrdersByEmployee(employeeId);
        const fetchedOpenWorkOrders = await getOpenWorkOrders();

        setEmployee(fetchedEmployee);
        setEmployeeWorkOrders(fetchedEmployeeWorkOrders);
        setOpenWorkOrders(fetchedOpenWorkOrders);
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
    try {
      await assignWorkOrderToEmployee(workOrderId, employeeId);
      const assignedWorkOrder = openWorkOrders.find((order) => order.id === workOrderId);

      setEmployeeWorkOrders((prev) => [...prev, { ...assignedWorkOrder, status: "assigned" }]);
      setOpenWorkOrders((prev) => prev.filter((order) => order.id !== workOrderId));
      alert("Work order assigned successfully.");
    } catch (err) {
      console.error("Error assigning work order:", err);
      alert("Failed to assign work order. Please try again.");
    }
  };

  if (loading) {
    return <div className="employee-info-page">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!employee) {
    return <div className="employee-info-page">No employee found.</div>;
  }

  return (
    <div className="employee-info-page">
      <div className="employee-info-header">
        <div className="employee-info-header-title">
          {employee.firstName} {employee.lastName}
        </div>
        <div className="employee-info-header-phone">
          <strong>Phone:</strong> {employee.phone}
        </div>
      </div>

      <div className="work-order-stats">
        <div className="stat-item">
          <div className="stat-item-label">Assigned Work Orders</div>
          <div className="stat-item-value">
            {employeeWorkOrders.filter((order) => order.status === "assigned").length}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-item-label">Work In Progress</div>
          <div className="stat-item-value">
            {employeeWorkOrders.filter((order) => order.status === "in progress").length}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-item-label">Completed Work Orders</div>
          <div className="stat-item-value">
            {employeeWorkOrders.filter((order) => order.status === "completed").length}
          </div>
        </div>
      </div>

      <div className="work-order-section">
        <div className="work-order-section-title">All Open Work Orders</div>
        <ul className="work-order-list">
          {openWorkOrders.map((order) => (
            <li key={order.id} className="employee-info-work-order-item">
              <div className="work-order-item-description">{order.description}</div>
              <button
                className="assign-button"
                onClick={() => handleAssignWorkOrder(order.id)}
              >
                Assign
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="work-order-section">
        <div className="work-order-section-title">Assigned Work Orders</div>
        <ul className="work-order-list">
          {employeeWorkOrders
            .filter((order) => order.status === "assigned")
            .map((order) => (
              <li key={order.id} className="employee-info-work-order-item">
                {order.description}
              </li>
            ))}
        </ul>
      </div>

      <div className="work-order-section">
        <div className="work-order-section-title">In Progress</div>
        <ul className="work-order-list">
          {employeeWorkOrders
            .filter((order) => order.status === "in progress")
            .map((order) => (
              <li key={order.id} className="employee-info-work-order-item">
                {order.description}
              </li>
            ))}
        </ul>
      </div>

      <div className="work-order-section">
        <div className="work-order-section-title">Completed Work Orders</div>
        <ul className="work-order-list">
          {employeeWorkOrders
            .filter((order) => order.status === "completed")
            .map((order) => (
              <li key={order.id} className="employee-info-work-order-item">
                {order.description}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default EmployeeInfo;
