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
import { ISendPacketsOptions, IReportData, IProgress } from './types';

/**
 * 发送分包数据
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
export const sendPackets = async ({
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
  const dpChangeCallBack = (res: any) => {
    info(`onDpDataChange callback, res: ${JSON.stringify(res)}`);
    const result = Object.entries(res.dps).some(
      ([key, value]) => Number(key) === dpId && value === dpValue
    );
    dpSuccess = result;
  };

  const packetStatus = packets.map(() => ({
    confirmed: false, // 是否已确认
    retries: 0, // 重试次数
  }));

  let receivedPacketIndex = -1; // 当前接收的包号
  // BLE(thing)设备数据透传通道上报通知回调
  const bleCallback = (res: IReportData) => {
    info(`onBLETransparentDataReport callback, res: ${JSON.stringify(res)}`);
    receivedPacketIndex = parseReportData(res); // 解析包号
    packetStatus[receivedPacketIndex].confirmed = true;
  };

  try {
    if (!(!isFunction(sendDp) || isUndefined(dpValue) || isUndefined(dpId))) {
      // 监听dp数据变化
      onDpDataChange(dpChangeCallBack);
      // 发送dp数据
      sendDp();

      // 等待 dp 数据变化
      const waitDpSuccess = (): Promise<boolean> => {
        return new Promise<boolean>(resolve => {
          const dpStartTime = Date.now();

          const interval = setInterval(() => {
            if (dpSuccess) {
              clearInterval(interval);
              resolve(true); // 收到确认
            }

            if (Date.now() - dpStartTime > 60000) {
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

    // 等待包确认
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

    // 先发送前 4 包，不管超时或确认，只按 10ms 间隔发送
    for (let index = 0; index < 4 && index < packets.length; index++) {
      const currentTime = Date.now() - startTimeAll;
      info(
        `Total packet: ${packets.length}, current packet ${index}, send time at: ${currentTime}`
      );
      publishBLETransparentDataAsync({ deviceId, data: packets[index] });
      onProgress({ index: index, total: packets.length, type: 'normal' }); // 进度回调

      if (index < 3) {
        // 延时 10ms 发送下一个包
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    await waitForConfirmation(3);

    // 从第 5 包开始，不管超时或者是否收到确认，都继续发送
    for (let index = 4; index < packets.length; index++) {
      const sendTime = Date.now() - startTimeAll;
      info(`Total packet: ${packets.length}, current packet ${index}, send time at: ${sendTime}`);
      publishBLETransparentDataAsync({ deviceId, data: packets[index] });

      // 等待确认，但不管超时是否收到确认，都继续发送下一个包
      await waitForConfirmation(index);

      // 更新包确认状态
      onProgress({ index: index, total: packets.length, type: 'normal' }); // 进度回调
    }

    // 检查包是否有失败的，如果有则进行重试
    let retries = 0;
    while (retries < maxRetries) {
      const failedPackets = packetStatus
        .map((status, index) => ({ index, confirmed: status.confirmed }))
        .filter(packet => !packet.confirmed); // 找到没有确认的包

      if (failedPackets.length === 0) {
        break; // 所有包已确认，结束重试
      }
      info(`Failed packet: ${failedPackets.length}, retrying failed packets (attempt ${retries})`);

      // eslint-disable-next-line no-restricted-syntax
      for (const { index } of failedPackets) {
        const currentSendTime = Date.now() - startTimeAll;
        info(
          `Failed packet: ${failedPackets.length}, current send failed packet ${index}, attempt ${retries}, send time at: ${currentSendTime}`
        );
        publishBLETransparentDataAsync({ deviceId, data: packets[index] });
        await waitForConfirmation(index);
        onProgress({ index: index, total: packets.length, type: 'retry' }); // 进度回调
      }

      retries++;
    }

    const endTimeAll = Date.now();
    const duration = endTimeAll - startTimeAll;
    info(`All packets sent successfully. Total: ${packets.length}, time: ${duration}ms`);
    // 取消监听BLE(thing)设备数据透传通道上报通知
    offBLETransparentDataReport(bleCallback);

    if (packetStatus.some(status => !status.confirmed)) {
      error(`Some packets failed, packetStatus: ${JSON.stringify(packetStatus)}`);
      return false;
    }
    return true;
  } catch (error) {
    offDpDataChange(dpChangeCallBack);
    offBLETransparentDataReport(bleCallback);
    error('Error while sending packets:', error);
    throw error;
  }
};
