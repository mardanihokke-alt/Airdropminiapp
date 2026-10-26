const { getDb, saveDb } = require('../schema');

function ensureUser(telegram_id, username = '', first_name = '') {
  const db = getDb();
  const res = db.exec('SELECT * FROM users WHERE telegram_id = ?', [telegram_id]);

  if (res.length === 0 || res[0].values.length === 0) {
    db.run('INSERT INTO users (telegram_id, username, first_name) VALUES (?, ?, ?)', [telegram_id, username, first_name]);
    saveDb();
  } else {
    db.run('UPDATE users SET username = ?, first_name = ? WHERE telegram_id = ?', [username, first_name, telegram_id]);
    saveDb();
  }

  const userRes = db.exec('SELECT * FROM users WHERE telegram_id = ?', [telegram_id]);
  const row = userRes[0].values[0];
  const cols = userRes[0].columns;
  
  let user = {};
  cols.forEach((col, idx) => { user[col] = row[idx]; });
  return user;
}

function getLeaderboard(limit = 10) {
  const db = getDb();
  const res = db.exec('SELECT telegram_id, username, first_name, balance FROM users ORDER BY balance DESC LIMIT ?', [limit]);
  
  if (res.length === 0) return [];
  
  const cols = res[0].columns;
  return res[0].values.map(row => {
    let obj = {};
    cols.forEach((col, idx) => { obj[col] = row[idx]; });
    return obj;
  });
}

function logClick(telegram_id, game_id) {
  const db = getDb();
  db.run('INSERT INTO clicks (telegram_id, game_id) VALUES (?, ?)', [telegram_id, game_id]);
  saveDb();
}

function award(telegram_id, amount) {
  const db = getDb();
  db.run('UPDATE users SET balance = balance + ? WHERE telegram_id = ?', [amount, telegram_id]);
  saveDb();
  
  const res = db.exec('SELECT balance FROM users WHERE telegram_id = ?', [telegram_id]);
  if (res.length > 0 && res[0].values.length > 0) {
    return { balance: res[0].values[0][0] };
  }
  return { balance: 0 };
}

module.exports = {
  ensureUser,
  getLeaderboard,
  logClick,
  award
};

