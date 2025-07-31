const queryComponent = function (ownerInstance, selector) {
  const instance = ownerInstance?.selectComponent(selector);
  return instance;
};

const setStyle = (ownerInstance, style, className) => {
  const dom = queryComponent(ownerInstance, className);
  dom.setStyle(style);
};

const getState = e => {
  const { getDataset } = e.instance;
  const data = getDataset();
  return data;
};

function calculateAngleFromBottom(centerX, centerY, currentX, currentY) {
  // 计算水平和竖直距离
  const dx = currentX - centerX;
  const dy = currentY - centerY;

  // 使用 Math.atan2 获取弧度
  let angleInRadians = Math.atan2(dy, dx);

  // 调整起点：将0度设为Y轴负方向 (圆的底部)
  // 旋转90度（π/2）
  angleInRadians -= Math.PI / 2;

  // 将弧度转换为角度
  let angleInDegrees = angleInRadians * (180 / Math.PI);

  // 确保角度在0到360度范围内
  if (angleInDegrees < 0) {
    angleInDegrees += 360;
  }

  return angleInDegrees;
}

module.exports = {
  queryComponent,
  setStyle,
  getState,
  calculateAngleFromBottom,
};
