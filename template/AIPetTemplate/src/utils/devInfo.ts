let devInfo = {} as DevInfo;

export const getDevInfo = (): DevInfo => {
  return devInfo;
};

export const setDevInfo = (info: any) => {
  if (!info) return;
  devInfo = info;
};

export const clearDevInfo = () => {
  devInfo = {} as DevInfo;
};
