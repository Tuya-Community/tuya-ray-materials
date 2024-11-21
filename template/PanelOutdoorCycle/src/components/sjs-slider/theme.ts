import { getThemeType } from '@ray-js/components-ty-config-provider/lib/getThemeType';

const slider = {
  light: {
    maxTrackColor: '#d8d8d8',
    minTrackColor: '#158CFB',
    thumbColor: '#ffffff',
    maxTrackTickColor: '#158CFB',
    minTrackTickColor: '#ffffff',
  },
  dark: {
    maxTrackColor: '#d8d8d8',
    minTrackColor: '#158CFB',
    thumbColor: '#ffffff',
    maxTrackTickColor: '#158CFB',
    minTrackTickColor: '#ffffff',
  },
};

export const defaultTheme = {
  type: getThemeType(),
  slider,
};
