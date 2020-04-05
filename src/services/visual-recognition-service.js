const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const visualRecognition = new VisualRecognitionV3({
  authenticator: new IamAuthenticator({ apikey: process.env.IBM_VISUAL_RECOGNITION }),
  url: 'https://stream.watsonplatform.net/visual-recognition/api/',
  version: '2018-03-19',
});

module.exports = async function TextToSpeechService(image) {
  const response = await visualRecognition.classify({
    imagesFile: image,
  });

  return response.result.images[0].classifiers[0].classes;
};
