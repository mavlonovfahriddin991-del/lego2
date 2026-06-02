const TelegramBot = require('node-telegram-bot-api');

// Tokenni atrof-muhit o'zgaruvchisidan oling
const BOT_TOKEN = process.env.BOT_TOKEN || '8719731419:AAFccAG3FsMLFxNzGAygHjFlOWDGg1wmALQ';
const WEB_APP_URL = 'https://lego1.onrender.com/';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ─── /start komandasi ───
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  // Menyu tugmasini o'rnatish
  try {
    await bot.setChatMenuButton({
      chat_id: chatId,
      menu_button: {
        type: 'web_app',
        text: '🎮 O\'yin',
        web_app: { url: WEB_APP_URL }
      }
    });
  } catch (e) {
    console.log('Menu button xatosi:', e.message);
  }

  bot.sendMessage(chatId, `👋 Assalomu alaykum, <b>${msg.from.first_name}</b>!

Quyidagi tugmani bosing va o'yinni boshlang:`, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{
          text: '🎮 O\'yinni ochish',
          web_app: { url: WEB_APP_URL }
        }]
      ]
    }
  });
});

// ─── Web App dan kelgan ma'lumotlarni qabul qilish ───
bot.on('message', (msg) => {
  if (msg.web_app_data) {
    const chatId = msg.chat.id;
    const data = msg.web_app_data.data;
    bot.sendMessage(chatId, `📩 Web App dan ma'lumot keldi: ${data}`);
  }
});

// ─── Xato tutish ───
bot.on('polling_error', (error) => {
  console.error('Polling xatosi:', error.message);
});

console.log('✅ Bot muvaffaqiyatli ishga tushdi!');