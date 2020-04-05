const textToSpeechService = require('../services/text-to-speech-service');
const ServiceReachLimit = require('../errors/service-reach-limit');

let serviceLimit = parseInt(process.env.IBM_TEXT_TO_SPEECH_LIMIT, 10) || Infinity;

module.exports = async function textToSpeech(telegramParams) {
  if (serviceLimit <= 0) { throw new ServiceReachLimit('text to speech service'); }

  const [, clientMessage] = telegramParams.text.match(/\/[\w_]+\s?(.*)?/);

  const file = await textToSpeechService(clientMessage);

  serviceLimit -= clientMessage.length;

  await global.bot.sendVoice(telegramParams.chat.id, file);
};
