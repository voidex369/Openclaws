import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function Dashboard() {
  const [scans, setScans] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get('/api/scans').then(r => setScans(r.data));
    socket.on('findingUpdated', (f) => {
      setScans(s => s.map(scan => scan.id === f.scan_id ? {...scan, findings: scan.findings.map(fi => fi.id === f.finding_id ? {...fi, ...f.aiResult} : fi)} : scan));
    });
  }, []);

  const upload = async (e) => {
    const file = e.target.files[0];
    const data = JSON.parse(await file.text());
    const res = await axios.post('/api/scans', data);
    setScans([...scans, { id: res.data.scanId, tool: data.tool, severity: data.severity, findings: data.findings }]);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Inter,sans-serif' }}>
      <h1 style={{ color: '#1e293b' }}>AI Vulnerability Triage</h1>
      <p>Upload scan JSON (nmap, nuclei, etc.) to get AI analysis.</p>
      <input type="file" onChange={upload} style={{ marginBottom: 20 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 20 }}>
        {scans.map(scan => (
          <div key={scan.id} style={{ border: '1px solid #e2e8f0', padding: 15, borderRadius: 8, background: '#f8fafc' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{scan.tool} – {scan.severity}</h3>
            <p style={{ color: '#64748b', fontSize: '.9rem' }}>{scan.findings?.length || 0} findings</p>
            <button onClick={() => setSelected(scan)} style={{ padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>View Details</button>
          </div>
        ))}
      </div>
      {selected && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: 20, borderRadius: 8, maxWidth: 800, width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2>Findings – {selected.tool}</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {selected.findings?.map(f => (
                <li key={f.id} style={{ borderBottom: '1px solid #e2e8f0', padding: '10px 0' }}>
                  <div><strong>{f.description}</strong></div>
                  <div style={{ fontSize: '.9rem', color: '#475569' }}>Evidence: {f.evidence}</div>
                  {f.ai_confidence !== undefined && <div style={{ marginTop: 8 }}><strong>AI Confidence:</strong> {f.ai_confidence}%</div>}
                  {f.ai_poc && <pre style={{ background: '#f1f5f9', padding: 8, borderRadius: 4, overflowX: 'auto' }}>{f.ai_poc}</pre>}
                  {f.ai_remediation && <div><strong>Remediation:</strong><p style={{ marginTop: 4 }}>{f.ai_remediation}</p></div>}
                </li>
              ))}
            </ul>
            <button onClick={() => setSelected(null)} style={{ marginTop: 20, padding: '10px 20px', background: '#64748b', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
