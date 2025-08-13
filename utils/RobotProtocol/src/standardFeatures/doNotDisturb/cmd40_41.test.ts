import {
  decodeDoNotDisturbV2,
  encodeDoNotDisturbV2,
  encodeDoNotDisturb0x40,
  decodeDoNotDisturb0x41,
} from './cmd40_41';

describe('encodeDoNotDisturbV2', () => {
  test('basic usage', () => {
    expect(
      encodeDoNotDisturbV2({
        enable: true,
        startHour: 21,
        startMinute: 0,
        endHour: 8,
        endMinute: 0,
      })
    ).toBe('aa010000000a4001010815000008000168');
  });

  test('if minus timezone', () => {
    expect(
      encodeDoNotDisturbV2({
        enable: true,
        startHour: 21,
        startMinute: 30,
        endHour: 8,
        endMinute: 0,
        timeZone: -8,
      })
    ).toBe('aa010000000a400101f8151e0008000176');
  });

  test('rename  encodeDoNotDisturbV2 to encodeDoNotDisturb0x14', () => {
    expect(encodeDoNotDisturb0x40).toBe(encodeDoNotDisturbV2);
  });
});

describe('decodeDoNotDisturbV2', () => {
  test('basic usage', () => {
    expect(decodeDoNotDisturbV2({ command: 'aa010000000a4101010815000008000169' })).toEqual({
      enable: true,
      startHour: 21,
      startMinute: 0,
      endHour: 8,
      endMinute: 0,
      timeZone: 8,
    });
  });

  test('rename  decodeDoNotDisturbV2 to decodeDoNotDisturb0x15', () => {
    expect(decodeDoNotDisturbV2).toBe(decodeDoNotDisturb0x41);
  });

  test('if minus timezone', () => {
    expect(decodeDoNotDisturbV2({ command: 'aa010000000a410101f8151e0008000177' })).toEqual({
      enable: true,
      startHour: 21,
      startMinute: 30,
      endHour: 8,
      endMinute: 0,
      timeZone: -8,
    });
  });
});
