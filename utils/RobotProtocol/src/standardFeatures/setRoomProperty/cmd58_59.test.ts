import { decodeSetRoomProperty0x59, encodeSetRoomProperty0x58 } from './cmd58_59';

describe('encodeSetRoomProperty0x58', () => {
  test('if roomId', () => {
    expect(
      encodeSetRoomProperty0x58({
        rooms: [
          {
            roomId: 2,
            cleanMode: 0,
            cleanTimes: 1,
            suction: 2,
            cistern: 1,
            yMop: 0,
          },
          {
            roomId: 4,
            cleanMode: 1,
            cleanTimes: 1,
            suction: 3,
            cistern: 'ff',
            yMop: 0,
          },
          {
            roomId: 6,
            cleanMode: 2,
            cleanTimes: 1,
            suction: 'ff',
            cistern: 1,
            yMop: 0,
          },
          {
            roomId: 3,
            cleanMode: 0,
            cleanTimes: 1,
            suction: 2,
            cistern: 1,
            yMop: 0,
          },
          {
            roomId: 0,
            cleanMode: 0,
            cleanTimes: 1,
            suction: 2,
            cistern: 1,
            yMop: 0,
          },
          {
            roomId: 1,
            cleanMode: 0,
            cleanTimes: 1,
            suction: 2,
            cistern: 1,
            yMop: 0,
          },
          {
            roomId: 5,
            cleanMode: 0,
            cleanTimes: 1,
            suction: 2,
            cistern: 1,
            yMop: 0,
          },
        ],
      })
    ).toBe(
      'aa010000002c5807020002010001040103ff00010602ff0100010300020100010000020100010100020100010500020100018f'
    );
  });
});

describe('decodeSetRoomProperty0x59', () => {
  test('basic usage', () => {
    expect(
      decodeSetRoomProperty0x59({
        command:
          'aa010000002c5907020002010001040103ff00010602ff01000103000201000100000201000101000201000105000201000190',
      })
    ).toEqual([
      {
        roomHexId: '17',
        cleanMode: 0,
        roomId: 2,
        suction: 2,
        cistern: 1,
        yMop: 0,
        cleanTimes: 1,
      },
      {
        roomHexId: '27',
        roomId: 4,
        cleanMode: 1,
        suction: 3,
        cistern: 255,
        yMop: 0,
        cleanTimes: 1,
      },
      {
        roomHexId: '37',
        cleanMode: 2,
        roomId: 6,
        suction: 255,
        cistern: 1,
        yMop: 0,
        cleanTimes: 1,
      },
      {
        roomHexId: '1f',
        cleanMode: 0,
        roomId: 3,
        suction: 2,
        cistern: 1,
        yMop: 0,
        cleanTimes: 1,
      },
      {
        roomHexId: '07',
        cleanMode: 0,
        roomId: 0,
        suction: 2,
        cistern: 1,
        yMop: 0,
        cleanTimes: 1,
      },
      {
        roomHexId: '0f',
        cleanMode: 0,
        roomId: 1,
        suction: 2,
        cistern: 1,
        yMop: 0,
        cleanTimes: 1,
      },
      {
        roomHexId: '2f',
        cleanMode: 0,
        roomId: 5,
        suction: 2,
        cistern: 1,
        yMop: 0,
        cleanTimes: 1,
      },
    ]);
  });
});
