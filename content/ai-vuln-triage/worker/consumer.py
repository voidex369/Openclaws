import os, redis, requests, json, sqlite3
from bullmq import Worker
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
DB_PATH = "triage.db"
def analyze_vuln(finding):
    prompt = f"""Analyze this security finding:\nTool: {finding['tool']}\nSeverity: {finding['severity']}\nDescription: {finding['description']}\nEvidence: {finding['evidence']}\n\nRespond with JSON containing:\n- confidence (0-100 integer)\n- poc (string, code snippet if any, else empty)\n- remediation (string, step-by-step fix)"""
    resp = requests.post("https://openrouter.ai/api/v1/chat/completions", headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}", "Content-Type": "application/json"}, json={"model": "openrouter/anthropic/claude-3.5-sonnet", "messages": [{"role":"user","content":prompt}], "temperature": 0.2})
    try:
        text = resp.json()["choices"][0]["message"]["content"]
        data = json.loads(text)
        return data
    except Exception as e:
        print("AI parse error:", e)
        return {"confidence": 0, "poc": "", "remediation": "Could not analyze"}
def process_job(job):
    finding = job.data
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute('SELECT id FROM findings WHERE id=?', (finding['finding_id'],))
    if not cur.fetchone(): print("Finding not found:", finding['finding_id']); return
    ai = analyze_vuln(finding)
    cur.execute('UPDATE findings SET ai_confidence=?, ai_poc=?, ai_remediation=?, status="done" WHERE id=?', (ai.get("confidence"), ai.get("poc"), ai.get("remediation"), finding['finding_id']))
    conn.commit(); conn.close(); print(f"Processed {finding['finding_id']}")
worker = Worker("ai-triage", process_job, {"connection": redis.from_url(REDIS_URL)})
worker.run()
