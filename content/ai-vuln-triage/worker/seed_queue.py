import os, redis, json
r = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379/0"))
findings = [{"finding_id":"CF-001","tool":"nikto","severity":"High","description":"SQL Injection","evidence":"/admin.php?id=1' OR 1=1"},{"finding_id":"CF-002","tool":"nmap","severity":"Medium","description":"Open port 22","evidence":"22/tcp open ssh"}]
for f in findings: r.rpush("ai-triage", json.dumps(f))
print("Seeded 2 sample findings")
