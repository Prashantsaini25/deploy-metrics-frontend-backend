import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

function App() {
  const [metrics, setMetrics] = useState([]);
  const [latest, setLatest] = useState({});

  useEffect(() => {
    const fetchMetrics = () => {
      fetch("/api/metrics")
        .then(res => res.json())
        .then(data => {
          setLatest(data);
          setMetrics(prev => [
            ...prev.slice(-49),
            { time: Date.now(), ...data }
          ]);
        });
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: metrics.map(m => new Date(m.time).toLocaleTimeString()),
    datasets: [
      {
        label: "CPU (%)",
        data: metrics.map(m => m.cpu_percent),
        fill: false,
        borderColor: "blue"
      },
      {
        label: "Latency (ms)",
        data: metrics.map(m => m.latency_ms),
        fill: false,
        borderColor: "green"
      },
      {
        label: "Requests",
        data: metrics.map(m => m.request_counter),
        fill: false,
        borderColor: "red"
      }
    ]
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Monitoring Dashboard</h1>
      <div>
        <b>Uptime:</b> {latest.uptime_seconds || 0}s<br />
        <b>CPU:</b> {latest.cpu_percent || 0}%<br />
        <b>Latency:</b> {latest.latency_ms || 0}ms<br />
        <b>Requests:</b> {latest.request_counter || 0}
      </div>
      <Line data={chartData} />
    </div>
  );
}

export default App;
