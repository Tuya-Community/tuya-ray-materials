import { getCmdStrFromStandardFeatureCommand } from './command';

describe('command utils', () => {
  test('getCmdStrFromStandardFeatureCommand aa version 0', () => {
    expect(getCmdStrFromStandardFeatureCommand('aa000615010304050324', '0')).toBe('15');
  });

  test('getCmdStrFromStandardFeatureCommand aa version 1', () => {
    expect(getCmdStrFromStandardFeatureCommand('aa0100000005170176fff481', '1')).toBe('17');
  });

  test('getCmdStrFromStandardFeatureCommand ab', () => {
    expect(getCmdStrFromStandardFeatureCommand('ab00000000022f012e', '0')).toBe('2f');
  });
});
