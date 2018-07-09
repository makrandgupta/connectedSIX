const error = require('./error');

const bestOfIntent = require('./best-of-intent');
const emailIntent = require('./email-intent');
const locationIntent = require('./location-intent');
const cancelAndStopIntent = require('./cancel-and-stop-intent');
const helpIntent = require('./help-intent');
const noIntent = require('./no-intent');
const yesIntent = require('./yes-intent');

const launchRequest = require('./launch-request');
const sessionEndedRequest = require('./session-ended-request');

module.exports = {
  'getHandlers': () => [
    cancelAndStopIntent.handler,
    bestOfIntent.handler,
    emailIntent.handler,
    locationIntent.handler,
    helpIntent.handler,
    launchRequest.handler,
    noIntent.handler,
    sessionEndedRequest.handler,
    yesIntent.handler,
  ],
  'errorHandler': error.handler,
};
