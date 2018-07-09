const log = require('../../../../handlers/libs/log');

describe('Log module tests', () => {
  it('should stringify object in an array of parameter', () => {
    const result = log.stringify(
      'a string',
      { 'an': 'object' },
      {
        'a': {
          'very': {
            'nested': 'object',
          },
        },
      },
    );
    expect(result).toEqual('a string {"an":"object"} {"a":{"very":{"nested":"object"}}}');
  });
});
