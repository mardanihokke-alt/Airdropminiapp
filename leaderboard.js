const { getLeaderboard } = require('../lib/db');

function leaderboardEndpoint(req, res) {
  const limit = parseInt(req.query.limit) || 10;
  const leaderboard = getLeaderboard(limit);
  res.json({ success: true, leaderboard });
}

module.exports = leaderboardEndpoint;
