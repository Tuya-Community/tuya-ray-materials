type EventFun = (...args: any[]) => void;

class EventEmitter<T extends string | number | symbol> {
  private events: Record<T, EventFun[]>;

  constructor() {
    this.events = {} as Record<T, EventFun[]>;
  }

  // 订阅事件
  on(event: T, listener: (...args: any[]) => void): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  // 取消订阅事件
  off(event: T, listener: (...args: any[]) => void): void {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  // 触发事件
  emit(event: T, ...args: any[]): void {
    if (!this.events[event]) return;

    this.events[event].forEach(listener => {
      listener(...args);
    });
  }

  // 订阅一次性事件
  once(event: T, listener: (...args: any[]) => void): void {
    const onceListener = (...args: any[]) => {
      listener(...args);
      this.off(event, onceListener);
    };
    this.on(event, onceListener);
  }
}

export default EventEmitter;
