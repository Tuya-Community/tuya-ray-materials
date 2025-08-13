import { encodeDeleteMapV1, decodeDeleteMapV1 } from './cmd_2c_2d';

describe('encodeDeleteMapV1', () => {
  test('basic usage', () => {
    expect(encodeDeleteMapV1({ id: 36921573 })).toBe('ab00000000052c023360e5a6');
  });
});

describe('decodeDeleteMapV1', () => {
  test('if delete map fail', () => {
    expect(
      decodeDeleteMapV1({
        command: 'ab00000000022d002d',
      })
    ).toEqual({
      ret: 0,
      success: false,
    });
  });

  test('if delete map success', () => {
    expect(
      decodeDeleteMapV1({
        command: 'ab00000000022d012f',
      })
    ).toEqual({
      ret: 1,
      success: true,
    });
  });
});
