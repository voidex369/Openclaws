const { Low } = require('lowdb');
const path = require('path');
const fs = require('fs');
const { File } = require('lowdb/adapters/File');

const file = path.join(__dirname, 'data', 'scans.json');
if (!fs.existsSync(file)) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, '[]');
}

const adapter = new File(file);
const db = new Low(adapter);
module.exports = db;
