import { GlobalConfig } from '@ray-js/types'

export const tuya = {
  themeLocation: 'theme.json',
  window: {
    backgroundColor: '@bgColor',
    navigationBarTitleText: 'Ray Template',
    navigationBarBackgroundColor: '@navBgColor',
    navigationBarTextStyle: '@navTxtStyle',
    backgroundColorTop: '@bgColorTop',
    backgroundColorBottom: '@bgColorBottom',
  },
  tabBar: {
    color: '@tabFontColor',
    selectedColor: '@tabSelectedColor',
    backgroundColor: '@tabBgColor',
  },
}

const globalConfig: GlobalConfig = {
  basename: '',
}

export default globalConfig
