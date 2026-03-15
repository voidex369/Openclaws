const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { Queue } = require('bullmq');
const redisConfig = { host: 'localhost', port: 6379 };
const aiQueue = new Queue('ai-triage', { connection: redisConfig });

router.post('/', async (req, res) => {
  const { tool, severity, findings } = req.body;
  if (!tool || !severity || !Array.isArray(findings)) {
    return res.status(400).json({ error: 'Invalid scan data' });
  }
  const scanId = Date.now().toString();
  await db.run('INSERT INTO scans (id, tool, severity, created_at) VALUES (?, ?, ?, datetime("now"))', [scanId, tool, severity]);
  for (const f of findings) {
    const findingId = `${scanId}-${Math.random().toString(36).substr(2,9)}`;
    await db.run('INSERT INTO findings (id, scan_id, description, evidence) VALUES (?, ?, ?, ?)', [findingId, scanId, f.description, f.evidence]);
    await aiQueue.add('triage', { finding_id: findingId, tool, severity, description: f.description, evidence: f.evidence });
  }
  res.status(201).json({ success: true, scanId });
});
module.exports = router;
