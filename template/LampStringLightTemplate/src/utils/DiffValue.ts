/* eslint-disable */
// set和push用于和源同步DiffValue
// 调用set时，会调用push函数，同时缓存值会变为脏值
// 再下一次get时会检查是否为脏值，如果是则通过fetch获取并更新变量缓存，如果不为脏值则取变量缓存
// 对push和set函数进行了缓存优化，对于相同的uuid，需要等待已有任务结束

export interface DiffValueOps<T> {
  fetch(oldVal: T): Promise<T>;
  push(val: T): Promise<any>;
  clear(): Promise<any>;
}

export class DiffValue<T> {
  private isOld = true;
  private value: T = null;

  constructor(private defaultValue: T, private ops: DiffValueOps<T>) {
    this.isOld = true;
    this.value = defaultValue;
  }

  public async set(val: T) {
    this.value = val;
    await this.push();
    this.isOld = true;
  }
  public async get() {
    if (this.isOld) {
      await this.fetch();
      this.isOld = false;
    }
    return this.value || this.defaultValue;
  }

  public setIsOld() {
    this.isOld = true;
  }

  private async fetch() {
    const newVal = await this.ops.fetch(this.value);
    this.value = newVal;
  }
  private async push() {
    await this.ops.push(this.value);
  }

  public async clear() {
    await this.ops.clear();
    this.isOld = true;
  }
}

export class DiffAsyncValue<T> extends DiffValue<T> {
  constructor(private uuid: string, defaultValue: T, ops: DiffValueOps<T>) {
    super(defaultValue, {
      fetch: oldVal => DiffAsyncValue.getTaskByKey('fetch', uuid, () => ops.fetch(oldVal)),
      push: async val => {
        return DiffAsyncValue.getTaskByKey('push', uuid + ':' + val, () => ops.push(val));
      },
      clear: ops.clear,
    });
  }

  public async set(val: T, dispatch = true) {
    await super.set(val);
    dispatch && this.dispatch(); // call listeners
  }

  private static listeners: Map<string, VoidFunction[]> = new Map();

  subscribe(listener: VoidFunction) {
    const listeners = DiffAsyncValue.listeners.get(this.uuid) || [];
    const newListeners = listeners.filter(l => l !== listener).concat(listener);
    DiffAsyncValue.listeners.set(this.uuid, newListeners);
    return () => this.unsubscribe(listener);
  }
  private unsubscribe(listener: VoidFunction) {
    const listeners = DiffAsyncValue.listeners.get(this.uuid) || [];
    const newListeners = listeners.filter(l => l !== listener);
    DiffAsyncValue.listeners.set(this.uuid, newListeners);
  }
  dispatch() {
    const listeners = DiffAsyncValue.listeners.get(this.uuid) || [];
    listeners.forEach(l => l());
  }

  private static asyncTasks: Record<string, Promise<any>> = {};

  // dedup async calls
  private static getTaskByKey = (
    type: 'fetch' | 'push',
    uuid: string,
    fetch: () => Promise<any>
  ) => {
    const asyncTasks = this.asyncTasks;
    const keyFetch = asyncTasks[uuid];
    if (keyFetch) {
      if (type === 'push') {
        console.warn(`[DiffAsyncValue] ${uuid} same time push, please check the logic is normal!`);
      }
      return keyFetch;
    }
    const task = fetch();
    asyncTasks[uuid] = task;
    task.finally(() => {
      asyncTasks[uuid] = null;
    });
    return asyncTasks[uuid];
  };

  private static cacheMap: Record<string, DiffAsyncValue<any>> = {};

  public static getCache(key: string, defaultValue: any, ops: DiffValueOps<any>) {
    const cacheMap = this.cacheMap;
    if (!cacheMap[key]) {
      cacheMap[key] = new DiffAsyncValue(key, defaultValue, ops);
    }
    const valueCached = cacheMap[key];
    return valueCached;
  }
}
