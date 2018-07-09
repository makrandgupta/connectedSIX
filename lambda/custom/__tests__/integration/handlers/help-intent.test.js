const skill = require('../../../index');
const loadData = require('../../helpers').loadData;

const testData = loadData('integration', {
  'helpIntentRequest': 'help-intent-request',
});

const expectedData = loadData('integration', {
  'helpIntentExpectedResponse': 'help-intent-expected-response',
});

describe('helpIntent Request Integration Test: ', () => {
  it('should return an outspeech help response',
    (done) => skill.handler(testData.helpIntentRequest, null, (err, result) => {
      if (err) {
        done.fail(err);
      }

      expect(result).toEqual(expectedData.helpIntentExpectedResponse);
      done();
    })
  );
});
