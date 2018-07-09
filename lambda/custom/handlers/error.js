const log = require('./libs/log');
const speechMap = require('./data/speech-map.json');

exports.handler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    log.error('Error handled:', handlerInput, error);
    // the following console is needed to see the stack trace
    console.log('error handled console', error); // eslint-disable-line no-console

    return handlerInput.responseBuilder
      .speak(speechMap.GENERIC_ERROR)
      .reprompt(speechMap.GENERIC_ERROR)
      .getResponse();
  },
};
