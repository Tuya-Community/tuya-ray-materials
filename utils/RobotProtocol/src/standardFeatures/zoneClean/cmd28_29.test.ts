import { decodeZoneClean0x29, encodeZoneClean0x28, requestZoneClean0x29 } from './cmd28_29';

describe('requestZoneClean0x29', () => {
  test('basic usage', () => {
    expect(requestZoneClean0x29()).toBe('aa01000000012929');
  });
});

describe('encodeZoneClean0x28', () => {
  test('basic usage', () => {
    expect(
      encodeZoneClean0x28({
        zones: [
          {
            name: '',
            points: [
              { x: 115.89999389648438, y: 74 },
              { x: 135.89999389648438, y: 74 },
              { x: 135.89999389648438, y: 94 },
              { x: 115.89999389648438, y: 94 },
            ],
          },
          {
            name: '',
            points: [
              { x: 81.35020299268939, y: 67.63346764454835 },
              { x: 101.35020299268939, y: 67.63346764454835 },
              { x: 101.35020299268939, y: 87.63346764454835 },
              { x: 81.35020299268939, y: 87.63346764454835 },
            ],
          },
        ],
        origin: { x: 106.9, y: 78 },
        cleanTimes: 1,
        version: '0',
      })
    ).toBe('aa002528010204005a0028012200280122ff5f005aff5f04ff000068ffc80068ffc8ff9fff00ff9fd1');
  });

  test('if version=1', () => {
    expect(
      encodeZoneClean0x28({
        cleanTimes: 1,
        zones: [
          {
            points: [
              {
                x: 109.61550903320312,
                y: 124.64710235595703,
              },
              {
                x: 152.38449096679688,
                y: 124.64710235595703,
              },
              {
                x: 152.38449096679688,
                y: 153.35289764404297,
              },
              {
                x: 109.61550903320312,
                y: 153.35289764404297,
              },
            ],
          },
        ],
        origin: {
          x: 94.8,
          y: 26.9,
        },
      })
    ).toBe('aa0100000014280101040094fc2e0240fc2e0240fb0e0094fb0e40');
  });
});

describe('decodeZoneClean0x29', () => {
  test('basic usage', () => {
    expect(
      decodeZoneClean0x29({
        command:
          'aa002529010204005a0028012200280122ff5f005aff5f04ff000068ffc80068ffc8ff9fff00ff9fd2',
        version: '0',
      })
    ).toEqual({
      zones: [
        {
          points: [
            { x: 9, y: -4 },
            { x: 29, y: -4 },
            { x: 29, y: 16 },
            { x: 9, y: 16 },
          ],
        },
        {
          points: [
            { x: -25.5, y: -10.4 },
            { x: -5.5, y: -10.4 },
            { x: -5.5, y: 9.6 },
            { x: -25.5, y: 9.6 },
          ],
        },
      ],
      cleanTimes: 1,
    });
  });

  test('if version=1', () => {
    expect(
      decodeZoneClean0x29({
        command: 'aa0100000014290101040094fc2e0240fc2e0240fb0e0094fb0e41',
      })
    ).toEqual({
      cleanTimes: 1,
      zones: [
        {
          points: [
            {
              x: 14.8,
              y: 97.7,
            },
            {
              x: 57.6,
              y: 97.7,
            },
            {
              x: 57.6,
              y: 126.5,
            },
            {
              x: 14.8,
              y: 126.5,
            },
          ],
        },
      ],
    });
  });
});
