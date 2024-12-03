import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createWorkOrder } from "../../../Repo/workOrderRepository";
import { useUser } from "../../../context/UserContext";
import { getBathroomsByFacility } from "../../../Repo/bathroomRepository";
import { getTicketsFromBathroom } from "../../../Repo/ticketRepository";
import { formatTimestamp } from "../../../Util/util";
import "./CreateWorkOrder.css";



const CreateWorkOrder = () => {
  const { facility } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const prefilledBathroom = location.state?.bathroom || null;
  const prefilledTicket = location.state?.ticket || null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bathrooms, setBathrooms] = useState([]);
  const [selectedBathrooms, setSelectedBathrooms] = useState(
    prefilledBathroom ? [prefilledBathroom.id] : []
  );
  const [bathroomTickets, setBathroomTickets] = useState({});
  const [selectedTickets, setSelectedTickets] = useState(
    prefilledTicket ? [prefilledTicket.id] : []
  );

  useEffect(() => {
    const loadBathrooms = async () => {
      try {
        const bathroomList = await getBathroomsByFacility(facility.facilityId);
        setBathrooms(bathroomList);
      } catch (error) {
        console.error("Error loading bathrooms:", error);
      }
    };

    loadBathrooms();
  }, [facility.facilityId]);

  const handleBathroomSelection = async (bathroomId) => {
    const isSelected = selectedBathrooms.includes(bathroomId);

    if (isSelected) {
      setSelectedBathrooms(selectedBathrooms.filter((id) => id !== bathroomId));
      setBathroomTickets((prev) => {
        const { [bathroomId]: _, ...rest } = prev;
        return rest;
      });
    } else {
      setSelectedBathrooms([...selectedBathrooms, bathroomId]);

      try {
        const tickets = await getTicketsFromBathroom(bathroomId);
        setBathroomTickets((prev) => ({ ...prev, [bathroomId]: tickets }));
      } catch (error) {
        console.error(`Error fetching tickets for bathroom ${bathroomId}:`, error);
      }
    }
  };

  const handleTicketSelection = (ticketId) => {
    if (selectedTickets.includes(ticketId)) {
      setSelectedTickets(selectedTickets.filter((id) => id !== ticketId));
    } else {
      setSelectedTickets([...selectedTickets, ticketId]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const workOrderData = {
      title,
      description,
      createdAt: new Date(),
      status: "Open",
      bathrooms: selectedBathrooms,
      tickets: selectedTickets,
    };

    try {
      await createWorkOrder(workOrderData);
      alert("Work Order Created Successfully");
      navigate("/admin/work-management/work-orders");
    } catch (error) {
      console.error("Error creating work order:", error);
      alert("Error creating work order. Please try again.");
    }
  };

  return (
    <div className="create-work-order-container">
      <h2>Create Work Order</h2>
      <form onSubmit={handleSubmit} className="work-order-form">
        <div className="form-group">
          <label htmlFor="title">Work Order Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter work order title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter work order description"
            rows="4"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="bathrooms">Attach Bathrooms</label>
          <div className="bathroom-list">
            {bathrooms.map((bathroom) => (
              <div key={bathroom.id} className="bathroom-item">
                <input
                  type="checkbox"
                  id={`bathroom-${bathroom.id}`}
                  checked={selectedBathrooms.includes(bathroom.id)}
                  onChange={() => handleBathroomSelection(bathroom.id)}
                />
                <label htmlFor={`bathroom-${bathroom.id}`}>
                  {bathroom.title || "Unnamed Bathroom"}
                </label>

                {selectedBathrooms.includes(bathroom.id) && (
                  <div className="ticket-list">
                    {bathroomTickets[bathroom.id]?.map((ticket) => (
                      <div key={ticket.id} className="ticket-item">
                        <input
                          type="checkbox"
                          id={`ticket-${ticket.id}`}
                          checked={selectedTickets.includes(ticket.id)}
                          onChange={() => handleTicketSelection(ticket.id)}
                        />
                        <label htmlFor={`ticket-${ticket.id}`}>
                          {ticket.category || "No Category"}
                        </label>

                        <div className="ticket-hover-menu">
                          <p>
                            <strong>Description:</strong> {ticket.description}
                          </p>
                          <p>
                            <strong>Timestamp:</strong>{" "}
                            {ticket.timestamp
                              ? formatTimestamp(ticket.timestamp)
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button">
          Create Work Order
        </button>
      </form>
    </div>
  );
};

export default CreateWorkOrder;
