const skill = require('../../../index');
const loadData = require('../../helpers').loadData;

const testData = loadData('integration', {
  'sessionEndedRequestRequest': 'session-ended-request-request',
});

const expectedData = loadData('integration', {
  'sessionEndedRequestExpectedResponse': 'session-ended-request-expected-response',
});

describe('Session Ended Request Integration Test: ', () => {
  it('should return json with empty session attributes',
    (done) => skill.handler(testData.sessionEndedRequestRequest, null, (err, result) => {
      if (err) {
        done.fail(err);
      }

      expect(result).toEqual(expectedData.sessionEndedRequestExpectedResponse);
      done();
    })
  );
});
