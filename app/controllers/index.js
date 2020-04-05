require('./tone');
require('./text-to-speech');
require('./visual-recognition');
require('./speech-to-text');

global.bot.onText(/\/(start|help)$/, (msg) => {
  global.bot.sendMessage(
    msg.chat.id,
    `Hi! I'm <b>watson bot</b>, my objetive is demonstrate some watson features with easy way.
      But remember this is a side-project and maybe can reach the limit of requests.

      Ok, but what I do? For now you can use the services:
      - <b>Tone Analyzer</b> to use send me something like: \`/tone Product sales have been disappointing for the past three quarters.\`
      - <b>Text to Speech</b> to use send me something like: \`/text_to_speech Product sales\`
      - <b>Visual Recognition</b> to use send me a photo
      - <b>Speech to Text</b> to use send me a audio`,
    { parse_mode: 'HTML' },
  );
});
