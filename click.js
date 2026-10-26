const { logClick, award } = require('../lib/db');
const { db } = require('../schema');

function clickEndpoint(req, res) {
  const { telegram_id, game_id } = req.body;

  if (!telegram_id || !game_id) {
    return res.status(400).json({ success: false, message: 'telegram_id dan game_id wajib diisi' });
  }

  const game = db.prepare('SELECT * FROM games WHERE id = ?').get(game_id);
  if (!game) {
    return res.status(404).json({ success: false, message: 'Game tidak ditemukan' });
  }

  logClick(telegram_id, game_id);
  const newBalance = award(telegram_id, game.reward_amount || 0);

  res.json({
    success: true,
    message: 'Klik berhasil dicatat',
    balance: newBalance.balance,
    url: game.url
  });
}

module.exports = clickEndpoint;
