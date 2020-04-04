require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
global.bot = new TelegramBot(token, { polling: true });

require('./controllers');
