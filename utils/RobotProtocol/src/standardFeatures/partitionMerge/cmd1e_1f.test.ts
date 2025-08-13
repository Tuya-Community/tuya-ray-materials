import {
  encodePartitionMergeV1,
  decodePartitionMergeV1,
  encodePartitionMerge0x1e,
  decodePartitionMerge0x1f,
} from './cmd1e_1f';

describe('encodePartitionMergeV1', () => {
  test('basic usage', () => {
    expect(
      encodePartitionMergeV1({
        roomIds: [5, 2],
      })
    ).toBe('aa01000000031e050225');
  });

  test('rename  encodePartitionMerge0x1e to encodePartitionMergeV1', () => {
    expect(encodePartitionMerge0x1e).toBe(encodePartitionMergeV1);
  });
});

describe('decodePartitionDivisionV1', () => {
  test('if merge fail', () => {
    expect(
      decodePartitionMergeV1({
        command: 'aa01000000021f001f',
      })
    ).toEqual({
      ret: 0,
      success: false,
    });
  });

  test('rename  decodePartitionMergeV1 to decodePartitionMerge0x1f', () => {
    expect(decodePartitionMergeV1).toBe(decodePartitionMerge0x1f);
  });

  test('if merge success', () => {
    expect(
      decodePartitionMergeV1({
        command: 'aa01000000021f0120',
      })
    ).toEqual({
      ret: 1,
      success: true,
    });
  });
});
