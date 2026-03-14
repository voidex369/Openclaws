import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };

export default function App() {
  const [scans, setScans] = useState([]);
  const [severityFilter, setSeverityFilter] = useState('');
  const [toolFilter, setToolFilter] = useState('');

  useEffect(() => { fetchScans(); }, []);

  const fetchScans = async () => {
    try {
      const params = { severity: severityFilter, tool: toolFilter };
      const res = await axios.get('/api/scans', { params });
      setScans(res.data);
    } catch (e) { console.error(e); }
  };

  const handleUpload = async (file) => {
    const text = await file.text();
    const data = JSON.parse(text);
    await axios.post('/api/scans', data);
    fetchScans();
  };

  const stats = (() => {
    const map = { high: 0, medium: 0, low: 0 };
    scans.forEach(s => { if (s.severity in map) map[s.severity]++; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })();

  return (
    <div style={{ padding: 20 }}>
      <h1>Security Dashboard</h1>
      <div>
        <input placeholder="Filter severity" value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} />
        <input placeholder="Filter tool" value={toolFilter} onChange={e => setToolFilter(e.target.value)} />
        <button onClick={fetchScans}>Refresh</button>
        <button onClick={() => document.getElementById('fileInput').click()}>Upload JSON</button>
        <input id="fileInput" type="file" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleUpload(e.target.files[0])} />
      </div>

      <h2>Scans</h2>
      <table border="1" cellPadding="5">
        <thead><tr><th>Tool</th><th>Severity</th><th>Findings</th><th>Timestamp</th></tr></thead>
        <tbody>
          {scans.map((s, i) => (
            <tr key={i}>
              <td>{s.tool}</td>
              <td style={{ color: COLORS[s.severity] }}>{s.severity}</td>
              <td>{s.findings.length}</td>
              <td>{new Date(s.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Severity Distribution</h2>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={stats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50}>
            {stats.map((entry, i) => <Cell key={`cell-${i}`} fill={COLORS[entry.name]} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
