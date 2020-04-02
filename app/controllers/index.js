const tone = require('./tone');
const textToSpeech = require('./text-to-speech');

module.exports = (bot) => {
  tone(bot);
  textToSpeech(bot);

  bot.onText(/\/(start|help)$/, (msg) => {
    bot.sendMessage(msg.chat.id, `
    Hi! I'm watson bot, my objetive is demonstrate some watson features with easy way.
    But remember this is a side-project and maybe can reach the limit of requests.

    Ok, but what I do? For now you can use the services:
    - Tone Analyzer: use with \`/tone Product sales have been disappointing for the past three quarters.\`
    - Text to Speech: use with \`/text_to_speech Product sales\`
    `);
  });
};
