import { hooks } from '@ray-js/panel-sdk';
import { useEffect, useCallback, useMemo, useRef } from 'react';
import { DevInfo } from '@/types';

const protocol64 = 64;

const protocol65 = 65;

const UNKNOWN_REQ_TYPE = 'unknownReqType';

const successStyle1 = 'background: green; color: #fff;';
const successStyle2 = 'background: blue; color: #fff;';
const successStyle3 = 'background: yellow; color: #000;';

type GetTTTParams<Fn extends (...args: any) => any> = Parameters<Fn>['0'];

type GetTTTEventListenerParams<Fn extends (listener: (...args: any) => any) => any> = Parameters<
  GetTTTParams<Fn>
>['0'];

type MqttResponse = GetTTTEventListenerParams<typeof import('@ray-js/api').onMqttMessageReceived>;

type Callback = (e: MqttResponse) => void;

/**
 * 已注册监听的设备id列表
 */
const registeredDevList = [];
/**
 * 用于存储回调事件，存储的索引为 devId -> protocol -> reqType
 */
const eventMap: Record<string, Record<number, Record<string, Callback[]>>> = {};

/** 发送和监听mqtt消息的hooks */
const useMqttManager = (devId?: string) => {
  const { useDevInfo } = hooks;
  const devInfo = useDevInfo() || ({} as DevInfo);

  const registeredDevListRef = useRef(registeredDevList);

  const finalDevId = useMemo(() => devId || devInfo.devId, [devId, devInfo.devId]);

  // TODO:每次调用分配一个独一无二的id。所有监听用id信息标记，退出时从eventMap里删除对应事件回调
  useEffect(() => {
    // 如果注册监听过的设备id，则不再重复注册
    if (!registeredDevListRef.current.includes(finalDevId) && finalDevId) {
      registeredDevListRef.current.push(finalDevId);
      // 注册MQTT监听
      ty.device.registerMQTTDeviceListener({
        deviceId: finalDevId,
        complete: () => {
          ty.device.onMqttMessageReceived(mqttHandler);
        },
      });
    }

    return () => {
      // 如果注册监听过的设备id，则不再重复注册
      if (!registeredDevListRef.current.includes(finalDevId) && finalDevId) {
        ty.device.unregisterMQTTDeviceListener({
          deviceId: finalDevId,
          complete: () => {
            ty.device.offMqttMessageReceived(mqttHandler);
          },
        });
      }
    };
  }, [finalDevId]);

  const mqttHandler = (res: MqttResponse) => {
    try {
      const {
        messageData: { reqType },
        protocol,
      } = res;

      console.log(
        `%c Receive mqtt data success: %c reqType:${reqType} %c protocol: ${protocol}%o`,
        successStyle3,
        successStyle1,
        successStyle2,
        res
      );
      let list: Callback[] = [];
      if (eventMap[finalDevId] && eventMap[finalDevId][protocol]) {
        if (eventMap[finalDevId][protocol][UNKNOWN_REQ_TYPE]) {
          list = list.concat(eventMap[finalDevId][protocol][UNKNOWN_REQ_TYPE]);
        }

        if (eventMap[finalDevId][protocol][reqType as string]) {
          list = list.concat(eventMap[finalDevId][protocol][reqType as string]);
        }
      }
      list.forEach(e => e(res));
    } catch (error) {
      console.error('Receive mqtt data fail: ', error);
    }
  };

  /**
   * @description: 发送MQTT消息
   * @param {string} reqType
   * @param {number} protocol
   * @param {any} data
   * @param {any} options
   * @return {Promise<any>}
   */
  const sendMqttMessageAsync = useCallback(
    ({
      reqType,
      protocol = protocol64,
      data,
      options,
    }: {
      reqType: string;
      protocol?: number;
      data?: any;
      options?: any;
    }) => {
      return new Promise((resolve, reject) => {
        ty.device.sendMqttMessage({
          message: { ...data, reqType },
          deviceId: finalDevId,
          protocol,
          options,
          success: res => {
            console.log(
              `%c Send mqtt data success: %c reqType:${reqType} %c protocol: ${protocol}%o`,
              successStyle3,
              successStyle1,
              successStyle2,
              res
            );
            resolve(res);
          },
          fail: err => {
            console.log('sendMqttMessage fail :>> ', err);
            reject(err);
          },
        });
      });
    },
    [finalDevId]
  );

  /**
   * @description: 订阅Mqtt消息接收事件
   * @param {number} protocol
   * @param {Function} callback
   * @param {string} reqType
   * @return {void}
   */
  const subscribe = ({
    reqType = UNKNOWN_REQ_TYPE,
    protocol = protocol65,
    callback,
  }: {
    reqType?: string;
    protocol?: number;
    callback: Callback;
  }) => {
    if (!eventMap[finalDevId]) {
      eventMap[finalDevId] = {};
    }
    if (!eventMap[finalDevId][protocol]) {
      eventMap[finalDevId][protocol] = {};
    }
    if (!eventMap[finalDevId][protocol][reqType]) {
      eventMap[finalDevId][protocol][reqType] = [];
    }
    eventMap[finalDevId][protocol][reqType].push(callback);
  };

  /**
   * @description: 取消订阅Mqtt消息接收事件
   * @param {Function} callback
   * @param {number} protocol
   * @param {string} reqType
   * @return {*}
   */
  const unsubscribe = ({
    reqType = UNKNOWN_REQ_TYPE,
    protocol = protocol65,
    callback,
  }: {
    reqType?: string;
    protocol?: number;
    callback: Callback;
  }) => {
    if (
      eventMap[finalDevId] &&
      eventMap[finalDevId][protocol] &&
      eventMap[finalDevId][protocol][reqType]
    ) {
      eventMap[finalDevId][protocol][reqType] = eventMap[finalDevId][protocol][reqType].filter(
        d => d !== callback
      );
    }
  };

  return { sendMqttMessageAsync, subscribe, unsubscribe };
};

export default useMqttManager;
