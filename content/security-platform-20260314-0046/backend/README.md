# Backend
npm install && npm start
REST API:
- GET /api/scans?severity=high&tool=nmap
- POST /api/scans { tool, severity, findings: [], timestamp? }
Data stored in data/scans.json
