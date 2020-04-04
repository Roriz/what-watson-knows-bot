const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({ apikey: process.env.IBM_TEXT_TO_SPEECH }),
  url: 'https://stream.watsonplatform.net/text-to-speech/api/',
});

module.exports = async function TextToSpeechService(text) {
  const audio = await textToSpeech.synthesize({
    text,
    // voice: 'pt-BR_IsabelaV3Voice',
    accept: 'audio/wav',
  });

  return textToSpeech.repairWavHeaderStream(audio.result);
};
