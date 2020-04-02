const TextToSpeechService = require('../services/text-to-speech-service');


module.exports = (bot) => {
  bot.onText(/\/text_to_speech$/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Invalid arg, if you have any doubt send /help');
  });

  bot.onText(/\/text_to_speech (.+)/, async (msg, match) => {
    const file = await new TextToSpeechService(match[1]).call();

    await bot.sendVoice(
      msg.chat.id,
      file,
    );
  });
};
