/* eslint-disable no-console */

const defaultTag = 'ray-ble-transparent-log';
let Log = null;

function isErrorMessage(obj) {
  return obj instanceof Error;
}

export const init = (tag: string): any => {
  if (tag !== defaultTag && tag) {
    Log = null;
  }
  if (Log) {
    return Log;
  }
  if (!ty.getLogManager) {
    console.warn('不支持ty.getLogManager');
    return null;
  }
  Log = ty.getLogManager({
    tag: tag || defaultTag,
  });
  return Log;
};

export const info = (data: any, devId?: string): void => {
  if (!Log) {
    const _log = init(devId || defaultTag);
    if (!_log) {
      return;
    }
  }
  if (typeof data !== 'string') {
    // eslint-disable-next-line no-param-reassign
    data = JSON.stringify(data);
  }
  Log.log({
    message: data,
    success(res) {
      console.log('success ty.Log', res);
    },
    fail(err) {
      console.log('fail ty.Log', err);
    },
    failure(err) {
      console.log('fail ty.Log', err);
    },
  });
};

export const warn = (data: any, devId?: string): void => {
  if (!Log) {
    const _log = init(devId || defaultTag);
    if (!_log) {
      return;
    }
  }
  if (typeof data !== 'string') {
    // eslint-disable-next-line no-param-reassign
    data = JSON.stringify(data);
  }
  Log.debug({
    message: data,
    success(res) {
      console.log('success ty.debug', res);
    },
    fail(err) {
      console.log('fail ty.Log', err);
    },
    failure(err) {
      console.log('fail ty.debug', err);
    },
  });
};

export const error = (data: any, devId?: string): void => {
  if (!Log) {
    const _log = init(devId || defaultTag);
    if (!_log) {
      return;
    }
  }
  let _data = null;
  const isError = isErrorMessage(data);
  if (isError) {
    _data = {
      message: data.message,
      stack: data.stack.slice(0, 200),
    };
  } else {
    try {
      _data = JSON.stringify(data);
    } catch (e) {
      _data = e?.toString();
    }
  }
  Log.error({
    message: _data,
    success(res) {
      console.log('success ty.error', res);
    },
    fail(err) {
      console.log('fail ty.Log', err);
    },
    failure(err) {
      console.log('fail ty.error', err);
    },
  });
};

export default {
  info,
  warn,
  error,
};
