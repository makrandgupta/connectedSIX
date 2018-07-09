const _ = require('lodash');
const alexaConstants = require('./data/alexa-constants.json');

exports.handler = {
  canHandle(handlerInput) {
    return _.get(handlerInput, 'requestEnvelope.request.type') 
      === alexaConstants.REQUEST_TYPE.SESSION_ENDED_REQUEST;
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};
