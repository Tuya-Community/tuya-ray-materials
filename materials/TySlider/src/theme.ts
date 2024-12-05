import { getThemeType } from '@ray-js/components-ty-config-provider/lib/getThemeType';

const slider = {
  light: {},
  dark: {},
};

export const defaultTheme = {
  type: getThemeType(),
  slider,
};
