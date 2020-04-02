const ToneService = require('../services/tone-service');

let serviceLimit = parseInt(process.env.IBM_TONE_ANALYSER_TOKEN_LIMIT, 10) || Infinity;

module.exports = (bot) => {
  bot.onText(/\/tone$/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Invalid arg, if you have any doubt send /help');
  });

  bot.onText(/\/tone (.+)/, async (msg, match) => {
    if (serviceLimit <= 0) {
      return bot.sendMessage(
        msg.chat.id,
        'Sorry this bot reach the limit, try maybe in another day',
      );
    }

    const message = await new ToneService(match[1]).call();

    serviceLimit -= 1;

    return bot.sendMessage(
      msg.chat.id,
      message,
      { parse_mode: 'HTML' },
    );
  });
};
