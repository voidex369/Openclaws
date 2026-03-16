require('dotenv').config();
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379/0');

const findings = [
  { finding_id: 'CF-001', tool: 'nikto', severity: 'High', description: 'SQL Injection', evidence: "/admin.php?id=1' OR 1=1" },
  { finding_id: 'CF-002', tool: 'nmap', severity: 'Medium', description: 'Open port 22', evidence: '22/tcp open ssh' }
];

(async () => {
  for (const f of findings) {
    await redis.rpush('ai-triage', JSON.stringify(f));
  }
  console.log('Seeded 2 sample findings');
  process.exit(0);
})();
