const SpeechToTextService = require('../services/speech-to-text-service');
const ServiceReachLimit = require('../errors/service-reach-limit');

let serviceLimit = parseInt(process.env.IBM_SPEECH_TO_TEXT_LIMIT, 10) || Infinity;

module.exports = async function speechToText(telegramParams) {
  if (serviceLimit <= 0) { throw new ServiceReachLimit('speech to text service'); }

  const audio = global.bot.getFileStream(telegramParams.voice.file_id);

  const alternatives = await SpeechToTextService(audio, telegramParams.voice.mime_type);

  const formattedAlternatives = alternatives
    .map((a) => `${a.transcript} (${parseInt(a.confidence * 100, 10)}%)`)
    .join('\n');

  serviceLimit -= telegramParams.duration;

  await global.bot.sendMessage(
    telegramParams.chat.id,
    `You problable say:\n${formattedAlternatives}`,
  );
};
