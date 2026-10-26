const { db } = require('../schema');

function gamesEndpoint(req, res) {
  try {
    const games = db.prepare('SELECT * FROM games WHERE is_active = 1 ORDER BY id DESC').all();
    res.json({ success: true, games });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = gamesEndpoint;
