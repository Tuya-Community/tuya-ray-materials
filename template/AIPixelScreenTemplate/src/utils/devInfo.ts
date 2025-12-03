let devInfo = {} as DevInfo;

export const getDevInfo = (): DevInfo => {
  return devInfo;
};

export const setDevInfo = (info: any) => {
  if (!info) return;
  console.log('setDevInfo', info);
  devInfo = info;
};

export const clearDevInfo = () => {
  devInfo = {} as DevInfo;
};
