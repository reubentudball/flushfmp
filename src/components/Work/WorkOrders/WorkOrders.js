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
      <div className="work-orders-header">
        <div className="work-orders-header-title">Work Orders</div>
        <button
          className="add-work-order-button"
          onClick={() => navigate(`${location.pathname}/new`)}
        >
          Create New Work Order
        </button>
      </div>
      {workOrders.length === 0 ? (
        <div className="no-work-orders">No work orders available.</div>
      ) : (
        <div className="work-orders-list">
          {workOrders.map((order) => (
            <div
              key={order.id}
              className="work-order-item"
              onClick={() => handleWorkOrderClick(order.id)}
            >
              <div className="work-order-item-title">{order.title}</div>
              <div className="work-order-item-detail">
                <strong>Status:</strong> {order.status}
              </div>
              <div className="work-order-item-detail">
                <strong>Description:</strong> {order.description || "No Description"}
              </div>
              <div className="attached-bathrooms">
                <strong>Bathrooms:</strong>
                {order.bathrooms?.length > 0 ? (
                  <ul>
                    {order.bathrooms.map((bathroom) => (
                      <li key={bathroom.id}>
                        {bathroom.title || "Unnamed Bathroom"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No bathrooms attached</p>
                )}
              </div>
              <div className="attached-tickets">
                <strong>Tickets:</strong>
                {order.tickets?.length > 0 ? (
                  <ul>
                    {order.tickets.map((ticket) => (
                      <li key={ticket.id}>
                        <div className="work-order-item-detail">
                          <strong>Category:</strong> {ticket.category}
                        </div>
                        <div className="work-order-item-detail">
                          <strong>Description:</strong> {ticket.description}
                        </div>
                        <div className="work-order-item-detail">
                          <strong>Reported At:</strong>{" "}
                          {new Date(ticket.timestamp.seconds * 1000).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No tickets attached</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkOrders;
