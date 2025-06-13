let themeInfo = null;
export function getThemeInfo() {
  if (!themeInfo) {
    // @ts-ignore
    themeInfo = ty.getThemeInfo();
  }
  return themeInfo;
}
