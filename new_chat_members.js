const { ensureUser } = require('../lib/db');

function handleNewChatMembers(bot, msg) {
  const chatId = msg.chat.id;
  const newMembers = msg.new_chat_members;

  if (!newMembers || newMembers.length === 0) return;

  newMembers.forEach((member) => {
    // Jangan proses jika member baru adalah bot
    if (member.is_bot) return;

    // Daftarkan member baru ke DB
    ensureUser(member.id, member.username, member.first_name);

    const name = member.first_name || member.username || 'Member Baru';
    const welcomeMsg = `Selamat datang di grup, *${name}*! 👋\n\nJangan lupa cek bot untuk info reward dan game menarik.`;

    bot.sendMessage(chatId, welcomeMsg, { parse_mode: 'Markdown' });
  });
}

module.exports = handleNewChatMembers;
