const skill = require('../../../index');
const loadData = require('../../helpers').loadData;

const testData = loadData('integration', {
  'cancelIntentRequest': 'cancel-intent-request',
  'stopIntentRequest': 'stop-intent-request',
});

const expectedData = loadData('integration', {
  'cancelIntentExpectedResponse': 'cancel-intent-expected-response',
  'stopIntentExpectedResponse': 'stop-intent-expected-response',
});

describe('Cancel And Stop Intent Integration Test: ', () => {
  describe('CancelIntent: ', () => {
    it('should return json saying ok',
      (done) => skill.handler(testData.cancelIntentRequest, null, (err, result) => {
        if (err) {
          done.fail(err);
        }

        expect(result).toEqual(expectedData.cancelIntentExpectedResponse);
        done();
      })
    );
  });
  describe('StopIntent: ', () => {
    it('should return json saying ok',
      (done) => skill.handler(testData.stopIntentRequest, null, (err, result) => {
        if (err) {
          done.fail(err);
        }

        expect(result).toEqual(expectedData.stopIntentExpectedResponse);
        done();
      })
    );
  });
});
