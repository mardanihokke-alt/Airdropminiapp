const { ensureUser } = require('../lib/db');

function profileEndpoint(req, res) {
  const { telegram_id, username, first_name } = req.query;

  if (!telegram_id) {
    return res.status(400).json({ success: false, message: 'telegram_id dibutuhkan' });
  }

  const user = ensureUser(telegram_id, username, first_name);
  res.json({ success: true, user });
}

module.exports = profileEndpoint;
