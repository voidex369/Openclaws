const GITHUB_OWNER = "voidex369";
const GITHUB_REPO = "Openclaws";
const CONTENT_DIR = "content";
const BRANCH = "main";

async function loadProjects() {
  const grid = document.getElementById('projects');
  const stats = document.getElementById('stats');
  const search = document.getElementById('search');
  grid.innerHTML = '<div class="card">Loading projects…</div>';
  stats.textContent = '';

  try {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_DIR}?ref=${BRANCH}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = await res.json();
    const projectDirs = items.filter(i => i.type === 'dir').map(i => i.name);
    stats.textContent = `${projectDirs.length} project${projectDirs.length !== 1 ? 's' : ''}`;
    const render = (filter = '') => {
      grid.innerHTML = '';
      const filtered = projectDirs.filter(name => name.toLowerCase().includes(filter.toLowerCase()));
      if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;color:#94a3b8;text-align:center;">No projects match your search.</p>';
        return;
      }
      filtered.forEach(name => {
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
      });
    };
    render();
    search.addEventListener('input', e => render(e.target.value));
  } catch (err) {
    console.error(err);
    // Fallback hardcoded list
    const fallback = ["security-platform-20260314-0046","security-toolkit-2024","vulnerability-scanner-2024","cloudsec-suite-2024","devsecops-pipeline-2024"];
    stats.textContent = `${fallback.length} projects (offline)`;
    const renderFallback = (filter='') => {
      grid.innerHTML = '';
      const filtered = fallback.filter(name => name.toLowerCase().includes(filter.toLowerCase()));
      filtered.forEach(name => {
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
      });
    };
    renderFallback();
    search.addEventListener('input', e => renderFallback(e.target.value));
  }
}

function getMeta(name) {
  const map = {
    "security-platform-20260314-0046": {
      title: "Security Platform",
      desc: "Integrated security scanning dashboard with backend, frontend, mobile, desktop, and CLI components.",
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
    },
    "cloudsec-suite-2024": {
      title: "CloudSec Suite 2024",
      desc: "Tools for auditing AWS/GCP configurations and IAM policies.",
      badges: ["backend","cli"],
      icon: "☁️"
    },
    "devsecops-pipeline-2024": {
      title: "DevSecOps Pipeline 2024",
      desc: "CI/CD integration with security gates (SAST, DAST, SCA).",
      badges: ["backend","cli"],
      icon: "🔧"
    }
  };
  return map[name] || {
    title: name,
    desc: "A project in the OpenClaws collection. Click to explore files and documentation.",
    badges: ["general"],
    icon: "📁"
  };
}

loadProjects();
