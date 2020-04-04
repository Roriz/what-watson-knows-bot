const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

module.exports = class TextToSpeechService {
  constructor(image) {
    this.image = image;
    this.visualRecognition = new VisualRecognitionV3({
      authenticator: new IamAuthenticator({ apikey: process.env.IBM_VISUAL_RECOGNITION }),
      url: 'https://stream.watsonplatform.net/visual-recognition/api/',
      version: '2018-03-19',
    });
  }

  call() {
    return this.classifyImage();
  }

  async classifyImage() {
    const response = await this.visualRecognition.classify({
      imagesFile: this.image,
    });

    return response.result.images[0].classifiers[0].classes;
  }
};
