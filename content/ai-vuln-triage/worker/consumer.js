require('dotenv').config();
const { Worker } = require('bullmq');
const Redis = require('ioredis');
const axios = require('axios');
const db = require('../backend/models/db');

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379/0');

async function analyzeVuln(finding) {
  const prompt = `Analyze this security finding:\nTool: ${finding.tool}\nSeverity: ${finding.severity}\nDescription: ${finding.description}\nEvidence: ${finding.evidence}\n\nRespond with JSON containing:\n- confidence (0-100 integer)\n- poc (string, code snippet if any, else empty)\n- remediation (string, step-by-step fix)`;
  try {
    const resp = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
      data: {
        model: 'openrouter/anthropic/claude-3.5-sonnet',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2
      }
    });
    const text = resp.data.choices[0].message.content;
    return JSON.parse(text);
  } catch (e) {
    console.error('AI parse error:', e.message);
    return { confidence: 0, poc: '', remediation: 'Could not analyze' };
  }
}

async function process(job) {
  const finding = job.data;
  // Update DB with AI results
  await new Promise((resolve, reject) => {
    db.run('UPDATE findings SET ai_confidence=?, ai_poc=?, ai_remediation=?, status="done" WHERE id=?',
      [finding.ai_confidence, finding.ai_poc, finding.ai_remediation, finding.finding_id],
      (err) => err ? reject(err) : resolve());
  });
  console.log(`Processed ${finding.finding_id}`);
}

const worker = new Worker('ai-triage', process, { connection });
worker.on('completed', (job) => console.log(`Job ${job.id} completed`));
worker.on('failed', (job, err) => console.error(`Job ${job.id} failed:`, err.message));
worker.on('error', (err) => console.error('Worker error:', err.message));

console.log('AI Worker started, waiting for jobs...');
