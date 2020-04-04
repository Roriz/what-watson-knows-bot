const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const sortBy = require('lodash/sortBy');
const compact = require('lodash/compact');
const { IamAuthenticator } = require('ibm-watson/auth');

module.exports = class ToneService {
  constructor(text) {
    this.text = text;
    this.result = '';
    this.toneAnalyzer = new ToneAnalyzerV3({
      authenticator: new IamAuthenticator({ apikey: process.env.IBM_TONE_ANALYSER_TOKEN }),
      version: '2016-05-19',
      url: 'https://gateway.watsonplatform.net/tone-analyzer/api/',
    });
  }

  async call() {
    await this.requestTone();
    return this.validCategories;
  }

  async requestTone() {
    this.result = (await this.toneAnalyzer.tone({
      toneInput: this.text,
      contentType: 'text/plain',
    })).result.document_tone.tone_categories;
  }

  get validCategories() {
    const results = this.result.map((category) => ({
      label: category.category_name,
      value: sortBy(category.tones, 'score').reverse()[0],
    }));

    return compact(results);
  }
};
