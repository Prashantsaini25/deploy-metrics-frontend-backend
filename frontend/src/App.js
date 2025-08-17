import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from "recharts";

function App() {
  const [metrics, setMetrics] = useState({
    uptime_seconds: 0,
    cpu_percent: 0,
    latency_ms: 0,
    request_counter: 0,
  });
  const [history, setHistory] = useState([]);
  const timerRef = useRef();

  const fetchMetrics = async () => {
    try {
      const res = await axios.get("/metrics");
      setMetrics(res.data);
      setHistory(prev =>
        [...prev.slice(-29), { ...res.data, time: new Date().toLocaleTimeString() }]
      ); // Keep last 30 points
    } catch (e) {
      console.error("Error fetching metrics:", e);
    }
  };

  useEffect(() => {
    fetchMetrics();
    timerRef.current = setInterval(fetchMetrics, 10000); // Every 10s
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h2>Metrics Dashboard</h2>
      <div style={{
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 32
      }}>
        <MetricCard label="Uptime (sec)" value={metrics.uptime_seconds} />
        <MetricCard label="CPU (%)" value={metrics.cpu_percent} />
        <MetricCard label="Latency (ms)" value={metrics.latency_ms} />
        <MetricCard label="Requests" value={metrics.request_counter} />
      </div>
      <div style={{ width: "100%", height: 340 }}>
        <ResponsiveContainer>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" minTickGap={30} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cpu_percent" stroke="#8884d8" />
            <Line type="monotone" dataKey="latency_ms" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div style={{
      flex: 1,
      minWidth: 160,
      background: "#f8f9fb",
      borderRadius: 8,
      boxShadow: "0 1px 4px #eaeaea",
      padding: 20,
      textAlign: "center"
    }}>
      <div style={{ fontSize: 14, color: "#888" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

export default App;
