const SpeechToTextService = require('../services/speech-to-text-service');

let serviceLimit = parseInt(process.env.IBM_SPEECH_TO_TEXT_LIMIT, 10) || Infinity;

global.bot.on('message', async (msg) => {
  if (!msg.voice) { return; }

  if (serviceLimit <= 0) {
    global.bot.sendMessage(
      msg.chat.id,
      'Sorry this bot reach the limit, try maybe in another day',
    );
    return;
  }

  const audio = global.bot.getFileStream(msg.voice.file_id);

  const alternatives = await SpeechToTextService(audio, msg.voice.mime_type);

  const formattedAlternatives = alternatives
    .map((a) => `"${a.transcript}" (${parseInt(a.confidence * 100, 10)}%)`)
    .join('\n');

  serviceLimit -= msg.duration;

  global.bot.sendMessage(
    msg.chat.id,
    `You problable say:\n${formattedAlternatives}`,
  );
});
