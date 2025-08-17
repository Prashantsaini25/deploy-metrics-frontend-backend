import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

// ✅ API call function (was in api.js)
const API_URL = process.env.REACT_APP_API_URL || 'http://backend-service.dashboard';
const getMetrics = async () => {
  const res = await fetch(`${API_URL}/metrics`);
  return res.json();
};

// ✅ MetricCard component (was in MetricCard.js)
const MetricCard = ({ data }) => {
  const metricsToShow = ['cpu_usage_percent', 'latency_ms', 'memory_usage_mb', 'request_count'];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {metricsToShow.map((metric) => (
        <div key={metric} style={{ margin: 20 }}>
          <h3>{metric.replace(/_/g, ' ')}</h3>
          <LineChart width={300} height={200} data={data}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={metric} stroke="#8884d8" />
          </LineChart>
        </div>
      ))}
    </div>
  );
};

// ✅ Main App component (was in App.js)
function App() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMetrics();
        setMetrics(prev => [...prev.slice(-9), data]); // Keep 10 most recent
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>System Metrics Dashboard</h1>
      <MetricCard data={metrics} />
    </div>
  );
}

export default App;
