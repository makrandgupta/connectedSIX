/** Unit test for the no intent handler. */
const noIntent = require('../../../handlers/no-intent');
const loadData = require('../../helpers').loadData;

const testData = loadData('unit', {
  'noIntentRequest': 'no-intent-request',
});

describe('NoIntent Unit Test', () => {
  describe('canHandle method', () => {
    it('should return true if the intentName is NoIntent', () => {
      const mockHandlerInput = { 'requestEnvelope': testData.noIntentRequest };
      expect(noIntent.handler.canHandle(mockHandlerInput)).toEqual(true);
    });
  });
});
