import {
  encodeRoomOrderV1,
  decodeRoomOrderV1,
  encodeRoomOrder0x26,
  decodeRoomOrder0x27,
} from './cmd26_27';

describe('encodeRoomOrderV1', () => {
  it('should encode room order with version 1', () => {
    const roomIdHexs = ['37', '2f'];
    const result = encodeRoomOrderV1({ roomIdHexs, version: '1', mapVersion: 2 });
    expect(result).toBe('aa01000000042602060533');
  });

  it('roomIds', () => {
    const roomIds = [0];
    const result = encodeRoomOrderV1({ roomIds, version: '1' });
    expect(result).toBe('aa010000000326010027');
  });

  test('rename encodeRoomOrderV1 to encodeRoomOrder0x26', () => {
    expect(encodeRoomOrder0x26).toBe(encodeRoomOrderV1);
  });
});

describe('decodeRoomOrderV1', () => {
  it('should decode valid room order commands', () => {
    const command = 'aa01000000042702060534';
    const result = decodeRoomOrderV1({ command });
    expect(result).toEqual([6, 5]);
  });

  it('should return null for invalid room order commands', () => {
    const command = '0102030405';
    const result = decodeRoomOrderV1({ command });
    expect(result).toBeNull();
  });

  test('rename decodeRoomOrder0x27 to decodeRoomOrderV1', () => {
    expect(decodeRoomOrder0x27).toBe(decodeRoomOrderV1);
  });
});
