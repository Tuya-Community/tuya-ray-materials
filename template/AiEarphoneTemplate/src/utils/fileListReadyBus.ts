import EventEmitter from './emitter';

type PageReadyEvent = 'file-list-ready';

export const fileListReadyBus = new EventEmitter<PageReadyEvent>();

export const emitFileListReadyBus = () => {
  fileListReadyBus.emit('file-list-ready', { time: Date.now() });
};
