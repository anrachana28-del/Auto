const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

// ================== CONFIG ==================
const TOKEN = process.env.TOKEN;        // Telegram Bot Token
const PORT  = process.env.PORT || 3000; // Render provides PORT

if (!TOKEN) {
  console.error('❌ TOKEN is missing');
  process.exit(1);
}

// ================== EXPRESS (Health Check) ==================
const app = express();

app.get('/', (req, res) => {
  res.send('✅ Telegram Bot is running');
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// ================== TELEGRAM BOT ==================
const bot = new TelegramBot(TOKEN, { polling: true });

// Store users who already received reply
const repliedUsers = new Set();

// Keywords trigger
const KEYWORDS = ['hi', 'hello', 'hey'];

bot.on('message', async (msg) => {
  const text = msg.text?.toLowerCase();
  if (!text) return;

  const userId = msg.from.id;

  // Reply only once per user
  if (repliedUsers.has(userId)) return;

  // Check keyword
  if (!KEYWORDS.includes(text)) return;

  try {
    repliedUsers.add(userId);

    // Reply PRIVATE message (even if message comes from group)
    await bot.sendMessage(
      userId,
      `Hi 👋 ${msg.from.first_name}!\nThanks for your message.`
    );

    console.log(`✅ Replied once to user ${userId}`);
  } catch (err) {
    console.error('❌ Cannot send PM (user not started bot yet):', err.message);
  }
});

// ================== OPTIONAL: DAILY RESET ==================
setInterval(() => {
  repliedUsers.clear();
  console.log('🔄 Daily reset replied users');
}, 24 * 60 * 60 * 1000);
