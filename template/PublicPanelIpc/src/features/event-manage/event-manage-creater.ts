export type EventTask = (...args) => void;

export type EventInstance = {
  on: (type: string, cb: EventTask) => void;
  off: (type: string, cb: EventTask) => void;
  emit: (type: string, ...args) => void;
};

export function getEventInstance(): EventInstance {
  const map: Record<string, EventTask[]> = {};
  return {
    on(type: string, cb) {
      if (!map[type]) {
        map[type] = [];
      }
      map[type].push(cb);
    },
    off(type: string, cb) {
      if (map[type]) {
        map[type] = map[type].filter(item => item !== cb);
      }
    },
    emit(type, ...args) {
      if (map[type]) {
        map[type].forEach(cb => {
          cb && cb.apply(null, ...args);
        });
      }
    },
  };
}
