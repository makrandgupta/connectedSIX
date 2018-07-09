/** Unit test for the country genre handler. */

const yesIntent = require('../../../handlers/yes-intent');
const loadData = require('../../helpers').loadData;

const testData = loadData('unit', {
  'yesIntentRequest': 'yes-intent-request',
});

describe('YesIntent Unit Test', () => {
  describe('canHandle method', () => {
    it('should return true if the intentName is YesIntent', () => {
      const mockHandlerInput = { 'requestEnvelope': testData.yesIntentRequest };
      expect(yesIntent.handler.canHandle(mockHandlerInput)).toEqual(true);
    });
  });
});
