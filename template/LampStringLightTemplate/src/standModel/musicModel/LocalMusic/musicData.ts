import { getArray } from '@/utils/kit';
import { getIconPrefix } from './utils';
import Strings from '../../../i18n';

const originMusicData = [
  [
    //  激情
    {
      version: 1,
      power: false,
      id: 0,
      mode: 3,
      speed: 50,
      sensitivity: 50,
      settingA: 0,
      settingB: 0,
      settingC: 0,
      brightness: 50,
      colors: [
        {
          hue: 0,
          saturation: 100,
        },
        {
          hue: 120, // 0078
          saturation: 100,
        },
        {
          hue: 240, // 00f0
          saturation: 100,
        },
        {
          hue: 60, // 003c
          saturation: 100,
        },
        {
          hue: 180, // 00b4
          saturation: 100,
        },
        {
          hue: 300, // 012c
          saturation: 100,
        },
        {
          hue: 0,
          saturation: 0,
        },
      ],
    },
    // 欢快
    {
      version: 1,
      power: false,
      id: 1,
      mode: 2,
      speed: 50,
      sensitivity: 50,
      settingA: 0,
      settingB: 0,
      settingC: 0,
      brightness: 50,
      colors: [
        {
          hue: 0,
          saturation: 80,
        },
        {
          hue: 120, // 0078
          saturation: 80,
        },
        {
          hue: 240, // 00f0
          saturation: 80,
        },
        {
          hue: 60, // 003c
          saturation: 80,
        },
        {
          hue: 180, // 00b4
          saturation: 80,
        },
        {
          hue: 300, // 012c
          saturation: 80,
        },
        {
          hue: 0,
          saturation: 0,
        },
      ],
    },
    //  柔和
    {
      version: 1,
      power: false,
      id: 2,
      mode: 18,
      speed: 50,
      sensitivity: 50,
      settingA: 0,
      settingB: 0,
      settingC: 0,
      brightness: 50,
      colors: [
        {
          hue: 0,
          saturation: 100,
        },
        {
          hue: 120, // 0078
          saturation: 100,
        },
        {
          hue: 240, // 00f0
          saturation: 100,
        },
        {
          hue: 60, // 003c
          saturation: 100,
        },
        {
          hue: 180, // 00b4
          saturation: 100,
        },
        {
          hue: 300, // 012c
          saturation: 100,
        },
        {
          hue: 0,
          saturation: 0,
        },
      ],
    },
    // 轻快
    {
      version: 1,
      power: false,
      id: 3,
      mode: 0,
      speed: 50,
      sensitivity: 50,
      settingA: 0,
      settingB: 0,
      settingC: 0,
      brightness: 50,
      colors: [
        {
          hue: 0,
          saturation: 100,
        },
        {
          hue: 120, // 0078
          saturation: 100,
        },
        {
          hue: 240, // 00f0
          saturation: 100,
        },
        {
          hue: 60, // 003c
          saturation: 100,
        },
        {
          hue: 180, // 00b4
          saturation: 100,
        },
        {
          hue: 300, // 012c
          saturation: 100,
        },
      ],
    },
    // 流动
    {
      version: 1,
      power: false,
      id: 4,
      mode: 0,
      speed: 50,
      sensitivity: 50,
      settingA: 0,
      settingB: 0,
      settingC: 0,
      brightness: 50,
      colors: [
        {
          hue: 0,
          saturation: 100,
        },
        {
          hue: 120, // 0078
          saturation: 100,
        },
        {
          hue: 240, // 00f0
          saturation: 100,
        },
        {
          hue: 60, // 003c
          saturation: 100,
        },
        {
          hue: 180, // 00b4
          saturation: 100,
        },
        {
          hue: 300, // 012c
          saturation: 100,
        },
        {
          hue: 0,
          saturation: 0,
        },
      ],
    },
  ],
];
export const getMusicData = (devInfo: DevInfo) => {
  if (!devInfo) {
    return [];
  }
  const res = originMusicData.reduce((acc, cur) => {
    const prefix = getIconPrefix(devInfo);
    const _cur = cur.map(v => {
      // v.musicIconUrl = v.musicIconUrl?.replace('{0}', prefix);
      return v;
    });
    return acc.concat(..._cur);
  }, []);

  const ret = res.map(i => {
    return {
      id: i.id,
      title: Strings.getLang(`local_music_name_${i.id}` as any),
      // icon: i.musicIconUrl,
      colorArr: getArray(i.colors).map(item => ({
        ...item,
        saturation: Math.floor(item.saturation / 10),
      })),
    };
  });

  return ret;
};

export default getMusicData;
