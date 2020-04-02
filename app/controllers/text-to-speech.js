const TextToSpeechService = require('../services/text-to-speech-service');

let serviceLimit = parseInt(process.env.IBM_TONE_ANALYSER_TEXT_TO_SPEECH_LIMIT, 10) || Infinity;

module.exports = (bot) => {
  bot.onText(/\/text_to_speech$/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Invalid arg, if you have any doubt send /help');
  });

  bot.onText(/\/text_to_speech (.+)/, async (msg, match) => {
    if (serviceLimit <= 0) {
      return bot.sendMessage(
        msg.chat.id,
        'Sorry this bot reach the limit, try maybe in another day',
      );
    }

    const file = await new TextToSpeechService(match[1]).call();

    serviceLimit -= match[1].length;

    return bot.sendVoice(
      msg.chat.id,
      file,
    );
  });
};
