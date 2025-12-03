import {
  onDpDataChange,
  offDpDataChange,
  onBLETransparentDataReport,
  offBLETransparentDataReport,
} from '@ray-js/ray';
import Strings from '@/i18n';
import { devices, protocolUtils } from '@/devices';
import { publishBLETransparentDataAsync, getDeviceOnlineType } from './nativeApi';
import { globalLoading, globalToast, getDevInfo } from '@/utils';

const publishTransparentData = ({ data }) => {
  return new Promise((resolve, reject) => {
    const { devId } = getDevInfo();
    publishBLETransparentDataAsync({
      deviceId: devId,
      data,
    })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

function hexStringToByteArray(hexString) {
  // 将连续的十六进制字符串转为字节数组
  const byteArray = [];
  for (let i = 0; i < hexString.length; i += 2) {
    byteArray.push(parseInt(hexString.substr(i, 2), 16)); // 每 2 个字符解析为 1 个字节
  }
  return byteArray;
}

function createPackets(hexString, maxPacketSize = 1006) {
  const data = hexStringToByteArray(hexString); // 转换为字节数组
  const dataLength = data.length; // 总数据长度
  const totalPackets = Math.ceil(dataLength / maxPacketSize); // 总包数
  const packets = [];

  for (let i = 0; i < totalPackets; i++) {
    // 当前包的数据起始和结束位置
    const start = i * maxPacketSize;
    const end = Math.min(start + maxPacketSize, dataLength);

    // 当前分包的数据部分
    const payload = data.slice(start, end);
    // const payloadLength = payload.length;
    const payloadLength = maxPacketSize;

    // 包头
    const packetHeader = [
      0x00,
      0x01, // 节目数据标识
      // eslint-disable-next-line no-bitwise
      (6 + payloadLength) >> 8,
      // eslint-disable-next-line no-bitwise
      (6 + payloadLength) & 0xff, // 数据长度
      // eslint-disable-next-line no-bitwise
      totalPackets >> 8,
      // eslint-disable-next-line no-bitwise
      totalPackets & 0xff, // 数据总包数
      // eslint-disable-next-line no-bitwise
      i >> 8,
      // eslint-disable-next-line no-bitwise
      i & 0xff, // 当前包号
      // eslint-disable-next-line no-bitwise
      payloadLength >> 8,
      // eslint-disable-next-line no-bitwise
      payloadLength & 0xff, // 分包长度
    ];

    // 合并包头和数据部分
    const packet = [...packetHeader, ...payload];
    packets.push(packet);
  }

  return packets;
}

const parseConfirmation = res => {
  const str = res.data;
  const packetIndex = parseInt(str.slice(12, 16), 16);
  return packetIndex;
};

export const sendPackets = async ({
  data,
  publishFn = packet =>
    publishTransparentData({
      data: packet.map(byte => byte.toString(16).padStart(2, '0')).join(''),
    }),
  parseConfirmationFn = parseConfirmation,
  timeout = 500, // 设置超时时间为 500ms
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onProgress = progress => {},
  dpCode,
  params,
  sendDp,
}) => {
  const devInfo = getDevInfo();
  const res = await getDeviceOnlineType({
    deviceId: devInfo?.devId,
  });
  const isBleOnline = [1, 5, 3].includes(+res?.onlineType)
    ? false
    : ![0].includes(+res?.onlineType);
  if (!isBleOnline) {
    globalToast.fail(Strings.getLang('un_online'));
    return false;
  }

  globalLoading.show(Strings.getLang('sending'));
  let dpSuccess = false;
  // 获取dpId, dpValue
  const schema = devices.common.getDpSchema();
  const dpId = schema[dpCode].id;
  const dpValue = protocolUtils[dpCode].formatter(params);
  // dp数据变化回调
  const dpChangeCallBack = res => {
    const result = Object.entries(res.dps).some(
      ([key, value]) => Number(key) === dpId && value === dpValue
    );
    dpSuccess = result;
    console.log('🚀 ~ onDpDataChangeCallBack', dpSuccess, res);
  };

  const packets = createPackets(data); // 创建分包

  const packetStatus = packets.map(() => ({
    confirmed: false, // 是否已确认
    retries: 0, // 重试次数
  }));

  let receivedPacketIndex = -1; // 当前接收的包号
  // BLE(thing)设备数据透传通道上报通知回调
  const bleCallback = res => {
    console.log('🚀 ~ bleCallback ~ res', res);
    receivedPacketIndex = parseConfirmationFn(res); // 解析包号
    packetStatus[receivedPacketIndex].confirmed = true;
  };

  try {
    // 监听dp数据变化
    onDpDataChange(dpChangeCallBack);
    // 发送dp数据
    sendDp();

    const waitDpSuccess = (): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        const dpStartTime = Date.now();

        const interval = setInterval(() => {
          if (dpSuccess) {
            clearInterval(interval);
            resolve(true); // 收到确认
          }

          if (Date.now() - dpStartTime > 60000) {
            console.warn('onDpDataChange 监听超时', dpSuccess);
            clearInterval(interval);
            resolve(false); // 超时
          }
        }, 10); // 每 10 毫秒检查一次
      });
    };

    const isDpSuccess = await waitDpSuccess();

    offDpDataChange(dpChangeCallBack);

    if (!isDpSuccess) {
      throw new Error(`onDpDataChange timeout`);
    }
    const startTimeAll = Date.now();

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
    console.log(`Starting to send ${packets.length} packets.`);

    // 先发送前 4 包，不管超时或确认，只按 10ms 间隔发送
    for (let index = 0; index < 4 && index < packets.length; index++) {
      const sendTime = Date.now() - startTimeAll;
      console.log(`Sending packet ${index + 1}/${packets.length}, , send time: ${sendTime}`);
      publishFn(packets[index]);
      onProgress({ index: index + 1, total: packets.length }); // 进度回调

      if (index < 3) {
        // 延时 10ms 发送下一个包
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    await waitForConfirmation(3);

    // 从第 5 包开始，不管超时或者是否收到确认，都继续发送
    for (let index = 4; index < packets.length; index++) {
      const sendTime = Date.now() - startTimeAll;
      console.log(`Sending packet ${index + 1}/${packets.length}, send time: ${sendTime}`);
      publishFn(packets[index]);

      // 等待确认，但不管超时是否收到确认，都继续发送下一个包
      await waitForConfirmation(index);

      // 更新包确认状态
      onProgress({ index: index + 1, total: packets.length }); // 进度回调
    }

    // 检查包是否有失败的，如果有则进行重试
    let retries = 0;
    while (retries < 5) {
      const failedPackets = packetStatus
        .map((status, index) => ({ index, confirmed: status.confirmed }))
        .filter(packet => !packet.confirmed); // 找到没有确认的包

      if (failedPackets.length === 0) {
        break; // 所有包已确认，结束重试
      }

      console.log(`Retrying failed packets (attempt ${retries + 1})`);

      // eslint-disable-next-line no-restricted-syntax
      for (const { index } of failedPackets) {
        console.log(`Retrying packet ${index + 1}/${packets.length}, attempt ${retries + 1}`);
        publishFn(packets[index]);
        await waitForConfirmation(index);
      }

      retries++;
    }

    const endTimeAll = Date.now();
    const duration = endTimeAll - startTimeAll;
    console.log(
      'All packets sent successfully.',
      `${packets.length} 个分包, 发送时间 ${duration} ms`
    );
    globalLoading.hide();
    // 取消监听BLE(thing)设备数据透传通道上报通知
    offBLETransparentDataReport(bleCallback);

    if (packetStatus.some(status => !status.confirmed)) {
      console.error('Some packets failed', packetStatus);
      globalToast.fail(Strings.getLang('failedToSend'));
      return false;
    }
    return true;
  } catch (error) {
    globalLoading.hide();
    globalToast.fail(Strings.getLang('failedToSend'));
    offDpDataChange(dpChangeCallBack);
    offBLETransparentDataReport(bleCallback);
    console.error('Error while sending packets:', error);
    throw error;
  }
};
