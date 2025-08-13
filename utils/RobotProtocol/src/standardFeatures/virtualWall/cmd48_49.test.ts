import { decodeVirtualWall0x49, encodeVirtualWall0x48, requestVirtualWall0x49 } from './cmd48_49';

describe('requestVirtualWall0x49', () => {
  test('if run function with param version=0', () => {
    expect(requestVirtualWall0x49({ version: '0' })).toBe('aa00014949');
  });

  test('if run function with param version=1', () => {
    expect(requestVirtualWall0x49({ version: '1' })).toBe('aa01000000014949');
  });

  test('if run function with param version=', () => {
    expect(requestVirtualWall0x49()).toBe('aa01000000014949');
  });
});

describe('encodeVirtualWall0x48', () => {
  test('if run function with param version=0', () => {
    expect(
      encodeVirtualWall0x48({
        walls: [
          {
            mode: 0,
            points: [
              { x: 45.3, y: 53.2 },
              {
                x: 102.43228937553467,
                y: 119.15734436272979,
              },
            ],
          },
        ],
        origin: { x: 37.3, y: 113.2 },
        version: '0',
      })
    ).toBe('aa000c4801010000500258028bffc343');
  });

  test('if run function with param version=1', () => {
    expect(
      encodeVirtualWall0x48({
        walls: [
          {
            mode: 0,
            points: [
              { x: 45.3, y: 53.2 },
              {
                x: 102.43228937553467,
                y: 119.15734436272979,
              },
            ],
          },
        ],
        origin: { x: 37.3, y: 113.2 },
        version: '1',
      })
    ).toBe('aa010000000c4801010000500258028bffc343');
  });

  test('if set multiple walls', () => {
    expect(
      encodeVirtualWall0x48({
        walls: [
          {
            mode: 0,
            points: [
              { x: 45.3, y: 53.2 },
              {
                x: 102.43228937553467,
                y: 119.15734436272979,
              },
            ],
          },
          {
            mode: 1,
            points: [
              {
                x: 43.3495754752479,
                y: 90.79854448655131,
              },
              {
                x: 97.6141542903283,
                y: 122.91690312209397,
              },
            ],
          },
        ],
        origin: { x: 37.3, y: 113.2 },
      })
    ).toBe('aa01000000154801020000500258028bffc301003c00e0025bff9e5b');
  });
});

describe('decodeVirtualWall0x49 Protocol version=1', () => {
  test('basic usage', () => {
    expect(
      decodeVirtualWall0x49({
        command: 'aa01000000154901020000500258028bffc301003c00e0025bff9e5c',
      })
    ).toEqual({
      protocolVersion: 1,
      walls: [
        {
          mode: 0,
          points: [
            { x: 8, y: -60 },
            {
              x: 65.1,
              y: 6,
            },
          ],
        },
        {
          mode: 1,
          points: [
            {
              x: 6,
              y: -22.4,
            },
            {
              x: 60.3,
              y: 9.7,
            },
          ],
        },
      ],
    });
  });
});
