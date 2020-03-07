import * as utils from '.';

describe('Utils', () => {
  test('capitalize', () => {
    expect(utils.capitalize('test')).toEqual('Test');
  });
});
