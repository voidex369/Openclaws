const express = require('express');
const cors = require('cors');
const db = require('./data-store');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/scans', (req, res) => {
  const { severity, tool, start, end } = req.query;
  let scans = db.get('scans').value() || [];
  if (severity) scans = scans.filter(s => s.severity === severity);
  if (tool) scans = scans.filter(s => s.tool === tool);
  if (start || end) {
    scans = scans.filter(s => {
      const date = new Date(s.timestamp);
      if (start && date < new Date(start)) return false;
      if (end && date > new Date(end)) return false;
      return true;
    });
  }
  res.json(scans);
});

app.post('/api/scans', (req, res) => {
  const scan = req.body;
  if (!scan.tool || !scan.severity || !Array.isArray(scan.findings)) {
    return res.status(400).json({ error: 'Invalid scan data' });
  }
  scan.timestamp = scan.timestamp || new Date().toISOString();
  db.get('scans').push(scan).write();
  res.status(201).json({ success: true, id: scan.id || Date.now() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
