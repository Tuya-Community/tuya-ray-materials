import { decodeSetRoomPropertyV1, encodeSetRoomPropertyV1 } from './cmd22_23';

describe('encodeSetRoomPropertyV1', () => {
  test('if roomId', () => {
    expect(
      encodeSetRoomPropertyV1({
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
            yMop: 0,
          },
        ],
      })
    ).toBe(
      'aa0100000025220702020100010403010001060201000103020100010002010001010201000105020100015b'
    );
  });

  test('if roomHexId', () => {
    expect(
      encodeSetRoomPropertyV1({
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
      'aa0100000025220702020100010403010001060201000103020100010002010001010201000105020100015b'
    );
  });
});

describe('decodeSetRoomPropertyV1', () => {
  test('basic usage', () => {
    expect(
      decodeSetRoomPropertyV1({
        command:
          'aa0100000025230702020100010403010001060201000103020100010002010001010201000105020100015c',
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
        yMop: 0,
        cleanTimes: 1,
      },
    ]);
  });
});
