const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({ apikey: process.env.IBM_SPEECH_TO_TEXT }),
  url: 'https://stream.watsonplatform.net/speech-to-text/api/',
});

module.exports = async function SpeechToTextService(audio, mimeType) {
  const response = await speechToText.recognize({
    audio,
    contentType: mimeType,
  });

  return response.result.results[0].alternatives;
};
