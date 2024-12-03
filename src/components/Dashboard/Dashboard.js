import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
  ArcElement
);

const ChartCard = ({ title, ChartComponent, data }) => (
  <div className="chart-card">
    <h3 className="chart-card-title">{title}</h3>
    <div className="chart-wrapper">
      <ChartComponent data={data} />
    </div>
  </div>
);

const Dashboard = () => {
  const chartsConfig = [
    {
      id: 'cleanliness-trend',
      title: 'Cleanliness Trend',
      component: Line,
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Average Cleanliness Rating',
            data: [3.8, 4.2, 3.9, 4.1, 4.3, 4.0], 
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
          },
        ],
      },
    },
    {
      id: 'tickets-breakdown',
      title: 'Tickets Breakdown',
      component: Doughnut,
      data: {
        labels: [
          'Broken Equipment',
          'Unclean',
          'No Supplies',
          'Odor',
          'Flooding',
          'Other',
        ],
        datasets: [
          {
            label: 'Tickets Breakdown',
            data: [10, 15, 8, 5, 3, 2],
            backgroundColor: [
              'rgba(255,99,132,0.5)',
              'rgba(54,162,235,0.5)',
              'rgba(255,206,86,0.5)',
              'rgba(75,192,192,0.5)',
              'rgba(153,102,255,0.5)',
              'rgba(255,159,64,0.5)',
            ],
          },
        ],
      },
    },
    {
      id: 'health-score-trend',
      title: 'Health Score Trend',
      component: Line,
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Health Score',
            data: [85, 87, 83, 89, 88, 90], 
            backgroundColor: 'rgba(153,102,255,0.2)',
            borderColor: 'rgba(153,102,255,1)',
            borderWidth: 2,
          },
        ],
      },
    },
    {
      id: 'work-order-status',
      title: 'Work Order Status Breakdown',
      component: Bar,
      data: {
        labels: ['Open', 'Assigned', 'In Progress', 'Closed'],
        datasets: [
          {
            label: 'Work Order Status',
            data: [12, 8, 15, 20],
            backgroundColor: [
              'rgba(255,99,132,0.5)',
              'rgba(54,162,235,0.5)',
              'rgba(255,206,86,0.5)',
              'rgba(75,192,192,0.5)',
            ],
          },
        ],
      },
    },
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2 className="dashboard-title">Dashboard</h2>
        <p className="dashboard-description">
          Overview of restroom trends for the entire facility:
        </p>
      </header>
      <div className="charts-grid">
        {chartsConfig.map(({ id, title, component: ChartComponent, data }) => (
          <ChartCard key={id} title={title} ChartComponent={ChartComponent} data={data} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
