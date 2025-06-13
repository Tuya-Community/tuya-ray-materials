export interface ObserversEvent<D = any> {
  eventName: string;
  timestamp: number;
  data?: D;
}

export type Callback = (data: ObserversEvent) => void;

class ObserversCons {
  map: Record<string, Callback[]>;

  constructor() {
    this.map = {};
  }

  emit(eventName: string, data?: any) {
    const time = new Date().getTime();
    const event: ObserversEvent = {
      eventName,
      timestamp: time,
      data: data || '',
    };
    this.triggerCallback(event);
  }

  on(eventName: string, callback: Callback) {
    if (!this.map) this.map = {};
    if (!this.map[eventName]) {
      this.map[eventName] = [];
    }
    if (this.map[eventName].every((fn: Callback) => fn !== callback)) {
      this.map[eventName].push(callback);
    }
  }

  onOnce(eventName: string, callback: Callback) {
    const _cb = (e: ObserversEvent) => {
      callback(e);
      this.off(eventName, _cb);
    };
    this.on(eventName, _cb);
  }

  off(eventName, callback: Callback) {
    let callbacks = this.map?.[eventName];
    if (!callbacks) return;
    callbacks = callbacks.filter(cb => cb !== callback);
    this.map[eventName] = callbacks;
  }

  clear(eventName: string) {
    this.map[eventName] = [];
  }

  destory() {
    this.map = null;
  }

  private triggerCallback(e: ObserversEvent) {
    const { eventName } = e;
    const callbacks = this.map[eventName];
    if (!callbacks) return;
    callbacks.forEach(cb => cb(e));
  }
}

export * as ObserversEventName from './event.constant';

export const Observers = new ObserversCons();
