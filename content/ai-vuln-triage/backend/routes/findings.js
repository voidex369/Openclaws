const express = require('express');
const router = express.Router();
const db = require('../models/db');
router.get('/:scanId/findings', async (req, res) => {
  const { scanId } = req.params;
  const rows = await db.all('SELECT * FROM findings WHERE scan_id = ?', [scanId]);
  res.json(rows);
});
module.exports = router;
