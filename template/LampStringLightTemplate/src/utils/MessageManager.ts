/* eslint-disable @typescript-eslint/no-empty-function */

import { DEFAULTOPTIONS } from '@/constant/scenes';
import { SceneData } from '@/constant/type';

/* eslint-disable @typescript-eslint/explicit-member-accessibility */
export interface MessageType {
  content?: any;
  type: 'input' | 'text' | 'loading' | 'result' | 'change';
  role: 'robot' | 'user';
  ts: number;
}

const defaultResult: SceneData = {
  dataType: 1,
  name: '',
  ...DEFAULTOPTIONS,
  key: 0,
  id: 0,
  colors: [],
};

const firstMessage: MessageType = {
  type: 'input',
  role: 'robot',
  ts: Date.now(),
};

export class MessageManager {
  private messages: MessageType[] = [firstMessage];

  private listeners: (() => void)[] = [];
  private resultListeners: ((data: SceneData) => void)[] = [];
  private latestResult: SceneData = {
    ...defaultResult,
  };

  public static instance = new MessageManager();

  getMessages() {
    return this.messages;
  }

  getLatestMessages() {
    if (this.messages && this.messages.length > 0) {
      return this.messages[this.messages.length - 1];
    }
  }

  getLatestResult(edit?: (data: SceneData) => SceneData) {
    const cloned = { ...(this.latestResult || ({} as SceneData)) };
    return edit ? edit(cloned) : cloned;
  }

  updateLatestResult(edit?: (data: SceneData) => SceneData) {
    this.latestResult = this.getLatestResult(edit);
    this.resultListeners.forEach(l => l(this.latestResult));
  }

  send(...message: MessageType[]) {
    const result = message.find(item => item.type === 'result');
    if (result) {
      this.latestResult = result?.content;
      this.resultListeners.forEach(l => l(this.latestResult));
      this.messages = this.messages.filter(item => item.type !== 'loading');
    }

    this.messages.push(...message);
    this.listeners.forEach(l => l());
  }

  onMessageChange(listener: () => void) {
    this.offMessageChange(listener);
    this.listeners = this.listeners.concat(listener);
  }

  offMessageChange(listener: () => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  onResultMessageChange(listener: (data: SceneData) => void) {
    this.offResultMessageChange(listener);
    this.resultListeners = this.resultListeners.concat(listener);
  }

  offResultMessageChange(listener: (data: SceneData) => void) {
    this.resultListeners = this.resultListeners.filter(l => l !== listener);
  }

  clear() {
    this.latestResult = {
      ...defaultResult,
    };
    this.messages = [firstMessage];
    this.listeners.forEach(l => l());
    this.resultListeners.forEach(l => l(this.latestResult));
  }
}
