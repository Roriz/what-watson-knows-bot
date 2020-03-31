const ToneService = require('../services/tone-service');


module.exports = (bot) => {
  bot.onText(/\/tone$/, (msg) => {
    bot.sendMessage(msg.chat.id, 'To use send /tone {message}. Example: /tone Team, I know that times are tough!');
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
