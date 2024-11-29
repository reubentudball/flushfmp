import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTickets } from "../../Repo/ticketRepository";
import "./Tickets.css";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await fetchTickets(); 
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    loadTickets();
  }, []);

  const handleCreateWorkOrder = (ticketId) => {
    navigate(`/admin/work-management/work-orders/new`, { state: { ticketId } });
  };

  return (
    <div className="tickets-container">
      <h2>Tickets</h2>
      <div className="tickets-list">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="ticket-item">
            <h3>{ticket.title}</h3>
            <p>
              <strong>Reported By:</strong> {ticket.reportedBy}
            </p>
            <p>
              <strong>Description:</strong> {ticket.description}
            </p>
            <button onClick={() => handleCreateWorkOrder(ticket.id)}>
              Create Work Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tickets;
