const _ = require('lodash');
const alexaConstants = require('./data/alexa-constants.json');

exports.handler = {
  canHandle(handlerInput) {
    const requestType = _.get(handlerInput, 'requestEnvelope.request.type');
    const intentName = _.get(handlerInput, 'requestEnvelope.request.intent.name');

    return requestType === alexaConstants.REQUEST_TYPE.INTENT_REQUEST
      && (intentName === alexaConstants.INTENT_NAME.AMAZON_CANCEL_INTENT 
        || intentName === alexaConstants.INTENT_NAME.AMAZON_STOP_INTENT);
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes[alexaConstants.ATTRIBUTE_NAME.PREVIOUS_INTENT] = _.get(handlerInput, 'requestEnvelope.request.intent.name');
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    return handlerInput.responseBuilder
      .getResponse();
  },
};
