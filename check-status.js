const { db } = require('../schema');

function checkStatusEndpoint(req, res) {
  const { game_id } = req.query;

  if (!game_id) {
    return res.status(400).json({ success: false, message: 'game_id dibutuhkan' });
  }

  const game = db.prepare('SELECT id, title, is_active FROM games WHERE id = ?').get(game_id);
  if (!game) {
    return res.json({ success: false, status: 'not_found' });
  }

  res.json({ success: true, game });
}

module.exports = checkStatusEndpoint;
