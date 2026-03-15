# AI Vulnerability Triage Platform
Upload security scan results (nmap, nuclei, etc.) and let AI analyze each finding.
Stack: Node/Express + SQLite + BullMQ/Redis + Python worker + React.

Quick start (development):
1) Install Redis and start it.
2) npm install   (at project root)
3) npm run dev   (starts both backend+frontend with concurrently)
   - Backend: http://localhost:3000
   - Frontend: http://localhost:5173
4) In another terminal: cd worker && pip install -r requirements.txt && cp .env.example .env && python consumer.py

Production:
- npm run build   (builds frontend to dist/)
- npm start       (serves built frontend from Express)
