const _ = require('lodash');

const alexaConstants = require('./data/alexa-constants.json');
const speechMap = require('./data/speech-map.json');

exports.handler = {
  canHandle(handlerInput) {
    const requestType = _.get(handlerInput, 'requestEnvelope.request.type');
    const intentName = _.get(handlerInput, 'requestEnvelope.request.intent.name');

    return requestType === alexaConstants.REQUEST_TYPE.INTENT_REQUEST
      && intentName === alexaConstants.INTENT_NAME.AMAZON_YES_INTENT;
  },

  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    return handlerInput.responseBuilder
      .speak(speechMap.GENERIC_ERROR)
      .withShouldEndSession(false)
      .getResponse();
  },
};
