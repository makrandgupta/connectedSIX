const _ = require('lodash');
const alexaConstants = require('./data/alexa-constants.json');
const speechMap = require('./data/speech-map.json');

exports.handler = {
  canHandle(handlerInput) {
    const requestType = _.get(handlerInput, 'requestEnvelope.request.type');
    const intentName = _.get(handlerInput, 'requestEnvelope.request.intent.name');

    return requestType === alexaConstants.REQUEST_TYPE.INTENT_REQUEST 
      && intentName === alexaConstants.INTENT_NAME.AMAZON_HELP_INTENT;
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes[alexaConstants.ATTRIBUTE_NAME.PREVIOUS_INTENT] = alexaConstants.INTENT_NAME.AMAZON_HELP_INTENT;
    sessionAttributes[alexaConstants.ATTRIBUTE_NAME.PREVIOUS_QUESTION_KEY] = 'HELP_SPEECH';
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    return handlerInput.responseBuilder
      .speak(speechMap.HELP_SPEECH)
      .withShouldEndSession(false)
      .getResponse();
  },
};
