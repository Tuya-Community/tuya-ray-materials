import { decodeDeviceTimer0x45, encodeDeviceTimer0x44 } from './cmd44_45';

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
    mapId: 123,
  },
];

describe('encodeDeviceTimer0x44', () => {
  test('basic usage', () => {
    expect(
      encodeDeviceTimer0x44({
        list: params,
        number: 1,
      })
    ).toBe('aa01000000124401080101180a23007b020201000000000216');
  });
});

describe('decodeDeviceTimer0x45', () => {
  test('basic usage', () => {
    expect(
      decodeDeviceTimer0x45({
        command: 'aa01000000124501080101180a23007b020201000000000217',
        version: '1',
      })
    ).toEqual({
      number: 1,
      timeZone: 8,
      list: [
        {
          effectiveness: 1,
          week: [0, 0, 0, 1, 1, 0, 0],
          mapId: 123,
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
          zoneIds: [],
        },
      ],
    });
  });
});
