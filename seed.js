const { db } = require('../schema');

function seedEndpoint(req, res) {
  const stmt = db.prepare('INSERT INTO games (title, url, reward_amount) VALUES (?, ?, ?)');
  stmt.run('Game Demo 1', 'https://example.com/game1', 10);
  stmt.run('Game Demo 2', 'https://example.com/game2', 20);

  res.json({ success: true, message: 'Data contoh game berhasil ditambahkan' });
}

module.exports = seedEndpoint;
