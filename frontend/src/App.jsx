import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

// Use environment variable or fallback URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

async function getMetrics() {
  const res = await fetch(`${API_URL}/metrics`);
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return res.json();
}

function MetricCard({ data }) {
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
}

// Define the shape of each metric object
const metricShape = PropTypes.shape({
  timestamp: PropTypes.string.isRequired,
  cpu_usage_percent: PropTypes.number,
  latency_ms: PropTypes.number,
  memory_usage_mb: PropTypes.number,
  request_count: PropTypes.number,
});

MetricCard.propTypes = {
  data: PropTypes.arrayOf(metricShape).isRequired,
};

function App() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMetrics();
        setMetrics((prev) => [...prev.slice(-9), data]); // Keep last 10 entries
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
