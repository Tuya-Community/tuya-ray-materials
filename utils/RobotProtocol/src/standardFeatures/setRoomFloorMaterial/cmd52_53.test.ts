import { encodeSetRoomFloorMaterial0x52, decodeSetRoomFloorMaterial0x53 } from './cmd52_53';

describe('encodeSetRoomFloorMaterial0x52', () => {
  test('encodeSetRoomFloorMaterial0x52', () => {
    expect(
      encodeSetRoomFloorMaterial0x52({
        rooms: [
          {
            roomId: 0,
            material: 2,
          },
          {
            roomId: 1,
            material: 2,
          },
        ],
        version: '1',
      })
    ).toBe('aa0100000007520102000201025a');
  });
});

describe('decodeSetRoomFloorMaterial0x53', () => {
  test('decodeSetRoomFloorMaterial0x53', () => {
    expect(
      decodeSetRoomFloorMaterial0x53({
        command: 'aa0100000007530102000201025b',
        version: '1',
      })
    ).toEqual([
      {
        roomId: 0,
        material: 2,
      },
      {
        roomId: 1,
        material: 2,
      },
    ]);
  });
});
