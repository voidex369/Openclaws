# Security Platform
Integrated security scanning dashboard.

Architecture:
- backend (Node.js + Express) – REST API for scan storage
- frontend-web (React + Vite) – dashboard UI
- mobile-app (Flutter) – mobile client
- desktop-app (Electron) – desktop client
- cli-runner (Python) – scanner CLI

Setup (local):
1) Backend: cd backend && npm install && npm start
2) Frontend: cd frontend-web && npm install && npm run dev
3) Open http://localhost:5173

Deploy:
- Backend to Railway/Render
- Frontend to GitHub Pages (frontend-web/dist)
- Mobile/Desktop builds per platform
