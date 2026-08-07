import { useCallback, useEffect } from 'react';
import { device } from '@ray-js/ray';
import { MQTT_CHANNEL_MESSAGE_EVENT_8500, mqttChannelEmitter } from '@/utils/mqttChannelEmitter';

const MQTT_PROTOCOLS = [8500] as const;

const {
  registerMQTTProtocolListener,
  onMqttMessageReceived,
  offMqttMessageReceived,
  unregisterMQTTProtocolListener,
} = device;

/**
 * 全局 MQTT 消息通道监听（协议号 8500）。
 *
 * 仅在 DelayedHooksContainer 中调用一次，应用启动后注册协议并监听消息。
 * 收到消息后按 event.protocol 通过 mqttChannelEmitter 分发到对应事件名，
 * 需要响应的页面/组件按协议号订阅。
 */
export const useMqttChannel = () => {
  const handleMqttMessage = useCallback((event: any) => {
    const protocol = event?.protocol;

    if (protocol === 8500) {
      mqttChannelEmitter.emit(MQTT_CHANNEL_MESSAGE_EVENT_8500, event);
    }
  }, []);

  useEffect(() => {
    const params = MQTT_PROTOCOLS.map(protocol => ({
      protocol,
      fail: (e: any) => {
        console.error('[useMqttChannel] registerMQTTProtocolListener fail, protocol=', protocol, e);
      },
    }));

    params.forEach(p => registerMQTTProtocolListener(p));
    onMqttMessageReceived(handleMqttMessage);

    return () => {
      offMqttMessageReceived(handleMqttMessage);
      params.forEach(p => unregisterMQTTProtocolListener(p));
    };
  }, [handleMqttMessage]);
};
