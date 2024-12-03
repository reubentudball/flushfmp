import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWorkOrderById } from "../../../Repo/workOrderRepository";
import "./WorkOrder.css";

const WorkOrder = () => {
  const { workOrderId } = useParams();
  const navigate = useNavigate();
  const [workOrder, setWorkOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWorkOrder = async () => {
      try {
        console.log("fetching work order by id", workOrderId);
        const data = await fetchWorkOrderById(workOrderId);
        setWorkOrder(data);
      } catch (error) {
        console.error("Error fetching work order:", error);
        setError("Failed to load work order. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadWorkOrder();
  }, [workOrderId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!workOrder) {
    return <div>Work order not found.</div>;
  }

  const capitalizeStatus = (status) =>
    status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className="work-order-container">
      <button className="work-order-back-button" onClick={() => navigate(-1)}>
        Back
      </button>
      <h2 className="work-order-title">{workOrder.title}</h2>
      <p className="work-order-detail">
        <strong>Status:</strong> {capitalizeStatus(workOrder.status)}
      </p>
      {workOrder.status.toLowerCase() === "assigned" && (
        <div className="work-order-section">
          <h3 className="work-order-section-title">Assigned Employees</h3>
          {workOrder.employees?.length > 0 ? (
            <ul className="work-order-list">
              {workOrder.employees.map((employee) => (
                <li key={employee.id} className="work-order-list-item">
                  <strong>{employee.name}</strong>
                  <p>Employee ID: {employee.id}</p>
                  <p>Role: {employee.role || "Not specified"}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="work-order-detail">No employees assigned to this work order.</p>
          )}
        </div>
      )}
      <p className="work-order-detail">
        <strong>Description:</strong> {workOrder.description || "No description provided"}
      </p>
      <p className="work-order-detail">
        <strong>Created At:</strong>{" "}
        {new Date(workOrder.createdAt.seconds * 1000).toLocaleString()}
      </p>
      <div className="work-order-section">
        <h3 className="work-order-section-title">Attached Bathrooms</h3>
        {workOrder.bathrooms?.length > 0 ? (
          <ul className="work-order-list">
            {workOrder.bathrooms.map((bathroom) => (
              <li key={bathroom.id} className="work-order-list-item">
                <strong>{bathroom.title || "Unnamed Bathroom"}</strong>
                <p>Bathroom ID: {bathroom.id}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="work-order-detail">No bathrooms attached to this work order.</p>
        )}
      </div>
      <div className="work-order-section">
        <h3 className="work-order-section-title">Attached Tickets</h3>
        {workOrder.tickets?.length > 0 ? (
          <ul className="work-order-list">
            {workOrder.tickets.map((ticket) => (
              <li key={ticket.id} className="work-order-list-item">
                <p>
                  <strong>Category:</strong> {ticket.category}
                </p>
                <p>
                  <strong>Description:</strong> {ticket.description}
                </p>
                <p>
                  <strong>Reported At:</strong>{" "}
                  {new Date(ticket.timestamp.seconds * 1000).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="work-order-detail">No tickets attached to this work order.</p>
        )}
      </div>
    </div>
  );
};

export default WorkOrder;
