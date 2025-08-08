import { themeColors as defaultThemeColors } from './themeColor';
export const getColors = (themeColors) => Array.isArray(themeColors) ? themeColors : defaultThemeColors;
