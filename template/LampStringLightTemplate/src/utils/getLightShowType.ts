export enum ELightShowType {
  dot = 'dot', // 点排布
  line = 'line', // 线性排布
}
// 获取灯带显示类型
const getLightShowType = (): ELightShowType => {
  return ELightShowType.dot;
};

export default getLightShowType;
