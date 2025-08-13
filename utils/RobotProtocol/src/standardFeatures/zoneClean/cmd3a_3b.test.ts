import { requestZoneCleanV2, encodeZoneCleanV2, decodeZoneCleanV2 } from './cmd3a_3b';

describe('requestZoneCleanV2', () => {
  test('basic usage', () => {
    expect(requestZoneCleanV2()).toBe('aa01000000013b3b');
  });
});

describe('encodeZoneCleanV2 Protocol version=1', () => {
  test('basic usage', () => {
    expect(
      encodeZoneCleanV2({
        protocolVersion: 1,
        cleanTimes: 1,
        zones: [
          {
            name: '',
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
    ).toBe(
      'aa01000000293a010101040094fc2e0240fc2e0240fb0e0094fb0e000000000000000000000000000000000000000053'
    );
  });
});

describe('encodeZoneCleanV2 Protocol version=2', () => {
  test('basic usage', () => {
    expect(
      encodeZoneCleanV2({
        protocolVersion: 2,
        cleanMode: 0,
        suction: 1,
        cistern: 1,
        cleanTimes: 1,
        zones: [
          {
            name: '',
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
    ).toBe(
      'aa010000002c3a020001010101040094fc2e0240fc2e0240fb0e0094fb0e000000000000000000000000000000000000000056'
    );
  });
});

describe('encodeZoneCleanV2 Protocol version=3', () => {
  test('basic usage', () => {
    expect(
      encodeZoneCleanV2({
        protocolVersion: 3,
        zones: [
          {
            advanced: {
              order: 0,
              id: 0,
              localSave: 0,
              cleanMode: 0,
              suction: 1,
              cistern: 1,
              cleanTimes: 1,
            },
            name: '',
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
    ).toBe(
      'aa01000000353a0301000000040094fc2e0240fc2e0240fb0e0094fb0e01000001010000000000000000000000000000000000000000000000000057'
    );
  });
});

describe('decodeZoneCleanV2 Protocol version=1', () => {
  test('basic usage', () => {
    expect(
      decodeZoneCleanV2({
        command:
          'aa01000000293b010101040094fc2e0240fc2e0240fb0e0094fb0e000000000000000000000000000000000000000054',
      })
    ).toEqual({
      protocolVersion: 1,
      cleanTimes: 1,
      zones: [
        {
          name: '',
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

describe('decodeZoneCleanV2 Protocol version=2', () => {
  test('basic usage', () => {
    expect(
      decodeZoneCleanV2({
        command:
          'aa010000002c3b020001010101040094fc2e0240fc2e0240fb0e0094fb0e000000000000000000000000000000000000000057',
      })
    ).toEqual({
      protocolVersion: 2,
      cistern: 1,
      cleanMode: 0,
      suction: 1,
      cleanTimes: 1,
      zones: [
        {
          name: '',
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

describe('decodeZoneCleanV2 Protocol version=3', () => {
  test('basic usage', () => {
    expect(
      decodeZoneCleanV2({
        command:
          'aa01000000353b0301000000040094fc2e0240fc2e0240fb0e0094fb0e01000001010000000000000000000000000000000000000000000000000058',
      })
    ).toEqual({
      protocolVersion: 3,
      zones: [
        {
          advanced: {
            cistern: 1,
            cleanMode: 0,
            cleanTimes: 1,
            id: 0,
            localSave: 0,
            order: 0,
            suction: 1,
          },
          name: '',
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
