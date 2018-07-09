const _ = require('lodash');

const LOG = _.get(process, 'env.LOG');
const ANALYTICS = _.get(process, 'env.ANALYTICS');

const alexaConstants = require('../data/alexa-constants.json');

const stringify = (...params) => params.reduce((accumulator, current) => {
  const stringParam = (_.isPlainObject(current)) ? JSON.stringify(current) : current;
  return `${(accumulator === '') ? '' : `${accumulator} `}${stringParam}`;
}, '');

const log = (method, ...data) => {
  console[method](stringify(...data)); // eslint-disable-line no-console
};

const analytics = (handlerInput) => {
  /**
   * log format:
   * timestamp | userId | previous question | previous intent | current intent | slot value
   */

  if (ANALYTICS) {
    const logData = {};
    logData.timestamp = new Date();
    if (handlerInput) {
      logData.userId = _.get(handlerInput, 'requestEnvelope.context.System.user.userId');
      logData.previousQuestionKey = _.get(handlerInput, 'requestEnvelope.session.attributes.previousQuestionKey');
      logData.previousIntent = _.get(handlerInput, 'requestEnvelope.session.attributes.previousIntent');
      logData.currentIntent = _.get(handlerInput, 'requestEnvelope.request.intent.name');
      const slots = _.get(handlerInput, 'requestEnvelope.request.intent.slots');
      if (slots) {
        for (const slot in slots) {
          if (_.has(slots, slot)) {
            const slotData = slots[slot];
            logData[slot] = {
              'utterance': _.get(slotData, 'value'),
            };
            const resolutions = _.get(slotData, 'resolutions.resolutionsPerAuthority');
            if (_.isEmpty(resolutions)) {
              continue;
            }
            resolutions.forEach((resolution) => {
              if (_.get(resolution, 'status.code') === alexaConstants.SLOT_RESOLUTION.STATUS_CODE.ER_SUCCESS_MATCH) {
                logData[slot].resolutions = (_.get(resolution, 'values')).map((resValue) => _.get(resValue, 'value.name'));
              } else {
                logData[slot].resolutions = [];
              }
            });
          }
        }
      }
    }
    log('log', 'ANALYTICS', stringify(logData));
  }
};

const info = (...data) => {
  if (LOG === 'INFO') {
    log('log', ...data);
  }
};

const error = (...data) => {
  log('error', ...data);
};

module.exports = {
  info,
  error,
  stringify,
  analytics,
};