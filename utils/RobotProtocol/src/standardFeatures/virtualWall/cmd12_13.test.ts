import { decodeVirtualWall0x13, encodeVirtualWall0x12, requestVirtualWall0x13 } from './cmd12_13';

describe('requestVirtualWall0x13', () => {
  test('if run function with param version=0', () => {
    expect(requestVirtualWall0x13({ version: '0' })).toBe('aa00011313');
  });

  test('if run function with param version=1', () => {
    expect(requestVirtualWall0x13({ version: '1' })).toBe('aa01000000011313');
  });

  test('if run function with param version=', () => {
    expect(requestVirtualWall0x13()).toBe('aa01000000011313');
  });
});

describe('encodeVirtualWall0x12', () => {
  test('if run function with param version=0', () => {
    expect(
      encodeVirtualWall0x12({
        walls: [
          [
            { x: 45.3, y: 53.2 },
            {
              x: 102.43228937553467,
              y: 119.15734436272979,
            },
          ],
        ],
        origin: { x: 37.3, y: 113.2 },
        version: '0',
      })
    ).toBe('aa000a120100500258028bffc30c');
  });

  test('if run function with param version=1', () => {
    expect(
      encodeVirtualWall0x12({
        walls: [
          [
            { x: 45.3, y: 53.2 },
            {
              x: 102.43228937553467,
              y: 119.15734436272979,
            },
          ],
        ],
        origin: { x: 37.3, y: 113.2 },
        version: '1',
      })
    ).toBe('aa010000000a120100500258028bffc30c');
  });

  test('if run function with param version=', () => {
    expect(
      encodeVirtualWall0x12({
        walls: [
          [
            { x: 45.3, y: 53.2 },
            {
              x: 102.43228937553467,
              y: 119.15734436272979,
            },
          ],
        ],
        origin: { x: 37.3, y: 113.2 },
      })
    ).toBe('aa010000000a120100500258028bffc30c');
  });

  test('if set multiple walls', () => {
    expect(
      encodeVirtualWall0x12({
        walls: [
          [
            {
              x: 45.3,
              y: 53.2,
            },
            {
              x: 96.69686812659963,
              y: 81.87710624466227,
            },
          ],
          [
            {
              x: 43.3495754752479,
              y: 90.79854448655131,
            },
            {
              x: 97.6141542903283,
              y: 122.91690312209397,
            },
          ],
        ],
        origin: { x: 37.3, y: 113.2 },
      })
    ).toBe('aa010000001212020050025802520139003c00e0025bff9e62');
  });
});

describe('decodeVirtualWall0x13', () => {
  test('if run function with param version=0', () => {
    expect(
      decodeVirtualWall0x13({
        command: 'aa00121302008fff7f02e7ff7f001a03080013ff38f8',
        version: '0',
      })
    ).toEqual([
      [
        {
          x: 14.3,
          y: 12.8,
        },
        {
          x: 74.3,
          y: 12.8,
        },
      ],
      [
        {
          x: 2.6,
          y: -77.6,
        },
        {
          x: 1.9,
          y: 19.9,
        },
      ],
    ]);
  });

  test('if run function with param version=1', () => {
    expect(
      decodeVirtualWall0x13({
        command: 'aa01000000121302008fff7f02e7ff7f001a03080013ff38f8',
        version: '1',
      })
    ).toEqual([
      [
        {
          x: 14.3,
          y: 12.8,
        },
        {
          x: 74.3,
          y: 12.8,
        },
      ],
      [
        {
          x: 2.6,
          y: -77.6,
        },
        {
          x: 1.9,
          y: 19.9,
        },
      ],
    ]);
  });

  test('if run function with param version=', () => {
    expect(
      decodeVirtualWall0x13({ command: 'aa01000000121302008fff7f02e7ff7f001a03080013ff38f8' })
    ).toEqual([
      [
        {
          x: 14.3,
          y: 12.8,
        },
        {
          x: 74.3,
          y: 12.8,
        },
      ],
      [
        {
          x: 2.6,
          y: -77.6,
        },
        {
          x: 1.9,
          y: 19.9,
        },
      ],
    ]);
  });

  test('if cmd not match', () => {
    expect(
      decodeVirtualWall0x13({ command: 'aa0100000012ff02008fff7f02e7ff7f001a03080013ff38f8' })
    ).toBe(null);
  });

  test('if data length not match', () => {
    expect(decodeVirtualWall0x13({ command: 'aa01000000121302008fff7f02e7ff7f001a030800' })).toBe(
      null
    );
  });
});
