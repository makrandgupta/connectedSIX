const mockCustomVoiceMapData = require('../../mock-custom-voice-map.json');
jest.mock('../../../handlers/data/custom-voice-map.json', () => mockCustomVoiceMapData);

const mockFetchLastPlayedStationId = jest.fn();
const mockLoginOrCreateOauthUser = jest.fn();
jest.mock('../../../handlers/libs/ihr-api', () => ({
  'loginOrCreateOauthUser': mockLoginOrCreateOauthUser,
  'fetchLastPlayedStationId': mockFetchLastPlayedStationId,
}));

const skill = require('../../../index');
const loadData = require('../../helpers').loadData;

const testData = loadData('integration', {
  'launchRequestRequest': 'launch-request-request',
});

const expectedData = loadData('integration', {
  'launchRequestNewUserExpectedResponse': 'launch-request-new-user-expected-response',
  'launchRequestReturningUserExpectedResponse': 'launch-request-returning-user-expected-response',
});

describe('Launch Request Integration Test: ', () => {
  it('should return json with default launch speech if new user',
    (done) => {
      mockFetchLastPlayedStationId.mockImplementation(() => Promise.resolve());
      return skill.handler(testData.launchRequestRequest, null, (err, result) => {
        if (err) {
          done.fail(err);
        }

        expect(result).toEqual(expectedData.launchRequestNewUserExpectedResponse);
        done();
      });
    }
  );
  it('should return json with returning launch speech if returning user',
    (done) => {
      mockFetchLastPlayedStationId.mockImplementation(() => Promise.resolve(6647));

      return skill.handler(testData.launchRequestRequest, null, (err, result) => {
        if (err) {
          done.fail(err);
        }

        expect(result).toEqual(expectedData.launchRequestReturningUserExpectedResponse);
        done();
      });
    }
  );
});
