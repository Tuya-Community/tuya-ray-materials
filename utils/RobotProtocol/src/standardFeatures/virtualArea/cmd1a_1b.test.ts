import { decodeVirtualArea0x1b, encodeVirtualArea0x1a, requestVirtualArea0x1b } from './cmd1a_1b';

describe('requestVirtualArea0x1b', () => {
  test('if run function with param version=0', () => {
    expect(requestVirtualArea0x1b({ version: '0' })).toBe('aa00011b1b');
  });

  test('if run function with param version=1', () => {
    expect(requestVirtualArea0x1b({ version: '1' })).toBe('aa01000000011b1b');
  });

  test('if run function with param version=', () => {
    expect(requestVirtualArea0x1b()).toBe('aa01000000011b1b');
  });
});

describe('encodeVirtualArea0x1a', () => {
  test('basic usage', () => {
    expect(
      encodeVirtualArea0x1a({
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
    ).toBe('aa01000000141a010004fdc5fe1ffe8dfe1ffe8dfd57fdc5fd579b');
  });
});

describe('decodeVirtualArea0x1b', () => {
  test('basic usage', () => {
    expect(
      decodeVirtualArea0x1b({
        command: 'aa01000000141b010104fdc5fe1ffe8dfe1ffe8dfd57fdc5fd579c',
      })
    ).toEqual([
      {
        mode: 1,
        points: [
          { x: -57, y: 48 },
          { x: -37, y: 48 },
          { x: -37, y: 68 },
          { x: -57, y: 68 },
        ],
      },
    ]);
  });
});
