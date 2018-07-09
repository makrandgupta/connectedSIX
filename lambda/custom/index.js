const Alexa = require('ask-sdk-core');
const handlers = require('./handlers');
const log = require('./handlers/libs/log');

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(...handlers.getHandlers())
  .addRequestInterceptors({
    'process': (...params) => {
      log.analytics(...params);
      log.info(...params);
    },
  })
  .addResponseInterceptors({
    'process': (handlerInput, response) => log.info(response),
  })
  .addErrorHandlers(handlers.errorHandler)
  .lambda();
