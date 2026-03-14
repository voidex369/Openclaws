const GITHUB_OWNER = "voidex369";
const GITHUB_REPO = "Openclaws";
const CONTENT_DIR = "content";

async function loadProjects() {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_DIR}`;
  const res = await fetch(url);
  if (!res.ok) {
    document.getElementById('projects').innerHTML = `<p style="color:#ef4444;grid-column:1/-1">Failed to load projects (${res.status}).</p>`;
    return;
  }
  const items = await res.json();
  const grid = document.getElementById('projects');
  grid.innerHTML = '';
  for (const item of items) {
    if (item.type !== 'dir') continue;
    const name = item.name;
    const meta = getMeta(name);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-img">${meta.icon}</div>
      <div class="card-body">
        <div class="badges">${meta.badges.map(b => `<span class="badge ${b}">${b}</span>`).join('')}</div>
        <h3 class="card-title">${meta.title}</h3>
        <p class="card-desc">${meta.desc}</p>
        <a class="card-btn" href="${CONTENT_DIR}/${name}/" target="_blank">Open Project →</a>
      </div>
    `;
    grid.appendChild(card);
  }
}

function getMeta(name) {
  const map = {
    "security-platform-20260314-0046": {
      title: "Security Platform",
      desc: "Integrated security scanning dashboard with backend, frontend, mobile, desktop, and CLI.",
      badges: ["backend","mobile","desktop","cli"],
      icon: "🛡️"
    },
    "security-toolkit-2024": {
      title: "Security Toolkit 2024",
      desc: "Small utilities: ping, whois, header checker, SSL analyzer.",
      badges: ["cli","backend"],
      icon: "🧰"
    },
    "vulnerability-scanner-2024": {
      title: "Vulnerability Scanner 2024",
      desc: "Python-based web scanner for XSS, SQLi, and misconfigurations.",
      badges: ["backend","cli"],
      icon: "🔍"
    }
  };
  return map[name] || {
    title: name,
    desc: "A project in the OpenClaws collection. Click to explore files.",
    badges: ["general"],
    icon: "📁"
  };
}

loadProjects();
