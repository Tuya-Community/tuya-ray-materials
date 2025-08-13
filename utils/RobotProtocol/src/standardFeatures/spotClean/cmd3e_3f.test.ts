import { decodeSpotCleanV2, encodeSpotCleanV2, requestSpotCleanV2 } from './cmd3e_3f';

describe('requestSpotCleanV2', () => {
  test('if run function with param version=0', () => {
    expect(requestSpotCleanV2({ version: '0' })).toBe('aa00013f3f');
  });

  test('if run function with param version=1', () => {
    expect(requestSpotCleanV2({ version: '1' })).toBe('aa01000000013f3f');
  });

  test('if run function with param version=', () => {
    expect(requestSpotCleanV2()).toBe('aa01000000013f3f');
  });
});

describe('encodeSpotCleanV2 Protocol version=1', () => {
  test('if run function with param version=0', () => {
    expect(
      encodeSpotCleanV2({
        protocolVersion: 1,
        points: [{ x: 75.30000114440918, y: 83.19999694824219 }],
        origin: { x: 37.3, y: 113.2 },
        cleanMode: 0,
        suction: 4,
        cistern: 1,
        cleanTimes: 2,
        version: '0',
      })
    ).toBe('aa000a3e0100040102017c012cf0');
  });

  test('if run function with param version=1', () => {
    expect(
      encodeSpotCleanV2({
        protocolVersion: 1,
        points: [{ x: 75.30000114440918, y: 83.19999694824219 }],
        origin: { x: 37.3, y: 113.2 },
        cleanMode: 0,
        suction: 4,
        cistern: 1,
        cleanTimes: 2,
        version: '1',
      })
    ).toBe('aa010000000a3e0100040102017c012cf0');
  });

  test('if run function with param version=', () => {
    expect(
      encodeSpotCleanV2({
        protocolVersion: 1,
        points: [
          {
            x: 74.72492943338318,
            y: 114.25386934391365,
          },
        ],
        origin: { x: 37.3, y: 113.2 },
        cleanMode: 0,
        suction: 4,
        cistern: 1,
        cleanTimes: 2,
      })
    ).toBe('aa010000000a3e01000401020176fff4b0');
  });
});

describe('encodeSpotCleanV2 Protocol version=2', () => {
  test('if run function with param version=1', () => {
    expect(
      encodeSpotCleanV2({
        protocolVersion: 2,
        points: [
          { x: 75.30000114440918, y: 83.19999694824219 },
          {
            x: 74.72492943338318,
            y: 114.25386934391365,
          },
        ],
        origin: { x: 37.3, y: 113.2 },
      })
    ).toBe('aa010000000b3e0202017c012c0176fff456');
  });
});

describe('decodeSpotCleanV2 Protocol version=1', () => {
  test('basic usage', () => {
    expect(
      decodeSpotCleanV2({
        command: 'aa010000000a3f01000401020176fff4b1',
      })
    ).toEqual({
      protocolVersion: 1,
      points: [{ x: 37.4, y: 1.1 }],
      cleanMode: 0,
      suction: 4,
      cistern: 1,
      cleanTimes: 2,
    });
  });
});

describe('decodeSpotCleanV2 Protocol version=2', () => {
  test('basic usage', () => {
    expect(
      decodeSpotCleanV2({
        command: 'aa010000000b3f0202017c012c0176fff457',
      })
    ).toEqual({
      protocolVersion: 2,
      points: [
        { x: 38, y: -30 },
        { x: 37.4, y: 1.1 },
      ],
    });
  });
});
