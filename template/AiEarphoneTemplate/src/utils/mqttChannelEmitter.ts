import EventEmitter from './emitter';

export const MQTT_CHANNEL_MESSAGE_EVENT_8500 = 'mqttChannelMessage:8500';

export type MqttChannelEventName = typeof MQTT_CHANNEL_MESSAGE_EVENT_8500;

/**
 * MQTT 消息通道事件总线（协议号 8500）。
 * - 协议在 DelayedHooksContainer 的 useMqttChannel 中统一注册一次；
 * - 收到消息后按 event.protocol 分发到对应事件名；
 * - 需要响应的页面/组件按协议号订阅对应事件接收数据。
 */
export const mqttChannelEmitter = new EventEmitter<MqttChannelEventName>();
