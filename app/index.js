require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const routers = require('./routers');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
global.bot = new TelegramBot(token, { polling: true });

global.bot.on('message', async (telegramParams) => {
  const start = new Date();

  await routers(telegramParams);

  const executionTime = new Date() - start;

  console.info(
    'Message has been sended and was responded in %dms',
    executionTime,
  );
});
