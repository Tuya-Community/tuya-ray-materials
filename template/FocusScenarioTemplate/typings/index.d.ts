import type StringsJson from '../src/I18n/strings.json'

declare module '*.png'

declare module '*.module.less' {
  const classes: {
    readonly [key: string]: string
  }
  export default classes
  declare module '*.less'
}

/** I18n 文案 key，从 strings.json 自动推导 */
export type I18nKey = keyof StringsJson['en']

declare global {
  interface Window {
    devToolsExtension?: () => any
    __DEV__: boolean
  }
  /** 全局 I18n，文案 key 受 I18nKey 约束 */
  var I18n: {
    t(key: I18nKey): string
  }
}

type DpValue = boolean | number | string
interface DpState {
  switch?: boolean
  [dpCode: string]: DpValue
}

/// 一些 TTT 通用工具泛型 ///
type GetTTTAllParams<Fn> = Parameters<Fn>['0']
type GetTTTParams<Fn> = Omit<GetTTTAllParams<Fn>, 'complete' | 'success' | 'fail'>
type GetTTTCompleteData<Fn> = Parameters<GetTTTAllParams<Fn>['complete']>['0']
type GetTTTSuccessData<Fn> = Parameters<GetTTTAllParams<Fn>['success']>['0']
type GetTTTFailData<Fn> = Parameters<GetTTTAllParams<Fn>['fail']>['0']
///                   ///

/**
 * TTT 方法统一错误码
 */
type TTTCommonErrorCode = GetTTTFailData<typeof ty.device.getDeviceInfo>

/**
 * 设备信息
 */
type DevInfo = ty.device.DeviceInfo & { state: DpState }

/**
 * 设备物模型信息
 */
type ThingModelInfo = GetTTTSuccessData<typeof ty.device.getDeviceThingModelInfo>
