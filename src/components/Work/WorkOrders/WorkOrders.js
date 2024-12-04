import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchWorkOrders } from "../../Repo/workOrderRepository";
import { formatTimestamp, capitalizeStatus } from "../../Util/util";
import "./WorkOrders.css";

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [groupedWorkOrders, setGroupedWorkOrders] = useState({});
  const [groupBy, setGroupBy] = useState("bathroom"); 
  const [sortOption, setSortOption] = useState("alphabetical"); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadWorkOrders = async () => {
      try {
        const data = await fetchWorkOrders();
        setWorkOrders(data);
        groupAndSortWorkOrders(data, "bathroom", "alphabetical");
      } catch (error) {
        console.error("Error fetching work orders:", error);
      }
    };

    loadWorkOrders();
  }, []);

  const groupAndSortWorkOrders = (orders, groupKey, sortKey) => {
    const grouped = orders.reduce((acc, order) => {
      const key =
        groupKey === "bathroom"
          ? order.bathrooms?.[0]?.title || "No Bathroom"
          : order.status || "No Status";

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(order);
      return acc;
    }, {});

    for (const group in grouped) {
      grouped[group].sort((a, b) => {
        switch (sortKey) {
          case "alphabetical":
            return a.title.localeCompare(b.title);
          case "date":
            return new Date(a.createdAt) - new Date(b.createdAt);
          default:
            return 0;
        }
      });
    }

    setGroupedWorkOrders(grouped);
  };

  const handleGroupChange = (e) => {
    const newGroupBy = e.target.value;
    setGroupBy(newGroupBy);
    groupAndSortWorkOrders(workOrders, newGroupBy, sortOption);
  };

  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    groupAndSortWorkOrders(workOrders, groupBy, newSortOption);
  };

  const handleWorkOrderClick = (order) => {
    navigate(`${location.pathname}/${order.id}`, { state: { order } });
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

      <div className="controls">
        <div className="control-group">
          <label htmlFor="group-by">Group by:</label>
          <select id="group-by" value={groupBy} onChange={handleGroupChange}>
            <option value="bathroom">Bathroom</option>
            <option value="status">Status</option>
          </select>
        </div>
        <div className="control-sort">
          <label htmlFor="sort-by">Sort by:</label>
          <select id="sort-by" value={sortOption} onChange={handleSortChange}>
            <option value="alphabetical">Alphabetical</option>
            <option value="date">Date Created</option>
          </select>
        </div>
      </div>

      {Object.keys(groupedWorkOrders).length === 0 ? (
        <div className="no-work-orders">No work orders available.</div>
      ) : (
        <div className="work-orders-grouped">
          {Object.entries(groupedWorkOrders).map(([groupName, orders]) => (
            <div key={groupName} className="work-order-group">
              <h3 className="group-title">{capitalizeStatus(groupName)}</h3>
              <div className="work-orders-list">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="work-order-item"
                    onClick={() => handleWorkOrderClick(order)}
                  >
                    <div className="work-order-item-title">{order.title}</div>
                    <div className="work-order-item-detail">
                      <strong>Status:</strong> {capitalizeStatus(order.status)}
                    </div>
                    <div className="work-order-item-detail">
                      <strong>Description:</strong>{" "}
                      {order.description || "No Description"}
                    </div>
                    <div className="work-order-item-detail">
                      <strong>Created At:</strong>{" "}
                      {formatTimestamp(order.createdAt) || "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkOrders;
