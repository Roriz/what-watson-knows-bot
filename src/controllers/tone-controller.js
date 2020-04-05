const toneService = require('../services/tone-service');
const ServiceReachLimit = require('../errors/service-reach-limit');

let serviceLimit = parseInt(process.env.IBM_TONE_ANALYSER_TOKEN_LIMIT, 10) || Infinity;

module.exports = async function tone(telegramParams) {
  if (serviceLimit <= 0) { throw new ServiceReachLimit('tone service'); }

  const [, clientMessage] = telegramParams.text.match(/\/[\w_]+\s(.*)?/);

  const categories = await toneService(clientMessage);

  const formattedCategories = categories
    .map((r) => `<b>${r.label}</b>: ${r.value.tone_name} (${parseInt(r.value.score * 100, 10)}%)\n`)
    .join('');

  const message = `Watson think this tone is:\n${formattedCategories}`;

  serviceLimit -= 1;

  await global.bot.sendMessage(
    telegramParams.chat.id,
    message,
    { parse_mode: 'HTML' },
  );
};
