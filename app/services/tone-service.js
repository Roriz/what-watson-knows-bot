const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const sortBy = require('lodash/sortBy');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
  authenticator: new IamAuthenticator({ apikey: process.env.IBM_TONE_ANALYSER_TOKEN }),
  version: '2016-05-19',
  url: 'https://gateway.watsonplatform.net/tone-analyzer/api/',
});

module.exports = async function ToneService(text) {
  const response = await toneAnalyzer.tone({
    toneInput: text,
    contentType: 'text/plain',
  });

  return response.document_tone.tone_categories.map((category) => ({
    label: category.category_name,
    value: sortBy(category.tones, 'score').reverse()[0],
  }));
};
