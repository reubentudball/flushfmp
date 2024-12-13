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
import './EmployeeDashboard.css';

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
  <div className="employee-dashboard-chart-card">
    <h3 className="employee-dashboard-chart-card-title">{title}</h3>
    <div className="employee-dashboard-chart-wrapper">
      <ChartComponent data={data} />
    </div>
  </div>
);

const EmployeeDashboard = () => {
  const chartsConfig = [
    {
      id: 'tickets-completed-category',
      title: 'Tickets Completed by Category',
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
            label: 'Tickets Completed',
            data: [12, 18, 5, 7, 4, 3],
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
      id: 'tasks-completion-trend',
      title: 'Tasks Completion Trend',
      component: Line,
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Tasks Completed',
            data: [7, 9, 12, 15],
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
          },
        ],
      },
    },
    {
      id: 'performance-comparison',
      title: 'Performance Comparison',
      component: Bar,
      data: {
        labels: ['You', 'Team Average', 'Top Performer'],
        datasets: [
          {
            label: 'Tasks Completed',
            data: [34, 28, 45],
            backgroundColor: [
              'rgba(255,99,132,0.5)',
              'rgba(54,162,235,0.5)',
              'rgba(255,206,86,0.5)',
            ],
          },
        ],
      },
    },
    {
      id: 'average-completion-time',
      title: 'Average Completion Time by Category',
      component: Bar,
      data: {
        labels: ['Broken Equipment', 'Unclean', 'No Supplies', 'Odor'],
        datasets: [
          {
            label: 'Completion Time (hrs)',
            data: [3.2, 2.5, 1.8, 2.7],
            backgroundColor: [
              'rgba(153,102,255,0.5)',
              'rgba(255,159,64,0.5)',
              'rgba(54,162,235,0.5)',
              'rgba(75,192,192,0.5)',
            ],
          },
        ],
      },
    },
    {
      id: 'workload-breakdown',
      title: 'Current Workload Breakdown',
      component: Doughnut,
      data: {
        labels: ['Completed', 'In Progress', 'Assigned'],
        datasets: [
          {
            label: 'Workload',
            data: [45, 12, 8],
            backgroundColor: [
              'rgba(54,162,235,0.5)',
              'rgba(255,206,86,0.5)',
              'rgba(255,99,132,0.5)',
            ],
          },
        ],
      },
    },
  ];

  return (
    <div className="employee-dashboard">
      <header className="employee-dashboard-header">
        <h2 className="employee-dashboard-title">Employee Dashboard</h2>
        <p className="employee-dashboard-description">
          Overview of your work performance and tasks:
        </p>
      </header>
      <div className="employee-dashboard-charts-grid">
        {chartsConfig.map(({ id, title, component: ChartComponent, data }) => (
          <ChartCard key={id} title={title} ChartComponent={ChartComponent} data={data} />
        ))}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
