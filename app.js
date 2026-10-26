const tg = window.Telegram?.WebApp;
if (tg) tg.expand();

const user = tg?.initDataUnsafe?.user || { id: 123456, first_name: 'Demo User' };

document.getElementById('user-name').innerText = user.first_name;

// 1. Fetch Profile / Saldo
fetch(`/api/profile?telegram_id=${user.id}&first_name=${encodeURIComponent(user.first_name)}`)
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById('user-balance').innerText = data.user.balance;
    }
  });

// 2. Fetch Daftar Game
fetch('/api/games')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('games-list');
    if (!data.success || data.games.length === 0) {
      container.innerHTML = '<p>Belum ada game tersedia.</p>';
      return;
    }

    container.innerHTML = data.games.map(g => `
      <div class="game-item">
        <div>
          <b>${g.title}</b><br>
          <small>Reward: +${g.reward_amount} Point</small>
        </div>
        <button onclick="playGame(${g.id})">Main</button>
      </div>
    `).join('');
  });

// 3. Fetch Leaderboard
fetch('/api/leaderboard')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('leaderboard-list');
    if (!data.success || data.leaderboard.length === 0) {
      container.innerHTML = '<p>Belum ada data.</p>';
      return;
    }

    container.innerHTML = data.leaderboard.map((u, i) => `
      <div class="leaderboard-item">
        <span>#${i + 1} ${u.first_name || u.username || 'User'}</span>
        <b>${u.balance} Point</b>
      </div>
    `).join('');
  });

function playGame(gameId) {
  fetch('/api/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegram_id: user.id, game_id: gameId })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById('user-balance').innerText = data.balance;
      if (data.url) window.open(data.url, '_blank');
    }
  });
}
