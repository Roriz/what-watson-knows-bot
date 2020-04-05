require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const router = require('./router');

const token = process.env.TELEGRAM_BOT_TOKEN;

global.bot = new TelegramBot(token, { polling: true });

global.bot.on('message', async (telegramParams) => {
  const start = new Date();

  await router(telegramParams);

  const executionTime = new Date() - start;

  console.info(
    `Reponse to: #${telegramParams.chat.id} (${telegramParams.chat.type}) in %dms`,
    executionTime,
  );
});
