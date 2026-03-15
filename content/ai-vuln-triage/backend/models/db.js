const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('triage.db');
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS scans (id TEXT PRIMARY KEY, tool TEXT, severity TEXT, created_at TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS findings (id TEXT PRIMARY KEY, scan_id TEXT, description TEXT, evidence TEXT, ai_confidence INTEGER, ai_poc TEXT, ai_remediation TEXT, status TEXT DEFAULT "pending", FOREIGN KEY(scan_id) REFERENCES scans(id))');
});
module.exports = db;
