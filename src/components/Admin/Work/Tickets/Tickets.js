import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchReportsByFacility } from "../../../Repo/ticketRepository";
import { fetchWorkOrders } from "../../../Repo/workOrderRepository";
import { useUser } from "../../../context/UserContext";
import "./Tickets.css";

const Tickets = () => {
  const { facility } = useUser();
  const [ticketsByBathroom, setTicketsByBathroom] = useState({});
  const [ticketsByWorkOrder, setTicketsByWorkOrder] = useState({});
  const [unassignedTickets, setUnassignedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grouping, setGrouping] = useState("bathroom");
  const navigate = useNavigate();

  useEffect(() => {
    const loadTickets = async () => {
      try {
        if (!facility) {
          console.error("No facility selected.");
          return;
        }
    
        const reportsByBathroom = await fetchReportsByFacility(facility.facilityId); 
        const workOrders = await fetchWorkOrders(); 
    
        const ticketsByWorkOrder = {};
        const unassociatedTickets = [];
    
        Object.entries(reportsByBathroom).forEach(([bathroomID, { tickets }]) => {
          tickets.forEach((ticket) => {
            const associatedWorkOrder = workOrders.find((wo) =>
              wo.tickets.some((t) => t.id === ticket.id) 
            );
    
            if (associatedWorkOrder) {
              if (!ticketsByWorkOrder[associatedWorkOrder.id]) {
                ticketsByWorkOrder[associatedWorkOrder.id] = {
                  workOrder: associatedWorkOrder,
                  tickets: [],
                };
              }
              ticketsByWorkOrder[associatedWorkOrder.id].tickets.push(ticket);
            } else {
              unassociatedTickets.push(ticket);
            }
          });
        });
    
        setTicketsByBathroom(reportsByBathroom);
        setTicketsByWorkOrder(ticketsByWorkOrder);
        setUnassignedTickets(unassociatedTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    

    loadTickets();
  }, [facility]);

  const handleCreateWorkOrder = (ticketId) => {
    navigate(`/admin/work-management/work-orders/new`, { state: { ticketId } });
  };

  const renderTickets = (tickets) =>
      tickets.map((ticket) => (
        <div key={ticket.id} className="ticket-item">
          <h4>{ticket.category}</h4>
          <p><strong>Reported By:</strong> {ticket.userId}</p>
          <p><strong>Description:</strong> {ticket.description}</p>
          <p>
            <strong>Reported On:</strong>{" "}
            {ticket.timestamp ? ticket.timestamp.toLocaleString() : "N/A"}
          </p>
          <button onClick={() => handleCreateWorkOrder(ticket.id)}>
            Create Work Order
          </button>
        </div>
      ))
  
  if (loading) return <div className="tickets-container">Loading tickets...</div>;

  return (
    <div className="tickets-container">
      <div className="tickets-header">
        <h2>Tickets</h2>
        <div className="group-toggle">
          <button
            className={`group-toggle-button ${grouping === "bathroom" ? "active" : ""}`}
            onClick={() => setGrouping("bathroom")}
          >
            Group by Bathroom
          </button>
          <button
            className={`group-toggle-button ${grouping === "workOrder" ? "active" : ""}`}
            onClick={() => setGrouping("workOrder")}
          >
            Group by Work Order
          </button>
        </div>
      </div>

      {grouping === "bathroom" && (
        Object.entries(ticketsByBathroom).map(([bathroomID, { name, tickets }]) => (
          tickets.length > 0 && 
          <div key={bathroomID} className="bathroom-section">
            <h3>{name}</h3>
            <div className="tickets-list">{renderTickets(tickets)}</div>
          </div>
        ))
      )}

      {grouping === "workOrder" && (
        <>
          {unassignedTickets.length > 0 && (
          <div className="work-order-section">
            <h3>Unassigned Tickets</h3>
            <div className="tickets-list">{renderTickets(unassignedTickets)}</div>
          </div>
          )}
          {Object.entries(ticketsByWorkOrder).map(([workOrderId, { workOrder, tickets }]) => (
            <div key={workOrderId} className="work-order-section">
              <h3>Work Order: {workOrder.description}</h3>
              <div className="tickets-list">{renderTickets(tickets)}</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Tickets;
