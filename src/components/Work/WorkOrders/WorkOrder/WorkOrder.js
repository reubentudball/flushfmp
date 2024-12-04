import React, {useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {getEmployeeById} from "../../../Repo/employeeRepository";
import {capitalizeStatus} from "../../../Util/util";
import "./WorkOrder.css";

const WorkOrder = () => {
  const location = useLocation();
  const [workOrder, setWorkOrder] = useState(location.state?.order || null); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const loadEmployee = async () => {
      if (!workOrder?.employeeId) {  
        setLoading(false);
        return;
      }
      try {
        const data = await getEmployeeById(workOrder.employeeId);
        setEmployee(data);
      } catch (error) {
        console.log("Error fetching employee: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    loadEmployee();
  }, [workOrder?.employeeId]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!workOrder) {
    return <div>Work order not found.</div>;
  }


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
          {employee ? (
            <ul className="work-order-list">
                <li key={employee.id} className="work-order-list-item">
                  <strong>{employee.firstName} {employee.lastName}</strong>
                  <p>Employee ID: {employee.id}</p>
                  <p>Role: {employee.role || "Not specified"}</p>
                </li>
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
