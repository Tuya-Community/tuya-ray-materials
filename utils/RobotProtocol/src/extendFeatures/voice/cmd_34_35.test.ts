import { decodeVoice0x35, encodeVoice0x34 } from './cmd_34_35';

describe('encodeVoice0x34', () => {
  test('basic usage', () => {
    expect(
      encodeVoice0x34({
        id: 1,
        md5: 'dd9b1f94c9f8dafac8a9d3a4882e271a',
        url: 'https://images.tuyacn.com/smart/product/voice/1715933843969d35572d9.tar',
      })
    ).toBe(
      'ab000000007134000000012064643962316639346339663864616661633861396433613438383265323731610000004768747470733a2f2f696d616765732e74757961636e2e636f6d2f736d6172742f70726f647563742f766f6963652f3137313539333338343339363964333535373264392e746172c6'
    );
  });
});

describe('decodeVoice0x35', () => {
  test('if downloading with progress', () => {
    expect(
      decodeVoice0x35({
        command: 'ab00000000073500000001011e55',
      })
    ).toEqual({
      languageId: 1,
      progress: 30,
      status: 1,
    });
  });

  test('if using', () => {
    expect(
      decodeVoice0x35({
        command: 'ab0000000007350000000103649d',
      })
    ).toEqual({
      languageId: 1,
      progress: 100,
      status: 3,
    });
  });
});
