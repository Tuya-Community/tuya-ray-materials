import {
  encodeSetRoomNameV1,
  decodeSetRoomNameV1,
  decodeSetRoomName0x25,
  encodeSetRoomName0x24,
} from './cmd24_25';

describe('encodeSetRoomNameV1', () => {
  test('rename  encodeSetRoomName0x24 to encodeSetRoomNameV1', () => {
    expect(encodeSetRoomName0x24).toBe(encodeSetRoomNameV1);
  });

  test('if edit single room', () => {
    expect(
      encodeSetRoomNameV1({
        rooms: [
          {
            roomHexId: '2f',
            name: 'Hello',
          },
        ],
      })
    ).toBe('aa01000000172401050548656c6c6f000000000000000000000000000023');
  });

  test('if chinese', () => {
    expect(
      encodeSetRoomNameV1({
        rooms: [
          {
            roomHexId: '2f',
            name: '浴室',
          },
        ],
      })
    ).toBe('aa010000001724010506e6b5b4e5aea400000000000000000000000000b6');
  });

  test('if edit two rooms', () => {
    expect(
      encodeSetRoomNameV1({
        rooms: [
          {
            roomHexId: '17',
            name: 'Hey',
          },
          {
            roomHexId: '2f',
            name: 'Hello',
          },
        ],
      })
    ).toBe(
      'aa010000002c2402020348657900000000000000000000000000000000050548656c6c6f00000000000000000000000000004f'
    );
  });
});

describe('decodePartitionDivisionV1', () => {
  test('if single room', () => {
    expect(
      decodeSetRoomNameV1({
        command: 'aa01000000172501050548656c6c6f000000000000000000000000000024',
      })
    ).toEqual([
      {
        name: 'Hello',
        roomHexId: '2f',
        roomId: 5,
      },
    ]);
  });

  test('rename  decodeSetRoomNameV1 to decodeSetRoomName0x25', () => {
    expect(decodeSetRoomName0x25).toBe(decodeSetRoomNameV1);
  });

  test('if two rooms', () => {
    expect(
      decodeSetRoomNameV1({
        command:
          'aa010000002c2502020348657900000000000000000000000000000000050548656c6c6f000000000000000000000000000050',
      })
    ).toEqual([
      {
        name: 'Hey',
        roomHexId: '17',
        roomId: 2,
      },
      {
        name: 'Hello',
        roomHexId: '2f',
        roomId: 5,
      },
    ]);
  });
});
