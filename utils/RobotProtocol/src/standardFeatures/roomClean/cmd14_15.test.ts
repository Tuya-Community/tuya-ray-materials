import {
  decodeRoomCleanV1,
  encodeRoomCleanV1,
  requestRoomCleanV1,
  encodeRoomClean0x14,
  decodeRoomClean0x15,
} from './cmd14_15';

describe('requestRoomCleanV1', () => {
  test('if run function with param version=0', () => {
    expect(requestRoomCleanV1({ version: '0' })).toBe('aa00011515');
  });

  test('if run function with param version=1', () => {
    expect(requestRoomCleanV1({ version: '1' })).toBe('aa01000000011515');
  });

  test('if run function with param version=', () => {
    expect(requestRoomCleanV1()).toBe('aa01000000011515');
  });
});

describe('encodeRoomCleanV1', () => {
  test('usage of roomHexIds', () => {
    expect(
      encodeRoomCleanV1({
        roomHexIds: ['22', '2a', '1a'],
        cleanTimes: 1,
        mapVersion: 2,
      })
    ).toBe('aa010000000614010304050324');
  });

  test('usage of roomHexIds and mapVersion=1', () => {
    expect(
      encodeRoomCleanV1({
        roomHexIds: ['22', '1a', '2a'],
        cleanTimes: 2,
        mapVersion: 1,
      })
    ).toBe('aa010000000614020308060a31');
  });

  test('usage of roomIds', () => {
    expect(
      encodeRoomCleanV1({
        roomIds: [4, 5, 3],
        cleanTimes: 1,
      })
    ).toBe('aa010000000614010304050324');
  });
});

describe('decodeRoomCleanV1', () => {
  test('if run function with param version=0', () => {
    expect(
      decodeRoomCleanV1({ command: 'aa000615010304050324', mapVersion: 2, version: '0' })
    ).toEqual({
      cleanTimes: 1,
      roomIds: [4, 5, 3],
      roomHexIds: ['27', '2f', '1f'],
    });
  });
  test('if run function with param version=1', () => {
    expect(
      decodeRoomCleanV1({ command: 'aa010000000615010304050324', mapVersion: 2, version: '1' })
    ).toEqual({
      cleanTimes: 1,
      roomIds: [4, 5, 3],
      roomHexIds: ['27', '2f', '1f'],
    });
  });
  test('if run function with param version=', () => {
    expect(decodeRoomCleanV1({ command: 'aa010000000615010304050324' })).toEqual({
      cleanTimes: 1,
      roomIds: [4, 5, 3],
      roomHexIds: ['27', '2f', '1f'],
    });
  });
  test('if run function with param mapVersion=1', () => {
    expect(decodeRoomCleanV1({ command: 'aa010000000615020302060425', mapVersion: 1 })).toEqual({
      cleanTimes: 2,
      roomIds: [2, 6, 4],
      roomHexIds: ['08', '18', '10'],
    });
  });
  test('if cmd not match', () => {
    expect(decodeRoomCleanV1({ command: 'aa0100000006ff010304050324' })).toBe(null);
  });
  test('if data length not match', () => {
    expect(decodeRoomCleanV1({ command: 'aa01000000061501030405' })).toBe(null);
  });

  test('rename encodeRoomCleanV1 to encodeRoomClean0x14', () => {
    expect(encodeRoomCleanV1).toBe(encodeRoomClean0x14);
  });

  test('rename decodeRoomCleanV1 to decodeRoomClean0x15', () => {
    expect(decodeRoomCleanV1).toBe(decodeRoomClean0x15);
  });
});
