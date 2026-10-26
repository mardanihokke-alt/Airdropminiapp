const { ensureUser, getLeaderboard } = require('../lib/db');

function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const text = msg.text || '';
  const from = msg.from;

  if (!from) return;

  // Selalu pastikan user terdaftar di DB setiap kali kirim pesan
  const user = ensureUser(from.id, from.username, from.first_name);

  // Handle Perintah /start
  if (text.startsWith('/start')) {
    const welcomeText = `Halo, ${user.first_name}!\n\nSelamat datang di Bot Penjaga Grup + Mini App.\n\nGunakan perintah berikut:\n/balance - Cek saldo reward\n/leaderboard - Cek peringkat top user\n/help - Bantuan`;

    return bot.sendMessage(chatId, welcomeText, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🚀 Buka Mini App',
              web_app: { url: process.env.MINI_APP_URL || 'https://google.com' }
            }
          ]
        ]
      }
    });
  }

  // Handle Perintah /balance
  if (text === '/balance') {
    return bot.sendMessage(chatId, `💰 Saldo kamu saat ini: *${user.balance}*`, { parse_mode: 'Markdown' });
  }

  // Handle Perintah /leaderboard
  if (text === '/leaderboard') {
    const topUsers = getLeaderboard(10);
    if (topUsers.length === 0) {
      return bot.sendMessage(chatId, 'Belum ada data leaderboard.');
    }

    let response = '🏆 *Top 10 Leaderboard*\n\n';
    topUsers.forEach((u, index) => {
      const name = u.first_name || u.username || 'User';
      response += `${index + 1}. ${name} - ${u.balance} point\n`;
    });

    return bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
  }

  // Handle Perintah /help
  if (text === '/help') {
    const helpText = `📌 *Daftar Perintah Bot:*\n\n/start - Memulai bot & akses Mini App\n/balance - Cek saldo reward kamu\n/leaderboard - Lihat peringkat saldo terbanyak\n/help - Menampilkan pesan bantuan ini`;
    return bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
  }
}

module.exports = handleMessage;
