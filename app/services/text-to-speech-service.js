const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

module.exports = class TextToSpeechService {
  constructor(text) {
    this.text = text;
    this.textToSpeech = new TextToSpeechV1({
      authenticator: new IamAuthenticator({ apikey: process.env.IBM_TONE_ANALYSER_TEXT_TO_SPEECH }),
      url: 'https://stream.watsonplatform.net/text-to-speech/api/',
    });
  }

  call() {
    return this.requestAudio();
  }

  async requestAudio() {
    const audio = await this.textToSpeech.synthesize({
      text: this.text,
      // voice: 'pt-BR_IsabelaV3Voice',
      accept: 'audio/wav',
    });

    return this.textToSpeech.repairWavHeaderStream(audio.result);
  }
};
