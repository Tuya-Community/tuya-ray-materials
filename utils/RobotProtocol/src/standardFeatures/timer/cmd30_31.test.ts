import { encodeDeviceTimer0x30, decodeDeviceTimer0x31 } from './cmd30_31';

const params = [
  {
    effectiveness: 1,
    cleanMode: 0,
    fanLevel: 0,
    waterLevel: 0,
    time: {
      hour: 10,
      minute: 35,
    },
    week: [0, 0, 0, 1, 1, 0, 0],
    sweepCount: 2,
    roomIds: [2, 1],
    roomNum: 2,
  },
];

describe('encodeDeviceTimer0x30', () => {
  test('basic usage', () => {
    expect(
      encodeDeviceTimer0x30({
        list: params,
        number: 1,
      })
    ).toBe('aa010000000e30080101180a230202010000000286');
  });
});

describe('decodeDeviceTimer0x31', () => {
  test('basic usage', () => {
    expect(
      decodeDeviceTimer0x31({ command: 'aa010000000e31080101180a230202010000000287', version: '1' })
    ).toEqual({
      number: 1,
      timeZone: 8,
      list: [
        {
          effectiveness: 1,
          week: [0, 0, 0, 1, 1, 0, 0],
          time: {
            hour: 10,
            minute: 35,
          },
          roomNum: 2,
          roomIds: [2, 1],
          cleanMode: 0,
          fanLevel: 0,
          waterLevel: 0,
          sweepCount: 2,
        },
      ],
    });
  });
});
