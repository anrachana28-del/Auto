// ======================
// Telegram Bot with Buttons & Env Variables
// ======================

const TelegramBot = require('node-telegram-bot-api');

// ❗ Load config from environment variables
const TOKEN = process.env.TOKEN;
const FACEBOOK_URL = process.env.FACEBOOK_URL;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;

if (!TOKEN || !FACEBOOK_URL || !ADMIN_USERNAME) {
  console.error('❌ Missing TOKEN, FACEBOOK_URL, or ADMIN_USERNAME in env');
  process.exit(1);
}

// Create bot
const bot = new TelegramBot(TOKEN, { polling: true });

// Users who already got a reply (session-based)
const repliedUsers = new Set();

// Keywords to trigger the bot
const KEYWORDS = ['hi', 'hello', 'hey'];

// Listen to messages
bot.on('message', async (msg) => {
  const text = msg.text?.toLowerCase();
  if (!text) return;

  // Only trigger if message contains a keyword
  const containsKeyword = KEYWORDS.some(keyword => text.includes(keyword));
  if (!containsKeyword) return;

  const userId = msg.from.id;

  // Only reply once per user
  if (repliedUsers.has(userId)) return;
  repliedUsers.add(userId);

  try {
    // Send private message with buttons
    await bot.sendMessage(
      userId,
      `Hi 👋 ${msg.from.first_name}! Here are some quick links:`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Facebook Page 🌐", url: FACEBOOK_URL },
              { text: "Contact Admin 👤", url: `https://t.me/${ADMIN_USERNAME}` }
            ]
          ]
        }
      }
    );

    console.log(`✅ Replied once to ${userId}`);
  } catch (e) {
    console.error('❌ PM failed:', e.message);
  }
});

// Optional: handle callback queries (if you want interactive buttons in the future)
bot.on('callback_query', async (query) => {
  const chatId = query.from.id;
  const data = query.data;

  // Example for future interactive buttons
  if (data === "button_clicked") {
    await bot.sendMessage(chatId, `You clicked the button! 🎉`);
    // Remove the button after click
    await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: query.message.message_id });
  }
});
