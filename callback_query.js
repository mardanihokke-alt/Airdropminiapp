const { logClick, award } = require('../lib/db');

function handleCallbackQuery(bot, callbackQuery) {
  const msg = callbackQuery.message;
  const data = callbackQuery.data; // Data dari tombol yang ditekan
  const from = callbackQuery.from;

  if (!from) return;

  // Contoh data format: "game_LINKID"
  if (data.startsWith('game_')) {
    const gameId = data.split('_')[1];

    // Catat klik ke database
    logClick(from.id, gameId);

    // Berikan reward ke user (contoh: +10 point per klik)
    award(from.id, 10);

    // Beri respon pop-up di Telegram
    bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Link berhasil diverifikasi! Saldo +10 point.',
      show_alert: true
    });

    // Kirim link ke user
    return bot.sendMessage(msg.chat.id, `Berikut adalah link game kamu: https://example.com/game/${gameId}`);
  }

  // Selalu answerCallbackQuery agar status tombol di Telegram tidak loading terus
  bot.answerCallbackQuery(callbackQuery.id);
}

module.exports = handleCallbackQuery;
