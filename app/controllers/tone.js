const toneService = require('../services/tone-service');

let serviceLimit = parseInt(process.env.IBM_TONE_ANALYSER_TOKEN_LIMIT, 10) || Infinity;

global.bot.onText(/\/tone$/, (msg) => {
  global.bot.sendMessage(msg.chat.id, 'Invalid arg, if you have any doubt send /help');
});

global.bot.onText(/\/tone (.+)/, async (msg, match) => {
  if (serviceLimit <= 0) {
    global.bot.sendMessage(
      msg.chat.id,
      'Sorry this bot reach the limit, try maybe in another day',
    );
    return;
  }

  const categories = await toneService(match[1]).call();

  const formattedCategories = categories
    .map((r) => `<b>${r.label}</b>: ${r.value.tone_name}\n`)
    .join('');

  const message = `Watson think this tone is:\n${formattedCategories}`;

  serviceLimit -= 1;

  global.bot.sendMessage(
    msg.chat.id,
    message,
    { parse_mode: 'HTML' },
  );
});
