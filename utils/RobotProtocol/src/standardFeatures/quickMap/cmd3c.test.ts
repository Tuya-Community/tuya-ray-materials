import { encodeQuickMapV1, encodeQuickMap0x3c } from './cmd3c';

describe('encodeQuickMapV1', () => {
  test('if run function with param version=0', () => {
    expect(encodeQuickMapV1({ version: '0' })).toBe('aa00023c013d');
  });

  test('if run function with param version=1', () => {
    expect(encodeQuickMapV1({ version: '1' })).toBe('aa01000000023c013d');
  });

  test('if run function with param version=', () => {
    expect(encodeQuickMapV1()).toBe('aa01000000023c013d');
  });

  test('rename  encodeQuickMap0x3c to encodeQuickMapV1', () => {
    expect(encodeQuickMap0x3c).toBe(encodeQuickMapV1);
  });
});
