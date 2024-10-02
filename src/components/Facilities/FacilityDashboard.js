import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import './FacilityDashboard.css';

const FacilityDashboard = ({ facilityName }) => {
  const cleanlinessData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Cleanliness Rating',
        data: [4.2, 4.5, 4.0, 3.8, 4.1, 4.4],
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
      },
    ],
  };

  const visitorsData = {
    labels: ['Morning', 'Afternoon', 'Evening'],
    datasets: [
      {
        label: 'Visitors',
        data: [50, 100, 70],
        backgroundColor: ['rgba(54,162,235,0.6)', 'rgba(255,206,86,0.6)', 'rgba(75,192,192,0.6)'],
        borderColor: ['rgba(54,162,235,1)', 'rgba(255,206,86,1)', 'rgba(75,192,192,1)'],
        borderWidth: 2,
      },
    ],
  };

  const ticketsData = {
    labels: ['Sanitation', 'Broken Equipment', 'Other'],
    datasets: [
      {
        label: 'Open Tickets by Category',
        data: [1, 0, 1],
        backgroundColor: ['rgba(255,99,132,0.2)', 'rgba(54,162,235,0.2)', 'rgba(255,206,86,0.2)'],
        borderColor: ['rgba(255,99,132,1)', 'rgba(54,162,235,1)', 'rgba(255,206,86,1)'],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="facility-dashboard-container">
      <h2>{facilityName} Dashboard</h2>
      <div className="chart-grid">
        <div className="chart-container">
          <h3>Cleanliness Over Time</h3>
          <Line data={cleanlinessData} />
        </div>

        <div className="chart-container">
          <h3>Visitor Distribution</h3>
          <Bar data={visitorsData} />
        </div>

        <div className="chart-container">
          <h3>Open Help Tickets</h3>
          <Pie data={ticketsData} />
        </div>
      </div>
    </div>
  );
};

export default FacilityDashboard;
