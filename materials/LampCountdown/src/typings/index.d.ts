declare module '*.less';
declare global {
  interface Window {
    devToolsExtension?: () => any;
    ty: Ty;
  }
}
declare enum EnumShowType {
  countdown = 1, // 倒计时
  custom = 2, // 自定义模式
  timing = 3, // 定时
  all = 4, // 定时 + 倒计时
  customAll = 5, // 定时 + 自定义模式
  customCountdown = 6, // 倒计时 + 自定义模式
}
interface Ty {
  [key]: any;
}

declare const ty: Ty;
