import {
  decodeRoomCleanV2,
  encodeRoomCleanV2,
  requestRoomCleanV2,
  encodeRoomClean0x56,
  decodeRoomClean0x57,
  requestRoomClean0x57,
} from './cmd56_57';

describe('requestRoomCleanV2', () => {
  test('basic usage', () => {
    expect(requestRoomCleanV2()).toBe('aa01000000015757');
  });
  test('rename  requestRoomCleanV2 to requestRoomClean0x57', () => {
    expect(requestRoomCleanV2).toBe(requestRoomClean0x57);
  });
});

describe('encodeRoomCleanV2', () => {
  test('usage of roomHexIds', () => {
    expect(
      encodeRoomCleanV2({
        rooms: [
          {
            roomHexId: '17',
            cleanTimes: 1,
            suction: 2,
            cistern: 1,
            yMop: 0,
          },
          {
            roomHexId: '27',
            cleanTimes: 1,
            suction: 3,
            cistern: 1,
            yMop: 0,
          },
          {
            roomHexId: '37',
            cleanTimes: 1,
            suction: 2,
            cistern: 1,
            yMop: 0,
          },
          {
            roomHexId: '1f',
            cleanTimes: 1,
            suction: 2,
            cistern: 1,
            yMop: 0,
          },
          {
            roomHexId: '07',
            cleanTimes: 1,
            suction: 2,
            cistern: 1,
            yMop: 0,
          },
          {
            roomHexId: '0f',
            cleanTimes: 1,
            suction: 2,
            cistern: 1,
            yMop: 0,
          },
          {
            roomHexId: '2f',
            cleanTimes: 1,
            suction: 2,
            cistern: 1,
            yMop: 0,
          },
        ],
      })
    ).toBe(
      'aa0100000025560702020100010403010001060201000103020100010002010001010201000105020100018f'
    );
  });

  test('rename encodeRoomCleanV2 to encodeRoomClean0x56', () => {
    expect(encodeRoomClean0x56).toBe(encodeRoomCleanV2);
  });

  test('usage of roomIds', () => {
    expect(
      encodeRoomCleanV2({
        rooms: [
          {
            roomId: 2,
            cleanTimes: 1,
            suction: 2,
            cistern: 1,
            yMop: 0,
          },
          {
            roomId: 4,
            cleanTimes: 1,
            suction: 3,
            cistern: 1,
            yMop: 0,
          },
          {
            roomId: 6,
            cleanTimes: 1,
            suction: 2,
            cistern: 1,
            yMop: 0,
          },
          {
            roomId: 3,
            cleanTimes: 1,
            suction: 2,
            cistern: 1,
            yMop: 0,
          },
          {
            roomId: 0,
            cleanTimes: 1,
            suction: 2,
            cistern: 1,
            yMop: 0,
          },
          {
            roomId: 1,
            cleanTimes: 1,
            suction: 2,
            cistern: 1,
            yMop: 0,
          },

          {
            roomId: 5,
            cleanTimes: 1,
            suction: 2,
            cistern: 1,
            yMop: 'ff',
          },
        ],
      })
    ).toBe(
      'aa01000000255607020201000104030100010602010001030201000100020100010102010001050201ff018e'
    );
  });
});

describe('decodeRoomCleanV2', () => {
  test('basic usage', () => {
    expect(
      decodeRoomCleanV2({
        command:
          'aa01000000255707020201000104030100010602010001030201000100020100010102010001050201ff0190',
      })
    ).toEqual([
      {
        roomHexId: '17',
        roomId: 2,
        suction: 2,
        cistern: 1,
        yMop: 0,
        cleanTimes: 1,
      },
      {
        roomHexId: '27',
        roomId: 4,
        suction: 3,
        cistern: 1,
        yMop: 0,
        cleanTimes: 1,
      },
      {
        roomHexId: '37',
        roomId: 6,
        suction: 2,
        cistern: 1,
        yMop: 0,
        cleanTimes: 1,
      },
      {
        roomHexId: '1f',
        roomId: 3,
        suction: 2,
        cistern: 1,
        yMop: 0,
        cleanTimes: 1,
      },
      {
        roomHexId: '07',
        roomId: 0,
        suction: 2,
        cistern: 1,
        yMop: 0,
        cleanTimes: 1,
      },
      {
        roomHexId: '0f',
        roomId: 1,
        suction: 2,
        cistern: 1,
        yMop: 0,
        cleanTimes: 1,
      },
      {
        roomHexId: '2f',
        roomId: 5,
        suction: 2,
        cistern: 1,
        yMop: 255,
        cleanTimes: 1,
      },
    ]);
  });

  test('rename  decodeRoomCleanV2 to decodeRoomClean0x57', () => {
    expect(decodeRoomClean0x57).toBe(decodeRoomCleanV2);
  });
});
