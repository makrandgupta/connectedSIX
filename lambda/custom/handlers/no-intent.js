const _ = require('lodash');

const alexaConstants = require('./data/alexa-constants.json');
const speechMap = require('./data/speech-map.json');

exports.handler = {
  canHandle(handlerInput) {
    const requestType = _.get(handlerInput, 'requestEnvelope.request.type');
    const intentName = _.get(handlerInput, 'requestEnvelope.request.intent.name');

    return requestType === alexaConstants.REQUEST_TYPE.INTENT_REQUEST
      && intentName === alexaConstants.INTENT_NAME.AMAZON_NO_INTENT;
  },

  async handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const previousIntent = _.get(sessionAttributes, alexaConstants.ATTRIBUTE_NAME.PREVIOUS_INTENT);
    sessionAttributes[alexaConstants.ATTRIBUTE_NAME.PREVIOUS_INTENT] = alexaConstants.INTENT_NAME.NO_INTENT;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    if (previousIntent === alexaConstants.INTENT_NAME.LOCATION_INTENT) {
      return handlerInput.responseBuilder
        .speak(speechMap.NO_READ_BLOG_RESPONSE)
        .withShouldEndSession(false)
        .getResponse();
    }

    return handlerInput.responseBuilder
      .withShouldEndSession(true)
      .getResponse();
  },
};
