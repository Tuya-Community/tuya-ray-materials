import {
  decodePartitionDivisionV1,
  encodePartitionDivisionV1,
  encodePartitionDivision0x1c,
  decodePartitionDivision0x1d,
} from './cmd1c_1d';

describe('encodePartitionDivisionV1', () => {
  test('basic usage', () => {
    expect(
      encodePartitionDivisionV1({
        roomId: 2,
        points: [
          {
            x: 152,
            y: 221,
          },
          {
            x: 108,
            y: 192,
          },
        ],
        origin: {
          x: 178.5,
          y: 81.7,
        },
      })
    ).toBe('aa010000000a1c02fef6fa8efd3efbb080');
  });

  test('rename  encodePartitionDivision0x1c to encodePartitionDivisionV1', () => {
    expect(encodePartitionDivision0x1c).toBe(encodePartitionDivisionV1);
  });
});

describe('decodePartitionDivisionV1', () => {
  test('if divide fail', () => {
    expect(
      decodePartitionDivisionV1({
        command: 'aa01000000021d011e',
      })
    ).toEqual({
      ret: 1,
      success: true,
    });
  });
  test('rename  decodePartitionDivision0x1d to decodePartitionDivisionV1', () => {
    expect(decodePartitionDivision0x1d).toBe(decodePartitionDivisionV1);
  });
  test('if divide success', () => {
    expect(
      decodePartitionDivisionV1({
        command: 'aa01000000021d021f',
      })
    ).toEqual({
      ret: 2,
      success: false,
    });
  });
});
