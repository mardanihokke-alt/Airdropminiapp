const { db } = require('../schema');

function addGameEndpoint(req, res) {
  const { title, url, reward_amount } = req.body;

  if (!title || !url) {
    return res.status(400).json({ success: false, message: 'title dan url wajib diisi' });
  }

  const stmt = db.prepare('INSERT INTO games (title, url, reward_amount) VALUES (?, ?, ?)');
  const result = stmt.run(title, url, reward_amount || 0);

  res.json({ success: true, game_id: result.lastInsertRowid });
}

module.exports = addGameEndpoint;
