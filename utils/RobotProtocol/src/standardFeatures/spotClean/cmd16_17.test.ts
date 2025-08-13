import { decodeSpotCleanV1, encodeSpotCleanV1, requestSpotCleanV1 } from './cmd16_17';

describe('requestSpotCleanV1', () => {
  test('basic usage', () => {
    expect(requestSpotCleanV1()).toBe('aa01000000011717');
  });
});

describe('encodeSpotCleanV2', () => {
  test('basic usage', () => {
    expect(
      encodeSpotCleanV1({
        point: {
          x: 74.72492943338318,
          y: 114.25386934391365,
        },
        origin: { x: 37.3, y: 113.2 },
      })
    ).toBe('aa0100000005160176fff480');
  });
});

describe('decodeSpotCleanV2', () => {
  test('basic usage', () => {
    expect(
      decodeSpotCleanV1({
        command: 'aa0100000005170176fff481',
      })
    ).toEqual({
      point: { x: 37.4, y: 1.1 },
    });
  });
});
