import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchReportsByFacility } from "../../Repo/ticketRepository";
import { useUser } from "../../context/UserContext";
import "./Tickets.css";

const Tickets = () => {
  const { facility } = useUser();
  const [groupedTickets, setGroupedTickets] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTickets = async () => {
      try {
        if (!facility) {
          console.error("No facility selected.");
          return;
        }

        const reportsByBathroom = await fetchReportsByFacility(facility.facilityId);
        setGroupedTickets(reportsByBathroom);
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

  if (loading) {
    return <div className="tickets-container">Loading tickets...</div>;
  }

  if (Object.keys(groupedTickets).length === 0) {
    return <div className="tickets-container">No tickets available for this facility.</div>;
  }

  return (
    <div className="tickets-container">
      <h2>Tickets Grouped by Bathroom</h2>
      {Object.entries(groupedTickets).map(([bathroomID, { name, tickets }]) => (
        <div key={bathroomID} className="bathroom-section">
          <h3>{name}</h3>
          <div className="tickets-list">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-item">
                <h4>{ticket.category}</h4>
                <p>
                  <strong>Reported By:</strong> {ticket.userId}
                </p>
                <p>
                  <strong>Description:</strong> {ticket.description}
                </p>
                <p>
                  <strong>Reported On:</strong>{" "}
                  {ticket.timestamp ? ticket.timestamp.toLocaleString() : "N/A"}
                </p>
                <button onClick={() => handleCreateWorkOrder(ticket.id)}>
                  Create Work Order
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tickets;
