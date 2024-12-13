import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { fetchWorkOrdersByEmployee, updateWorkOrderStatus } from "../../Repo/workOrderRepository";
import "./EmployeeTasks.css";

const EmployeeTasks = () => {
  const { user } = useUser();
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployeeWorkOrders = async () => {
      try {
        setLoading(true);
        if (!user?.id) {
          throw new Error("User ID is missing.");
        }
        const employeeWorkOrders = await fetchWorkOrdersByEmployee(user.id);
        console.log("Employee work orders:", employeeWorkOrders);
        setWorkOrders(employeeWorkOrders);
      } catch (err) {
        console.error("Error fetching work orders:", err);
        setError("Failed to load work orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeWorkOrders();
  }, [user]);

  const handleUpdateStatus = async (workOrderId, newStatus) => {
    try {
      await updateWorkOrderStatus(workOrderId, newStatus);
      setWorkOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === workOrderId ? { ...order, status: newStatus } : order
        )
      );
      alert("Status updated successfully.");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  if (loading) {
    return <div className="employee-tasks-page">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="employee-tasks-page">
      <h1 className="page-title">Your Tasks</h1>

      <div className="tasks-section">
        <h2 className="section-title">Assigned Work Orders</h2>
        <ul className="tasks-list">
          {workOrders
            .filter((order) => order.status === "assigned")
            .map((order) => (
              <li key={order.id} className="task-item">
                <div className="task-item-details">
                  <p>{order.description}</p>
                  <p>
                    <strong>Due Date:</strong> {order.dueDate || "N/A"}
                  </p>
                </div>
                <button
                  className="status-button"
                  onClick={() => handleUpdateStatus(order.id, "in progress")}
                >
                  Start Work
                </button>
              </li>
            ))}
        </ul>
      </div>

      <div className="tasks-section">
        <h2 className="section-title">In Progress</h2>
        <ul className="tasks-list">
          {workOrders
            .filter((order) => order.status === "in progress")
            .map((order) => (
              <li key={order.id} className="task-item">
                <div className="task-item-details">
                  <p>{order.description}</p>
                  <p>
                    <strong>Started On:</strong> {order.startDate || "N/A"}
                  </p>
                </div>
                <button
                  className="status-button complete"
                  onClick={() => handleUpdateStatus(order.id, "completed")}
                >
                  Mark as Completed
                </button>
              </li>
            ))}
        </ul>
      </div>

      <div className="tasks-section">
        <h2 className="section-title">Completed</h2>
        <ul className="tasks-list">
          {workOrders
            .filter((order) => order.status === "completed")
            .map((order) => (
              <li key={order.id} className="task-item completed">
                <p>{order.description}</p>
                <p>
                  <strong>Completed On:</strong> {order.completedDate || "N/A"}
                </p>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default EmployeeTasks;
