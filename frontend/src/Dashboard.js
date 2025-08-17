import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const METRICS_URL = "http://<your-backend-domain-or-ip>:8000/metrics";

function prettifySeconds(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    uptime_seconds: 0,
    cpu_percent: 0,
    latency_ms: 0,
    request_counter: 0,
  });
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);

  const fetchMetrics = async () => {
    try {
      const res = await axios.get(METRICS_URL);
      setMetrics(res.data);
      setHistory((hist) => [
        ...hist.slice(-29), // last 29 points + 1 new = 30
        { ...res.data, timestamp: new Date().toLocaleTimeString() }
      ]);
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    fetchMetrics();
    intervalRef.current = setInterval(fetchMetrics, 10000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 900, margin: "0 auto" }}>
      <h2>Metrics Dashboard</h2>
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24
      }}>
        <Card title="Uptime" value={prettifySeconds(metrics.uptime_seconds)} />
        <Card title="CPU (%)" value={metrics.cpu_percent} />
        <Card title="Latency (ms)" value={metrics.latency_ms} />
        <Card title="Requests" value={metrics.request_counter} />
      </div>
      <div style={{ marginBottom: 32 }}>
        <h3>CPU Usage (%) Over Time</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp"/>
            <YAxis domain={[0, 100]} />
            <Tooltip/>
            <Legend />
            <Line type="monotone" dataKey="cpu_percent" stroke="#82ca9d" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3>Latency (ms) Over Time</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp"/>
            <YAxis />
            <Tooltip/>
            <Legend />
            <Line type="monotone" dataKey="latency_ms" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{
      flex: "1 1 160px",
      background: "#fff",
      borderRadius: 8,
      boxShadow: "0 1px 8px rgba(0,0,0,0.07)",
      padding: "16px 24px",
      textAlign: "center"
    }}>
      <div style={{ fontSize: 14, color: "#888" }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: 600, marginTop: 6 }}>{value}</div>
    </div>
  );
}
