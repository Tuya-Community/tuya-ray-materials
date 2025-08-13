import { encodeResetMap0x42, encodeResetMapV1 } from './cmd42_43';

describe('encodeResetMapV1', () => {
  test('if run function with param version=0', () => {
    expect(encodeResetMapV1({ version: '0' })).toBe('aa0002420143');
  });

  test('if run function with param version=1', () => {
    expect(encodeResetMapV1({ version: '1' })).toBe('aa0100000002420143');
  });

  test('if run function with param version=', () => {
    expect(encodeResetMapV1()).toBe('aa0100000002420143');
  });

  test('rename encodeResetMapV1 to encodeResetMap0x42', () => {
    expect(encodeResetMapV1).toBe(encodeResetMap0x42);
  });
});
