// 共享的实例数据集合

const getInstValue = (ownerInstance, key) => {
  const state = ownerInstance.getState() || {};
  return state[key];
};

const setInstValue = (ownerInstance, key, value) => {
  const state = ownerInstance.getState() || {};
  state[key] = value;
};

const getVideoClipperDataset = ownerInstance => {
  const clipperInst = ownerInstance.selectComponent('#video-clipper');
  const dataSet = clipperInst.getDataset();
  return dataSet;
};

const getVideoBgDataset = ownerInstance => {
  const bgInst = ownerInstance.selectComponent('.video-clipper__bg');
  const dataSet = bgInst.getDataset();
  return dataSet;
};

module.exports = {
  getInstValue,
  setInstValue,
  getVideoClipperDataset,
  getVideoBgDataset,
};
