const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

// ================== CONFIG ==================
const TOKEN      = process.env.TOKEN;        // Telegram Bot Token
const PORT       = process.env.PORT || 3000; // Render provides PORT
const FB_PAGE    = process.env.FB_PAGE || 'https://www.facebook.com/YourPage';
const ADMIN_LINK = process.env.ADMIN_LINK || 'https://t.me/YourAdminUsername';

if (!TOKEN) {
  console.error('❌ TOKEN is missing');
  process.exit(1);
}

// ================== EXPRESS (Health Check) ==================
const app = express();
app.get('/', (req, res) => res.send('✅ Telegram Bot is running'));
app.listen(PORT, () => console.log(`🌐 Web server running on port ${PORT}`));

// ================== TELEGRAM BOT ==================
const bot = new TelegramBot(TOKEN, { polling: true });

// Inline keyboard buttons (Facebook + Admin link only)
const BUTTONS = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Facebook Page', url: FB_PAGE },
        { text: 'Admin', url: ADMIN_LINK }
      ]
    ]
  }
};

// ================== MESSAGE HANDLER ==================
bot.on('message', async (msg) => {
  const text     = msg.text;
  if (!text) return;

  const userId   = msg.from.id;
  const username = msg.from.username ? '@' + msg.from.username : msg.from.first_name;

  try {
    // Reply User with buttons
    await bot.sendMessage(
      userId,
      `សួស្តី! ${username}\nយើងខ្ញុំនឹងតបសារឆាប់ៗនេះ សូមអធ្យាស្រ័យចំពោះការឆ្លើយយឺត។\nI will reply shortly. Thank you 💙🙏`,
      BUTTONS
    );

    console.log(`✅ Replied to user ${username} (${userId})`);

  } catch (err) {
    console.error('❌ Error sending message:', err.message);
  }
});
