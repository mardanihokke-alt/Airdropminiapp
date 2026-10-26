const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const path = require('path');

const { initSchema } = require('./schema');

async function main() {
  // 1. Inisialisasi Database Schema
  await initSchema();

  // 2. Inisialisasi Bot Telegram
  const BOT_TOKEN = process.env.BOT_TOKEN || '8946163745:AAEXRg7v7mhHCppxiZFrKGegQCFuypn6Qbw';
  const bot = new Telegraf(BOT_TOKEN);

  // Handlers Telegram (Pesan Start)
 bot.start((ctx) => {
  const user = ctx.from;
  const appUrl = process.env.MINI_APP_URL || 'https://google.com';

  ctx.reply(
    `Halo ${user.first_name}! 👋\n\nSelamat datang di Komunitas Game Kami!\n\nGunakan perintah berikut:\n/balance - Cek saldo poin kamu\n/leaderboard - Lihat peringkat pemain top`,
    Markup.inlineKeyboard([
      [Markup.button.url('🚀 Buka Pusat Game', appUrl)]
    ])
  );
});
 


  bot.command('balance', (ctx) => {
    const { ensureUser } = require('./lib/db');
    const user = ensureUser(ctx.from.id, ctx.from.username, ctx.from.first_name);
    ctx.reply(`💰 Saldo kamu saat ini: ${user.balance}`);
  });

  bot.command('leaderboard', (ctx) => {
    const { getLeaderboard } = require('./lib/db');
    const topUsers = getLeaderboard(10);
    if (topUsers.length === 0) return ctx.reply('Belum ada data leaderboard.');

    let text = '🏆 Top 10 Leaderboard:\n\n';
    topUsers.forEach((u, i) => {
      text += `${i + 1}. ${u.first_name || u.username} - ${u.balance} point\n`;
    });
    ctx.reply(text);
  });

  bot.on('new_chat_members', (ctx) => {
    const { ensureUser } = require('./lib/db');
    ctx.message.new_chat_members.forEach((m) => {
      if (!m.is_bot) {
        ensureUser(m.id, m.username, m.first_name);
        ctx.reply(`Selamat datang di Airdropgames, ${m.first_name}! 👋`);
      }
    });
  });

  // Jalankan Bot
  bot.launch();
  console.log('Bot Telegram aktif!');

  // 3. Inisialisasi Server Express
  const app = express();
  app.use(express.json());

  app.use('/miniapp', express.static(path.join(__dirname, 'miniapp')));

  app.get('/api/profile', require('./endpoints/profile'));
  app.get('/api/games', require('./endpoints/games'));
  app.get('/api/leaderboard', require('./endpoints/leaderboard'));
  app.post('/api/click', require('./endpoints/click'));
  app.get('/api/check-status', require('./endpoints/check-status'));
  app.post('/api/add-game', require('./endpoints/add-game'));
  app.get('/api/seed', require('./endpoints/seed'));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server Express berjalan di port ${PORT}`);
  });

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main();

