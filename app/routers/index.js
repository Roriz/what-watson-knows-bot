const toneController = require('../controllers/tone-controller');
const textToSpeechController = require('../controllers/text-to-speech-controller');
const visualRecognitionController = require('../controllers/visual-recognition-controller');
const speechToTextController = require('../controllers/speech-to-text-controller');
const startController = require('../controllers/start-controller');

module.exports = async function routers(telegramParams) {
  const text = telegramParams.text || '';

  if (telegramParams.photo) {
    await visualRecognitionController(telegramParams);
  } else if (telegramParams.voice) {
    await speechToTextController(telegramParams);
  } else if (text.includes('/text_to_speech')) {
    await textToSpeechController(telegramParams);
  } else if (text.match('/tone')) {
    await toneController(telegramParams);
  } else if (telegramParams.chat.type === 'private') {
    await startController(telegramParams);
  }
};
