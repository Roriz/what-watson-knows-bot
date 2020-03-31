const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const sortBy = require('lodash/sortBy');
const iamAuthenticator = require('./iam-authenticator-service');

module.exports = class ToneService {
  constructor(text) {
    this.text = text;
    this.result = '';
    this.toneAnalyzer = new ToneAnalyzerV3({
      authenticator: iamAuthenticator,
      version: '2016-05-19',
      url: 'https://gateway.watsonplatform.net/tone-analyzer/api/',
    });
  }

  async call() {
    await this.requestTone();
    return `Watson think this tone is:\n${this.formattedCategories}`;
  }

  async requestTone() {
    this.result = (await this.toneAnalyzer.tone({
      toneInput: this.text,
      contentType: 'text/plain',
    })).result.document_tone.tone_categories;
  }

  get validCategories() {
    return this.result.map((category) => ({
      label: category.category_name,
      value: sortBy(category.tones.filter((t) => t.score > 0.5), 'score').reverse()[0],
    })).filter((c) => c.value);
  }

  get formattedCategories() {
    if (this.validCategories.length) {
      return this.validCategories
        .map((r) => `<b>${r.label}</b>: ${r.value.tone_name}\n`)
        .join('');
    }
    return 'nothing :/';
  }
};
