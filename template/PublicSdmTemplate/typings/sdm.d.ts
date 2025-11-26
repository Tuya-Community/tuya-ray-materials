import { GetStructuredDpState, GetStructuredActions } from '@ray-js/panel-sdk';

/**
 * 注意 defaultSchema 变量名是否和 devices/schema.ts 中的导出一致
 * Note whether the defaultSchema variable name matches the export in devices/schema.ts
 */
export type SmartDeviceSchema = typeof import('@/devices/schema').defaultSchema;
/**
 * 群组 Schema 默认使用单设备最全的功能点，若群组环境有不同的 Schema，可在 devices/schema.ts 中自定义并导出
 * Group Schema defaults to the most comprehensive features of single-device, if there are different schemas for group environments, they can be customized and exported in devices/schema.ts
 */
export type SmartGroupSchema = typeof import('@/devices/schema').defaultSchema;
type SmartDeviceProtocols = typeof import('@/devices/protocols').protocols;
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
  export function useStructuredProps(): GetStructuredDpState<SmartDeviceProtocols>;
  export function useStructuredProps<Value extends any>(
    selector: (props?: GetStructuredDpState<SmartDeviceProtocols>) => Value,
    equalityFn?: (a: Value, b: Value) => boolean
  ): Value;
  export function useDevice(): SmartDeviceInstanceData;
  export function useDevice<Device extends any>(
    selector: (device: SmartDeviceInstanceData) => Device,
    equalityFn?: (a: Device, b: Device) => boolean
  ): Device;
  export function useActions(): SmartDevices['model']['actions'];
  export function useStructuredActions(): GetStructuredActions<SmartDeviceProtocols>;
}
