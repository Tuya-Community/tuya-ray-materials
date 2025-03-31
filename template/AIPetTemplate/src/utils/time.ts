export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AbortSignal {
  private listeners: Array<() => void> = [];
  aborted = false;

  addEventListener(type: 'abort', listener: () => void): void {
    if (type === 'abort') {
      this.listeners.push(listener);
    }
  }

  removeEventListener(type: 'abort', listener: () => void): void {
    if (type === 'abort') {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    }
  }

  dispatchEvent(): void {
    this.aborted = true;
    this.listeners.forEach(listener => listener());
  }
}

export class AbortController {
  signal: AbortSignal;

  constructor() {
    this.signal = new AbortSignal();
  }

  abort(): void {
    this.signal.dispatchEvent();
  }
}

export class AbortError extends Error {
  constructor(message = 'The operation was aborted.') {
    super(message);
    this.name = 'AbortError';
  }
}
