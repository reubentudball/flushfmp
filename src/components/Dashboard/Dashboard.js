import React from 'react';
import { Line, Bar, Pie, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const Dashboard = () => {
  const cleanlinessData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Average Cleanliness Rating',
        data: [4.5, 4.7, 4.6, 4.8, 4.6, 4.9],
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
      },
    ],
  };

  const busynessData = {
    labels: ['Restroom A', 'Restroom B', 'Restroom C', 'Restroom D'],
    datasets: [
      {
        label: 'Average Daily Visitors',
        data: [100, 200, 150, 170],
        backgroundColor: [
          'rgba(255,206,86,0.2)',
          'rgba(75,192,192,0.2)',
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54,162,235,1)',
          'rgba(255,206,86,1)',
          'rgba(75,192,192,1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const ticketsData = {
    labels: ['Sanitation', 'Broken Equipment', 'Other'],
    datasets: [
      {
        label: 'Help Tickets by Category',
        data: [5, 10, 3],
        backgroundColor: [
          'rgba(255,99,132,0.2)',
          'rgba(54,162,235,0.2)',
          'rgba(255,206,86,0.2)',
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54,162,235,1)',
          'rgba(255,206,86,1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const timeSpentData = {
    labels: ['Restroom A', 'Restroom B', 'Restroom C', 'Restroom D'],
    datasets: [
      {
        label: 'Average Time Spent (mins)',
        data: [5, 7, 3, 6],
        backgroundColor: [
          'rgba(255,99,132,0.5)',
          'rgba(54,162,235,0.5)',
          'rgba(255,206,86,0.5)',
          'rgba(75,192,192,0.5)',
        ],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <h2>Dashboard</h2>
        <p>Overview of restroom trends for the entire facility:</p>

        <div className="charts-grid">
          <div className="chart-container chart1">
            <h3>Cleanliness Trend</h3>
            <Line data={cleanlinessData} />
          </div>

          <div className="chart-container chart2">
            <h3>Restroom Busyness</h3>
            <Bar data={busynessData} />
          </div>

          <div className="chart-container chart3">
            <h3>Help Tickets by Category</h3>
            <Pie data={ticketsData} />
          </div>

          <div className="chart-container chart4">
            <h3>Average Time Spent in Restrooms</h3>
            <PolarArea data={timeSpentData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
