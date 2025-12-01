/**
 * 在此自定义你的当前项目云功能配置的 type
 */
export interface FunConfig {
  /**
   * 云能力最近更新时间
   */
  // timestamp?: string;
  [key: string]: any;
}

export const ioTCloudFunCodeMap = {
  // AI产品类型  buds（耳机）/card（卡片）
  tyabi3sshd: 'productStyle',
  // 云能力面板业务功能关于mode配置
  tyabis7jav: 'modeConfigList',
  // 是否是入门版耳机
  tyabi4tm5h: 'isBtEntryVersion',
  // TTS流编码方式，通过编码后将流写入到耳机设备silk：opus_silk  celt:opus_celt
  tyabiv8xmx: 'opusEncodingType',
  // 是否支持离线可用
  tyabi4wfwm: 'offlineUsage',
  // 复用入门版能力，开启时候，专业版也支持实时转录和会议的 通道切换。并且直接默认传bt通道
  tyabi54eva: 'supportRecordChannelChange',
  // 是否支持耳机控制功能
  tyabipgtaq: 'supportEarControl',
};
/**
 * 放置IoT 云能力面板业务功能配置默认值
 */
export default {
  productStyle: ['buds'],
};

/**
 * 根据最新合并的值，替换key为可读性高的
 * @param cloudFun
 */
export const mapCloudFunKey = (cloudFun: FunConfig): FunConfig => {
  // 非对象条件下直接返回
  if (typeof cloudFun !== 'object') return cloudFun;
  const funConfig: FunConfig = {};
  // 替换为可读性较高的属性
  Object.keys(cloudFun).forEach(key => {
    if (ioTCloudFunCodeMap[key]) funConfig[ioTCloudFunCodeMap[key]] = cloudFun[key];
  });
  return funConfig;
};
