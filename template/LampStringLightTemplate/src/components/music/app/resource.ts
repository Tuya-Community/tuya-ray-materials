import Strings from '@/i18n';
import res from '@/res/music';

export const defaultAppMusicList = [
  {
    id: 0,
    mode: 1,
    icon: res.app_music_1,
  },
  // {
  //  id: 1,
  //  mode: 0,
  // },
  {
    id: 2,
    mode: 0,
    icon: res.app_music_2,
    colorArea: [
      {
        area: [0, 2],
        hue: 350,
        saturation: 400,
        value: 1000,
      },
      {
        area: [3, 5],
        hue: 50,
        saturation: 600,
        value: 1000,
      },
      {
        area: [6, 9],
        hue: 160,
        saturation: 600,
        value: 1000,
      },
    ],
  },
  {
    id: 3,
    mode: 1,
    icon: res.app_music_3,
    colorArea: [
      {
        area: [0, 2],
        hue: 20,
        saturation: 100,
        value: 1000,
      },
      {
        area: [3, 4],
        hue: 0,
        saturation: 1000,
        value: 1000,
      },
      {
        area: [5, 6],
        hue: 350,
        saturation: 400,
        value: 1000,
      },
      {
        area: [7, 9],
        hue: 300,
        saturation: 1000,
        value: 1000,
      },
    ],
  },
];
