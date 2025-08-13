import { decodeAIObject0x37, requestAIObject0x37 } from './cmd36_37';

describe('requestAIObject0x37', () => {
  test('if run function with param version=1', () => {
    expect(requestAIObject0x37({ version: '1' })).toBe('aa01000000013737');
  });
});

describe('decodeAIObject0x37', () => {
  test('if run function with param version=0', () => {
    expect(
      decodeAIObject0x37({
        command: 'aa00073701003bff4400b6',
        version: '0',
      })
    ).toEqual([
      {
        point: {
          x: 5.9,
          y: 18.7,
        },
        type: 0,
      },
    ]);
  });
});
