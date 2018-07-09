const _ = require('lodash');
const leven = require('leven');
const fetch = require('node-fetch');
const alexaConstants = require('../data/alexa-constants.json');
const skillModel = require('../data/model.json');

const alexaApiBaseUrl = 'https://api.amazonalexa.com';

const getDeviceLocation = async (handlerInput) => {
  const deviceId = _.get(handlerInput, 'requestEnvelope.context.System.device.deviceId');
  const apiAccessToken = _.get(handlerInput, 'requestEnvelope.context.System.apiAccessToken');

  const url = `${alexaApiBaseUrl}/v1/devices/${deviceId}/settings/address/countryAndPostalCode`;

  const options = {
    'headers': {
      'accept': 'application/json',
      'Authorization': `Bearer ${apiAccessToken}`
    },
  };

  const res = await fetch(url, options)

  if (_.get(res, 'status') !== 200) {
    return Promise.reject(new Error(`Error geting device location`));
  }

  const resJson = await res.json();
  return Promise.resolve(resJson);
}

/**
 * @param intentRequest an Alexa json object representing the request.
 * @param slotName a slotName in the slotsin the intentRequest.
 * @return the value for that slot or null.
 */
const getSlotValue = (intentRequest, slotName) => {
  const slot = _.get(intentRequest, `slots.${slotName}`);
  const slotResolutions = _.get(slot, 'resolutions.resolutionsPerAuthority', []);

  // Alexa returns the values that were matched during the resolution with the status code ER_SUCCESS_MATCH
  // and ranks them in descending order with the best match at the top.

  const bestResolution = slotResolutions.find(
    (resolution) => _.get(resolution, 'status.code') === alexaConstants.SLOT_RESOLUTION.STATUS_CODE.ER_SUCCESS_MATCH
  );

  const resolvedValues = _.get(bestResolution, 'values', []);
  if (resolvedValues.length > 1) {
    return getBestResolution(_.get(slot, 'value'), intentRequest.name, slotName, resolvedValues);
  }
  return _.get(bestResolution, 'values.0.value') || null;
};

/**
 * @param {string} utterance the utterance the used to trigger the intent
 * @param {string} intentName the intent which triggered the resolution
 * @param {string} slotName the slot for which the resolution is happening
 * @param {[object]} candidates the array of candidate objects that are contending for resolution
 * @returns {object} {
 *    value: {
 *      "name": "Resolution Name",
 *      "id": "9999"
 *    }
 * }
 */
const getBestResolution = (utterance, intentName, slotName, candidates) => {
  const intentsArray = _.get(skillModel, 'interactionModel.languageModel.intents');
  const slotTypesArray = _.get(skillModel, 'interactionModel.languageModel.types');

  /**
   *
   * our target is the synonyms for each candidate. These synonyms are available in the slotType for the candidates
   * we are provided with the slot name and intent name for the current request
   * the model has the following structure:
   * {
   *   "intents": [
   *     {
   *       "name": "<intentName>",
   *       "slots": [
   *         {
   *           "name": "<slotName>",
   *           "type": "<SlotTypeName>"
   *         }
   *       ]
   *     }
   *   ],
   *     "types": [
   *       {
   *         "values": [
   *           {
   *             "id": "9999",
   *             "name": {
   *               "value": "someValue",
   *               "synonyms": [ <------- TARGET
   *                 "synonym 1",
   *                 "synonym 2",
   *                 "synonym 3"
   *               ]
   *             }
   *           }
   *         ],
   *         "name": "<SlotTypeName>"
   *       }
   *     ]
   * }
   *
   * in order to get to the slotType, we need to find the intent using the given intentName
   * and search for the SlotTypeName using the given slot name
   *
   */
  const currentIntent = intentsArray.find(
    (intent) => _.get(intent, 'name') === intentName
  );
  const currentSlot = _.get(currentIntent, 'slots', []).find(
    (slot) => _.get(slot, 'name') === slotName
  );
  const currentSlotType = slotTypesArray.find(
    (type) => _.get(type, 'name') === _.get(currentSlot, 'type')
  );

  /**
   * Each candidate is a possible resolution for the utterance said by the user.
   * The best candidate is determined by comparing the score assigned to each candidate
   * by comparing all it's synonyms to the utterance and picking the one that is the closest.
   * The candidateAccumulator retains the candidate with the lowest overall score.
   * For more details, see the comment for the synonym reducer.
   */
  const bestCandidate = candidates.reduce((candidateAccumulator, candidate) => {
    const id = _.get(candidate, 'value.id');
    const name = _.get(candidate, 'value.name');
    const currentSlotValue = currentSlotType.values.find(
      (value) => _.get(value, 'id') === id
    );
    const synonyms = _.get(currentSlotValue, 'name.synonyms');
    synonyms.push(name);

    /**
     * The score for each candidate is it's Levenshtein distance from the utterance said by the user.
     * The synonymAccumulator retains the synonym with the lowest score (distance) from the utterance.
     */
    const bestSynonym = synonyms.reduce((synonymAccumulator, synonym) => {
      const score = leven(utterance, synonym);
      if (_.isEmpty(synonymAccumulator) || score < synonymAccumulator.score) {
        synonymAccumulator.score = score;
        synonymAccumulator.synonym = synonym;
      }
      return synonymAccumulator;
    }, {});

    if (_.isEmpty(candidateAccumulator) || bestSynonym.score < candidateAccumulator.score) {
      return {
        'id': id,
        'name': name,
        'synonym': bestSynonym.synonym,
        'score': bestSynonym.score,
      };
    }

    return candidateAccumulator;
  }, {});

  return {
    'id': bestCandidate.id,
    'name': bestCandidate.name,
  };
};

/**
 *
 * @param {string} speechUrl the url from which to make the audio tag
 * @return {string} the SSML audio tag
 */
const getSSMLAudioTag = (speechUrl) => `<audio src="${speechUrl}" />`;

module.exports = {
  getSlotValue,
  getSSMLAudioTag,
  prependPlaybackPrelude,
  getDeviceLocation, 
};
