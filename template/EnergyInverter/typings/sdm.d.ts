import '@ray-js/panel-sdk';
import { GetStructuredDpState, GetStructuredActions } from '@ray-js/panel-sdk';

declare module '*.png';

declare module '*.module.less' {
  const classes: {
    readonly [key: string]: string;
  };
  export default classes;
  declare module '*.less';
}

declare global {
  interface Window {
    devToolsExtension?: () => any;
    __DEV__: boolean;
  }
}

type DpValue = boolean | number | string;
interface DpState {
  switch?: boolean;
  [dpCode: string]: DpValue;
}

/// 一些 TTT 通用工具泛型 ///
type GetTTTAllParams<Fn> = Parameters<Fn>['0'];
type GetTTTParams<Fn> = Omit<GetTTTAllParams<Fn>, 'complete' | 'success' | 'fail'>;
type GetTTTCompleteData<Fn> = Parameters<GetTTTAllParams<Fn>['complete']>['0'];
type GetTTTSuccessData<Fn> = Parameters<GetTTTAllParams<Fn>['success']>['0'];
type GetTTTFailData<Fn> = Parameters<GetTTTAllParams<Fn>['fail']>['0'];
///                   ///

/**
 * TTT 方法统一错误码
 */
type TTTCommonErrorCode = GetTTTFailData<typeof ty.device.getDeviceInfo>;

/**
 * 设备信息
 */
type DevInfo = ty.device.DeviceInfo & { state: DpState };

/**
 * 设备物模型信息
 */
type ThingModelInfo = GetTTTSuccessData<typeof ty.device.getDeviceThingModelInfo>;

type SmartDeviceSchema = typeof import('@/devices/schema').defaultSchema; // 注意变量名
type SmartDevices = import('@ray-js/panel-sdk').SmartDeviceModel<SmartDeviceSchema>;

declare module '@ray-js/panel-sdk' {
  export const SdmProvider: React.FC<{
    value: SmartDeviceModel<SmartDeviceSchema>;
    children: React.ReactNode;
  }>;
  export type SmartDeviceInstanceData = {
    devInfo: ReturnType<SmartDevices['getDevInfo']>;
    dpSchema: ReturnType<SmartDevices['getDpSchema']>;
    network: ReturnType<SmartDevices['getNetwork']>;
    bluetooth: ReturnType<SmartDevices['getBluetooth']>;
  };
  export function useProps(): SmartDevices['model']['props'];
  export function useProps<Value extends any>(
    selector: (props?: SmartDevices['model']['props']) => Value,
    equalityFn?: (a: Value, b: Value) => boolean
  ): Value;
  export function useDevice(): SmartDeviceInstanceData;
  export function useDevice<Device extends any>(
    selector: (device: SmartDeviceInstanceData) => Device,
    equalityFn?: (a: Device, b: Device) => boolean
  ): Device;
}
