const mockCustomVoiceMapData = require('../../mock-custom-voice-map.json');
jest.mock('../../../handlers/data/custom-voice-map.json', () => mockCustomVoiceMapData);

const skill = require('../../../index');
const loadData = require('../../helpers').loadData;

const testData = loadData('integration', {
  'pauseIntentRequest': 'pause-intent-request',
});

const expectedData = loadData('integration', {
  'pauseIntentExpectedResponse': 'pause-intent-expected-response',
});

describe('PauseIntent Request Integration Test: ', () => {
  it('should return an outspeech ok response',
    (done) => skill.handler(testData.pauseIntentRequest, null, (err, result) => {
      if (err) {
        done.fail(err);
      }

      expect(result).toEqual(expectedData.pauseIntentExpectedResponse);
      done();
    })
  );
});
