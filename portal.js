const GITHUB_OWNER = "voidex369";
const GITHUB_REPO = "Openclaws";
const CONTENT_DIR = "content";

async function loadProjects() {
  const token = ""; // public repo, no token needed for contents
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_DIR}`;
  const res = await fetch(url);
  if (!res.ok) {
    document.getElementById('projects').innerHTML = `<p style="color:#ef4444;grid-column:1/-1">Failed to load projects (${res.status}). Make sure the repo is public.</p>`;
    return;
  }
  const items = await res.json();
  const grid = document.getElementById('projects');
  grid.innerHTML = '';
  for (const item of items) {
    if (item.type !== 'dir') continue;
    const name = item.name;
    const description = getDescription(name);
    const badges = getBadges(name);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-img">🛡️</div>
      <div class="card-body">
        <div class="badges">${badges.map(b => `<span class="badge ${b}">${b}</span>`).join('')}</div>
        <h3 class="card-title">${name}</h3>
        <p class="card-desc">${description}</p>
        <a class="card-btn" href="${CONTENT_DIR}/${name}/" target="_blank">Open Project →</a>
      </div>
    `;
    grid.appendChild(card);
  }
}

function getDescription(name) {
  const map = {
    "security-platform-20260314-0046": "Integrated security scanning platform with backend, frontend, mobile, desktop, and CLI components."
  };
  return map[name] || "A project in the OpenClaws collection. Click to explore files and documentation.";
}

function getBadges(name) {
  const map = {
    "security-platform-20260314-0046": ["backend","mobile","desktop","cli"]
  };
  return map[name] || ["general"];
}

loadProjects();
