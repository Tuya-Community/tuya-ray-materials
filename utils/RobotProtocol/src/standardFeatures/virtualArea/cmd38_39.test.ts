import { decodeVirtualAreaV2, encodeVirtualAreaV2, requestVirtualAreaV2 } from './cmd38_39';

describe('requestVirtualAreaV2', () => {
  test('if run function with param version=0', () => {
    expect(requestVirtualAreaV2({ version: '0' })).toBe('aa00013939');
  });

  test('if run function with param version=1', () => {
    expect(requestVirtualAreaV2({ version: '1' })).toBe('aa01000000013939');
  });

  test('if run function with param version=', () => {
    expect(requestVirtualAreaV2()).toBe('aa01000000013939');
  });
});

describe('encodeVirtualAreaV2 Protocol version=1', () => {
  test('basic usage', () => {
    expect(
      encodeVirtualAreaV2({
        protocolVersion: 1,
        virtualAreas: [
          {
            mode: 0,
            name: '',
            points: [
              {
                x: 121.5,
                y: 129.6999969482422,
              },
              {
                x: 141.5,
                y: 129.6999969482422,
              },
              {
                x: 141.5,
                y: 149.6999969482422,
              },
              {
                x: 121.5,
                y: 149.6999969482422,
              },
            ],
          },
        ],
        origin: { x: 178.5, y: 81.7 },
      })
    ).toBe(
      'aa01000000293801010004fdc5fe1ffe8dfe1ffe8dfd57fdc5fd570000000000000000000000000000000000000000ba'
    );
  });
});

describe('encodeVirtualAreaV2 Protocol version=2', () => {
  test('if run function with param version=1', () => {
    expect(
      encodeVirtualAreaV2({
        protocolVersion: 2,
        virtualAreas: [
          {
            mode: 0,
            name: '',
            points: [
              {
                x: 121.5,
                y: 129.6999969482422,
              },
              {
                x: 141.5,
                y: 129.6999969482422,
              },
              {
                x: 141.5,
                y: 149.6999969482422,
              },
              {
                x: 121.5,
                y: 149.6999969482422,
              },
            ],
          },
        ],
        origin: { x: 178.5, y: 81.7 },
      })
    ).toBe(
      'aa010000002a380201000004fdc5fe1ffe8dfe1ffe8dfd57fdc5fd570000000000000000000000000000000000000000bb'
    );
  });
});

describe('decodeVirtualAreaV2 Protocol version=1', () => {
  test('basic usage', () => {
    expect(
      decodeVirtualAreaV2({
        command:
          'aa01000000293901010004fdc5fe1ffe8dfe1ffe8dfd57fdc5fd570000000000000000000000000000000000000000bb',
      })
    ).toEqual({
      protocolVersion: 1,
      virtualAreas: [
        {
          mode: 0,
          points: [
            { x: -57, y: 48 },
            { x: -37, y: 48 },
            { x: -37, y: 68 },
            { x: -57, y: 68 },
          ],
          name: '',
        },
      ],
    });
  });
});

describe('decodeVirtualAreaV2 Protocol version=2', () => {
  test('basic usage', () => {
    expect(
      decodeVirtualAreaV2({
        command:
          'aa010000002a390201000004fdc5fe1ffe8dfe1ffe8dfd57fdc5fd570000000000000000000000000000000000000000bc',
      })
    ).toEqual({
      protocolVersion: 2,
      virtualAreas: [
        {
          mode: 0,
          points: [
            { x: -57, y: 48 },
            { x: -37, y: 48 },
            { x: -37, y: 68 },
            { x: -57, y: 68 },
          ],
          name: '',
        },
      ],
    });
  });
});
