import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchRecentLogs } from "../Repo/LogRepository";
import "./Home.css";

const Home = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const fetchedLogs = await fetchRecentLogs();
        const formattedLogs = fetchedLogs.map((log) => ({
          ...log,
          timestamp: log.timestamp
            ? log.timestamp.toDate().toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Unknown date", // Fallback for missing timestamps
        }));
        setLogs(formattedLogs);
      } catch (error) {
        console.error("Error loading recent activity logs:", error);
      }
    };

    loadLogs();
  }, []);

  return (
    <div className="homepage-container">
      <h2>Welcome to the Flush Facilities Management Portal</h2>
      <p>Manage work orders, employees, and restroom facilities with ease.</p>

      <div className="quick-links">
        <Link to="/admin/dashboard" className="homepage-link">
          Go to Dashboard
        </Link>
        <Link to="/admin/facilities" className="homepage-link">
          View Facilities
        </Link>
        <Link to="/admin/employees" className="homepage-link">
          Manage Employees
        </Link>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        {logs.length === 0 ? (
          <p>No recent activity available.</p>
        ) : (
          <ul>
            {logs.map((log, index) => (
              <li key={index}>
                <strong>{log.timestamp}</strong>: {log.actorName} {log.action} {log.targetType} "{log.targetName}"
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
