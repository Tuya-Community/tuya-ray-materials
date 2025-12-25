/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-useless-constructor */
export class Dispatcher {
  static instance = new Dispatcher();
  private events: object = {};

  addEventListener(type: string, listener: Function) {
    const listeners = this.events[type] || [];
    listeners.push(listener);
    this.events[type] = listeners;
  }

  removeEventListener(type: string, listener: Function) {
    const listeners = this.events[type] || [];
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  }

  dispatch(type: string, message: any) {
    const listeners = this.events[type] || [];
    for (const listener of listeners) {
      listener(message);
    }
  }
}
