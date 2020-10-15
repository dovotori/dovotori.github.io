import { capitalize } from '../index';

describe('Utils', () => {
  test('capitalize', () => {
    expect(capitalize('test')).toEqual('Test');
  });
});
