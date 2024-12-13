import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchRecentLogs } from "../../Repo/LogRepository";
import { useUser } from "../../context/UserContext"; 
import "./Home.css";

const Home = () => {
  const { facility } = useUser(); 
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadLogsForFacility = async () => {
      if (!facility || !facility.adminIds) {
        console.warn("Facility data or admin IDs not available.");
        return;
      }

      try {
        const fetchedLogs = await fetchRecentLogs(facility.adminIds); 
        setLogs(
          fetchedLogs.map((log) => ({
            ...log,
            timestamp: log.timestamp
              ? log.timestamp.toDate().toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Unknown date",
          }))
        );
      } catch (error) {
        console.error("Error loading recent activity logs:", error);
      }
    };

    loadLogsForFacility();
  }, [facility]);

  return (
    <div className="homepage-container">
      <div className="welcome-section">
        <h1>Flush Facilities Management Portal</h1>
        <p>
          Seamlessly manage work orders, employees, and restroom facilities.
        </p>
      </div>

      <div className="quick-links-section">
        <h2>Quick Links</h2>
        <div className="quick-links">
          <Link to="/admin/dashboard" className="homepage-link">
            Dashboard
          </Link>
          <Link to="/admin/facilities" className="homepage-link">
            Facilities
          </Link>
          <Link to="/admin/work-management" className="homepage-link">
            Work Management
          </Link>
        </div>
      </div>

      <div className="recent-activity-section">
        <h2>Recent Activity</h2>
        {logs.length === 0 ? (
          <p>No recent activity available.</p>
        ) : (
          <ul className="recent-activity-list">
            {logs.map((log, index) => (
              <li key={index} className="recent-activity-item">
                <span className="timestamp">{log.timestamp}</span> -{" "}
                <span className="actor-name">{log.actorName}</span>{" "}
                <span className="action">{log.action}</span>{" "}
                <span className="target-type">{log.targetType}</span> "
                <span className="target-name">{log.targetName}</span>"
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
