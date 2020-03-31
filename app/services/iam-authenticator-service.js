const { IamAuthenticator } = require('ibm-watson/auth');

module.exports = new IamAuthenticator({ apikey: process.env.IBM_TONE_ANALYSER_TOKEN });
