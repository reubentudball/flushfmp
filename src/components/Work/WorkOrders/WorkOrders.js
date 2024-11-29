import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchWorkOrders } from "../../Repo/workOrderRepository"; 
import "./WorkOrders.css";

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadWorkOrders = async () => {
      try {
        const data = await fetchWorkOrders(); 
        setWorkOrders(data);
      } catch (error) {
        console.error("Error fetching work orders:", error);
      }
    };

    loadWorkOrders();
  }, []);

  const handleWorkOrderClick = (id) => {
    navigate(`${location.pathname}/${id}`);
  };

  return (
    <div className="work-orders-container">
      <h2>Work Orders</h2>
      <button className="add-work-order-button" onClick={() => navigate(`${location.pathname}/new`)}>
        Create New Work Order
      </button>
      <div className="work-orders-list">
        {workOrders.map((order) => (
          <div
            key={order.id}
            className="work-order-item"
            onClick={() => handleWorkOrderClick(order.id)}
          >
            <h3>{order.title}</h3>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Assigned To:</strong> {order.assignedEmployee || "Unassigned"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkOrders;
