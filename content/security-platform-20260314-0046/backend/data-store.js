const path = require('path');
const fs = require('fs');

const file = path.join(__dirname, 'data', 'scans.json');

function ensureFile() {
  if (!fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, '[]');
  }
}

function readDb() {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error('Failed to parse DB, returning empty array');
    return [];
  }
}

function writeDb(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = { readDb, writeDb };
