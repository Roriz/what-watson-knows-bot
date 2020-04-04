const textToSpeechService = require('../services/text-to-speech-service');

let serviceLimit = parseInt(process.env.IBM_TEXT_TO_SPEECH_LIMIT, 10) || Infinity;

global.bot.onText(/\/text_to_speech$/, (msg) => {
  global.bot.sendMessage(msg.chat.id, 'Invalid arg, if you have any doubt send /help');
});

global.bot.onText(/\/text_to_speech (.+)/, async (msg, match) => {
  if (serviceLimit <= 0) {
    global.bot.sendMessage(
      msg.chat.id,
      'Sorry this bot reach the limit, try maybe in another day',
    );
    return;
  }

  const file = await textToSpeechService(match[1]).call();

  serviceLimit -= match[1].length;

  global.bot.sendVoice(msg.chat.id, file);
});
