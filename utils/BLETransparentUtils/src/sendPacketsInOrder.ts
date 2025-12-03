import {
  onDpDataChange,
  offDpDataChange,
  onBLETransparentDataReport,
  offBLETransparentDataReport,
} from '@ray-js/ray';
import { publishBLETransparentDataAsync } from './nativeApi';
import { parseReportData as parseReportDataDefault } from './common';
import { isUndefined, isFunction } from './utils';
import { info, error } from './logger';
import { ISendPacketsOptions, IProgress } from './types';

/**
 * 发送分包数据，按顺序发送
 * @param deviceId 设备 ID
 * @param packets 分包数据
 * @param dpValue dp 数据值, 可选, 需要先发 dp 再发分包数据时必须传入
 * @param dpId dp 数据 ID, 可选, 需要先发 dp 再发分包数据时必须传入
 * @param timeout 超时时间，默认为 500ms, 可选
 * @param maxRetries 最大重试次数，默认为 5, 可选
 * @param sendDp 发送 dp 数据的函数, 可选, 需要先发 dp 再发分包数据时必须传入
 * @param parseReportData 解析设备回复数据中的包号的函数, 可选
 * @param onProgress 进度回调, 可选
 * @returns Promise<boolean> 是否发送成功
 */
export const sendPacketsInOrder = async ({
  deviceId,
  packets,
  dpValue,
  dpId,
  timeout = 500,
  maxRetries = 5,
  sendDp,
  parseReportData = parseReportDataDefault,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onProgress = (data: IProgress) => {},
}: ISendPacketsOptions): Promise<boolean> => {
  let dpSuccess = false;
  // dp数据变化回调
  const dpChangeCallBack = res => {
    info(`onDpDataChange callback, res: ${res}`);
    const result = Object.entries(res.dps).some(
      ([key, value]) => Number(key) === dpId && value === dpValue
    );
    dpSuccess = result;
  };
  let receivedPacketIndex = -1; // 当前接收的包号
  // BLE(thing)设备数据透传通道上报通知回调
  const bleCallback = res => {
    info(`onBLETransparentDataReport callback, res: ${res}`);
    receivedPacketIndex = parseReportData(res); // 解析包号
  };

  try {
    if (!(!isFunction(sendDp) || isUndefined(dpValue) || isUndefined(dpId))) {
      // 监听dp数据变化
      onDpDataChange(dpChangeCallBack);
      // 发送dp数据
      sendDp();

      const waitDpSuccess = (): Promise<boolean> => {
        return new Promise<boolean>(resolve => {
          const startTime = Date.now();

          const interval = setInterval(() => {
            if (dpSuccess) {
              clearInterval(interval);
              resolve(true); // 收到确认
            }

            if (Date.now() - startTime > 60000) {
              clearInterval(interval);
              resolve(false); // 超时
            }
          }, 10); // 每 10 毫秒检查一次
        });
      };

      const isDpSuccess = await waitDpSuccess();

      offDpDataChange(dpChangeCallBack);

      if (!isDpSuccess) {
        error('onDpDataChange timeout');
        throw new Error(`onDpDataChange timeout`);
      }
    }

    const startTimeAll = Date.now();

    const packetStatus = packets.map(() => ({
      confirmed: false, // 是否已确认
      retries: 0, // 重试次数
    }));

    const waitForConfirmation = (expectedIndex: number): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        const startTime = Date.now();

        const interval = setInterval(() => {
          if (receivedPacketIndex === expectedIndex) {
            clearInterval(interval);
            resolve(true); // 收到确认
          }

          if (Date.now() - startTime > timeout) {
            clearInterval(interval);
            resolve(false); // 超时
          }
        }, 10); // 每 10 毫秒检查一次
      });
    };

    // 监听BLE(thing)设备数据透传通道上报通知
    onBLETransparentDataReport(bleCallback);
    info(`Starting to send packets. Total packet: ${packets.length}`);

    for (let index = 0; index < packets.length; index++) {
      let isConfirmed = false;

      while (packetStatus[index].retries <= maxRetries && !isConfirmed) {
        const currentTime = Date.now() - startTimeAll;
        info(
          `Total packet: ${packets.length}, current packet ${index}, attempt ${packetStatus[index].retries}, send time at: ${currentTime}`
        );

        await publishBLETransparentDataAsync({ deviceId, data: packets[index] });

        // 等待确认
        isConfirmed = await waitForConfirmation(index);

        if (isConfirmed) {
          info(`Packet ${index} confirmed, when attempt ${packetStatus[index].retries}`);
          packetStatus[index].confirmed = true;
          onProgress({ index, total: packets.length, type: 'normal' }); // 进度回调
        } else {
          info(`Packet ${index} timeout, when attempt ${packetStatus[index].retries}`);
          packetStatus[index].retries += 1;

          if (packetStatus[index].retries > maxRetries) {
            error(`Packet ${index} failed after ${maxRetries} attempts.`);
            throw new Error(`Packet ${index} failed`);
          }
        }
      }
    }

    const endTimeAll = Date.now();
    const duration = endTimeAll - startTimeAll;
    info(`All packets sent successfully. Total: ${packets.length}, time: ${duration}ms`);
    // 取消监听BLE(thing)设备数据透传通道上报通知
    offBLETransparentDataReport(bleCallback);
    return true;
  } catch (error) {
    offDpDataChange(dpChangeCallBack);
    offBLETransparentDataReport(bleCallback);
    error('Error while sending packets:', error);
    throw error;
  }
};
