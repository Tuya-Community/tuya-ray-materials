import { encodeSaveMapV1, decodeSaveMapV1 } from './cmd_2a_2b';

describe('encodeSaveMapV1', () => {
  test('basic usage', () => {
    expect(encodeSaveMapV1()).toBe('ab00000000022a012b');
  });

  test('save locally', () => {
    expect(encodeSaveMapV1(0)).toBe('ab00000000022a002a');
  });
});

describe('decodeSaveMapV1', () => {
  test('if save map fail', () => {
    expect(
      decodeSaveMapV1({
        command: 'ab00000000022b002b',
      })
    ).toEqual({
      ret: 0,
      success: false,
    });
  });

  test('if save map success', () => {
    expect(
      decodeSaveMapV1({
        command: 'ab00000000022b012c',
      })
    ).toEqual({
      ret: 1,
      success: true,
    });
  });
});
