import Strings from '@/i18n';
import { getIconPrefix } from './utils';
import { getArray } from '@/utils/kit';

const originMusicData = [
  [
    {
      gmtCreate: 1716894600534,
      gmtModified: 1717064032399,
      id: 20901112,
      libraryId: 39700112,
      musicIconDisplaySize: '84*84',
      musicIconDisplayType: 4,
      musicIconUrl: '{0}/smart/linkage/light/scene/icon17170637118d40cfb8fc6.png',
      name: 'Music',
      nameRosettaKey: 'light_music_10',
      param: {
        brightnessRhythmStyle: 1,
        changeIntensity: 2,
        changeStyle: 0,
        colorData: '0000000003e803e80000',
        colorRhythmStyle: 1,
        constantLight: 0,
        decibelDiff: 0,
        dpCode: 'music_data',
        dpId: 27,
        id: 19701112,
        issueInterval: 300,
        lightNums: [3, 4, 5, 6, 7],
        maxBrightness: 100,
        maxDecibel: 0,
        minBrightness: 0,
        minDecibel: 0,
        timeInterval: 0,
        toneDiff: 2,
      },
      plateId: 57700512,
      plateName: 'APP Music',
      plateRosettaKey: 'light_music_plate_lang_2',
      sortInPlate: 10,
      dpCode: 'music_data',
      dpId: 27,
      brightness: 1000,
      musicId: 19701112,
      colorList: [
        {
          hue: 0,
          saturation: 0,
          value: 1000,
          brightness: 1000,
          temperature: 0,
          hex: '#FFFFFF',
        },
      ],
      checked: true,
    },
    {
      gmtCreate: 1716894600534,
      gmtModified: 1717064040974,
      id: 20900912,
      libraryId: 39700112,
      musicIconDisplaySize: '84*84',
      musicIconDisplayType: 4,
      musicIconUrl: '{0}/smart/linkage/light/scene/icon1717063968c255f47dd7c.png',
      name: 'Romantic',
      nameRosettaKey: 'light_music_11',
      param: {
        brightnessRhythmStyle: 1,
        changeIntensity: 2,
        changeStyle: 0,
        colorData:
          '0013006403e803e80000,000003e803e803e80000,015e019003e803e80000,012c03e803e803e80000',
        colorRhythmStyle: 1,
        constantLight: 0,
        decibelDiff: 0,
        dpCode: 'music_data',
        dpId: 27,
        id: 19700912,
        issueInterval: 300,
        lightNums: [3, 4, 5, 6, 7],
        maxBrightness: 100,
        maxDecibel: 0,
        minBrightness: 1,
        minDecibel: 0,
        timeInterval: 0,
        toneDiff: 1,
      },
      plateId: 57700512,
      plateName: 'APP Music',
      plateRosettaKey: 'light_music_plate_lang_2',
      sortInPlate: 11,
      dpCode: 'music_data',
      dpId: 27,
      brightness: 1000,
      musicId: 19700912,
      colorList: [
        {
          hue: 19,
          saturation: 100,
          value: 1000,
          brightness: 1000,
          temperature: 0,
          hex: '#FFEEE6',
        },
        {
          hue: 0,
          saturation: 1000,
          value: 1000,
          brightness: 1000,
          temperature: 0,
          hex: '#FF0000',
        },
        {
          hue: 350,
          saturation: 400,
          value: 1000,
          brightness: 1000,
          temperature: 0,
          hex: '#FF99AA',
        },
        {
          hue: 300,
          saturation: 1000,
          value: 1000,
          brightness: 1000,
          temperature: 0,
          hex: '#FF00FF',
        },
      ],
      checked: true,
    },
    {
      gmtCreate: 1716894600534,
      gmtModified: 1717063864260,
      id: 20901012,
      libraryId: 39700112,
      musicIconDisplaySize: '84*84',
      musicIconDisplayType: 4,
      musicIconUrl: '{0}/smart/linkage/light/scene/icon1716874330239b52f4285.png',
      name: 'Game',
      nameRosettaKey: 'light_music_12',
      param: {
        brightnessRhythmStyle: 1,
        changeIntensity: 2,
        changeStyle: 0,
        colorData: '015e019003e803e80000,0032025803e803e80000,00a0025803e803e80000',
        colorRhythmStyle: 1,
        constantLight: 0,
        decibelDiff: 0,
        dpCode: 'music_data',
        dpId: 27,
        id: 19701012,
        issueInterval: 300,
        lightNums: [3, 4, 5, 6, 7],
        maxBrightness: 100,
        maxDecibel: 0,
        minBrightness: 1,
        minDecibel: 0,
        timeInterval: 0,
        toneDiff: 2,
      },
      plateId: 57700512,
      plateName: 'APP Music',
      plateRosettaKey: 'light_music_plate_lang_2',
      sortInPlate: 12,
      dpCode: 'music_data',
      dpId: 27,
      brightness: 1000,
      musicId: 19701012,
      colorList: [
        {
          hue: 350,
          saturation: 400,
          value: 1000,
          brightness: 1000,
          temperature: 0,
          hex: '#FF99AA',
        },
        {
          hue: 50,
          saturation: 600,
          value: 1000,
          brightness: 1000,
          temperature: 0,
          hex: '#FFE666',
        },
        {
          hue: 160,
          saturation: 600,
          value: 1000,
          brightness: 1000,
          temperature: 0,
          hex: '#66FFCC',
        },
      ],
      checked: true,
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
      v.musicIconUrl = v.musicIconUrl?.replace('{0}', prefix);
      return v;
    });
    return acc.concat(..._cur);
  }, []);

  return res.map(i => {
    return {
      id: i.musicId,
      title: Strings.getLang(i.nameRosettaKey as any),
      icon: i.musicIconUrl,
      colorArr: getArray(i.colorList).map(item => ({
        ...item,
        saturation: Math.floor(item.saturation),
        value: Math.floor(item.value),
      })),
    };
  });
};

export default getMusicData;
