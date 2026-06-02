const TelegramBot = require('node-telegram-bot-api');

// ─── Konfiguratsiya ───
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN muhit o\'zgaruvchisi topilmadi!');
  process.exit(1);
}

const WEB_APP_URL = process.env.WEB_APP_URL || 'https://lego1.onrender.com/';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ─── Menu tugmasini global o'rnatish (1 marta) ───
bot.setChatMenuButton({
  menu_button: {
    type: 'web_app',
    text: "🎮 O'yin",
    web_app: { url: WEB_APP_URL }
  }
}).catch(e => console.log('Menu button xatosi:', e.message));

// ─── /start komandasi ───
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'Foydalanuvchi';

  try {
    await bot.sendMessage(chatId,
      `👋 Assalomu alaykum, <b>${escapeHtml(firstName)}</b>!\n\n` +
      `Quyidagi tugmani bosing va o'yinni boshlang:`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{
              text: "🎮 O'yinni ochish",
              web_app: { url: WEB_APP_URL }
            }]
          ]
        }
      }
    );
  } catch (e) {
    console.error('Xabar yuborish xatosi:', e.message);
  }
});

// ─── Web App dan kelgan ma'lumotlarni qabul qilish ───
bot.on('message', (msg) => {
  if (!msg.web_app_data) return;

  const chatId = msg.chat.id;
  const data = msg.web_app_data.data;

  try {
    const parsed = JSON.parse(data);
    console.log('📩 Web App dan ma\'lumot:', parsed);

    // Ma'lumot turiga qarab javob berish
    bot.sendMessage(chatId, `✅ Natija qabul qilindi: ${JSON.stringify(parsed)}`);
  } catch {
    // JSON emas — oddiy matn
    bot.sendMessage(chatId, `📩 Ma'lumot: ${data}`);
  }
});

// ─── Xato tutish ───
bot.on('polling_error', (error) => {
  console.error('Polling xatosi:', error.message);
});

// ─── Yumaloq tugma (Quick Reply) — ixtiyoriy ───
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, "📖 Yordam:\n\n" +
    "🎮 O'yin ochilishi uchun quyidagi tugmani bosing.\n" +
    "📊 Natijangiz avtomatik saqlanadi.\n" +
    "/start — Botni qayta ishga tushirish",
    { parse_mode: 'HTML' }
  );
});

// ─── HTML uchun xavfsiz escape funksiya ───
function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

console.log('✅ Bot muvaffaqiyatli ishga tushdi!');
