const low = require('lowdb');
const path = require('path');
const fs = require('fs');

const file = path.join(__dirname, 'data', 'scans.json');
if (!fs.existsSync(file)) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, '[]');
}

const db = low(file);
module.exports = db;
