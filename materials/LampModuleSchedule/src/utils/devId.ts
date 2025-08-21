type TId = { devId: string; groupId: string };
let id: TId = {
  devId: '',
  groupId: '',
};

export const setDevId = (_devId: string, _groupId: string): void => {
  id = {
    devId: _devId,
    groupId: _groupId,
  };
};

export const getDevId = (): TId => {
  return id;
};
