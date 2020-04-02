const ToneService = require('../services/tone-service');


module.exports = (bot) => {
  bot.onText(/\/tone$/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Invalid arg, if you have any doubt send /help');
  });

  bot.onText(/\/tone (.+)/, async (msg, match) => {
    const message = await new ToneService(match[1]).call();

    await bot.sendMessage(
      msg.chat.id,
      message,
      { parse_mode: 'HTML' },
    );
  });
};
