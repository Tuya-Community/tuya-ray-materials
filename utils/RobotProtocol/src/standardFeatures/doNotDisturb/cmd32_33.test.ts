import { decodeDoNotDisturb0x33, encodeDoNotDisturb0x32 } from './cmd32_33';

describe('encodeDoNotDisturb0x32', () => {
  test('basic usage', () => {
    expect(
      encodeDoNotDisturb0x32({
        startHour: 21,
        startMinute: 0,
        endHour: 8,
        endMinute: 0,
      })
    ).toBe('aa0100000008320815000008000158');
  });

  test('if minus timezone', () => {
    expect(
      encodeDoNotDisturb0x32({
        startHour: 21,
        startMinute: 30,
        endHour: 8,
        endMinute: 0,
        timeZone: -8,
      })
    ).toBe('aa010000000832f8151e0008000166');
  });
});

describe('decodeDoNotDisturb0x33', () => {
  test('basic usage', () => {
    expect(decodeDoNotDisturb0x33({ command: 'aa0100000008330815000008000159' })).toEqual({
      startHour: 21,
      startMinute: 0,
      endHour: 8,
      endMinute: 0,
      timeZone: 8,
    });
  });

  test('if minus timezone', () => {
    expect(decodeDoNotDisturb0x33({ command: 'aa010000000833f8151e0008000167' })).toEqual({
      startHour: 21,
      startMinute: 30,
      endHour: 8,
      endMinute: 0,
      timeZone: -8,
    });
  });
});
