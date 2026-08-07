import { DEVTYPES } from './enums';

/* ---------------------------------------------------------------------------
 * 接入配置（模板对接时优先修改本节）
 * --------------------------------------------------------------------------- */

/** 模板示例小程序 ID（接入时请修改下方 MINI_PROGRAM_ID） */
export const TEMPLATE_SAMPLE_MINI_PROGRAM_ID = 'xxxxxxxx';

/** 小程序 / 面板唯一标识（商城绑定、Agent 渠道、音频源等统一使用） */
export const MINI_PROGRAM_ID = TEMPLATE_SAMPLE_MINI_PROGRAM_ID;

/** 商城商品目录编码（VAS catalog，值保持与云端约定一致） */
export const SHOP_CATALOG = {
  /** 离线转写 / 耳机权益 */
  AI_WEARABLE_BT: 'AI_WEARABLE_BT',
  /** 实时转写 */
  AI_AUDIO_TRANS: 'AI_AUDIO_TRANS',
} as const;

export type ShopCatalogCode = (typeof SHOP_CATALOG)[keyof typeof SHOP_CATALOG];

/** catalog → 账号明细 type（atopGetAudioAccountDetail） */
export const SHOP_CATALOG_ACCOUNT_TYPE: Record<ShopCatalogCode, 'audio' | 'rts'> = {
  [SHOP_CATALOG.AI_WEARABLE_BT]: 'audio',
  [SHOP_CATALOG.AI_AUDIO_TRANS]: 'rts',
};

/**
 * 定制 App 白名单（appId）
 * 命中后会隐藏权益卡等公版商业化入口，按 OEM 需求填写
 */
export const CUSTOM_APPS: string[] = [];

/**
 * 公版 App 白名单（appId）
 * 用于 isPublicApp 等差异化逻辑，空数组表示不启用白名单限制
 */
export const PUBLIC_APPS: string[] = [];

/* ---------------------------------------------------------------------------
 * 业务常量
 * --------------------------------------------------------------------------- */

// 离线文件传输通道
export const CHANNEL_TYPES = {
  wifi: 2, // 2 代表wifi通道快传
  bluetooth: 1, // 1 代表蓝牙通道
  none: 0, // 0 代表无通道,通常是结束下载时传入使用
};
// 离线文件传输状态
export const STATUS_TYPES = {
  beforeStart: 0, // 0 未开始
  start: 1, // 1 代表成功
  end: 2, // 2 代表失败
};

// 币种
export const CURRENCY_MARK_MAP = {
  USD: '$',
  JPY: '¥',
  CNY: '¥',
  EUR: '€',
  GBP: '£',
};

export const DEFAULT_SUPPORT_LANGS = [
  'en',
  'zh',
  'fr',
  'de',
  'ru',
  'ar',
  'it',
  'ja',
  'ko',
  'es',
  'pt',
  'es_419',
  'zh_tw',
  'en_GB',
  'en_US',
  'pt_BR',
  'en_AU',
  'en_NZ',
  'sq',
  'hy',
  'az',
  'bn',
  'bs',
  'bg',
  'my',
  'hr',
  'cs',
  'da',
  'nl',
  'et',
  'fil',
  'fi',
  'el',
  'gu',
  'he',
  'hi',
  'hu',
  'id',
  'jv',
  'kk',
  'lo',
  'lv',
  'lt',
  'mk',
  'ms',
  'mr',
  'mn',
  'ne',
  'no',
  'fa',
  'pl',
  'ro',
  'sr',
  'sk',
  'sl',
  'sw',
  'sv',
  'ta',
  'te',
  'th',
  'tr',
  'uk',
  'ur',
  'uz',
  'vi',
];

// app系统设置的语言，跟实际使用做映射
export const SYSTEM_LANGS = {
  'zh-Hans': 'zh',
  zh_Hans_CN: 'zh',
  zh_CN: 'zh',
  de: 'de',
  'zh-Hant': 'zh_tw',
  ru: 'ru',
  pt: 'pt',
  ko: 'ko',
  it: 'it',
  en: 'en',
  'pt-BR': '',
  fr: 'fr',
  hu: 'hu',
  es: 'es',
  ar: 'ar',
  'es-419': 'es_419',
  ja: 'ja',
  bn: 'bn',
  zh_TW: 'zh_tw',
  es_419: 'es_419',
  pt_BR: 'pt_BR',
};

export enum CurrSelectMode {
  LEFT,
  RIGHT,
}

/** 面对面录音按钮 Lottie 颜色（left / right / auto） */
export const ACTIVE_RECORDING_COLORS = {
  left: '#01b05c',
  right: '#3678e3',
  auto: '#2BB2CD',
};

// 转写模板
export const TRANSCRIBE_TEMPLATE = [
  'auto', // AI 智能判断
  'default', // 默认
  'phone', // 电话
  'speaking', // 演讲
  'interview', // 面试
  'dictation', // 口述
  'consultation', // 咨询
  'discussion', // 讨论
  'report', // 汇报
  'classNotes', // 课堂笔记
  'training', // 培训
  'newsInterview', // 采访
  'soap', // 问诊（SOAP）
  'requirement', // 需求
  'simple', // 速览
];

// 中文多语言首字母对应表
export const PING_YING_MAP = {
  阿: 'A',
  澳: 'A',
  爱: 'A',
  保: 'B',
  波: 'B',
  德: 'D',
  俄: 'E',
  法: 'F',
  繁: 'F',
  菲: 'F',
  芬: 'F',
  古: 'G',
  哈: 'H',
  荷: 'H',
  韩: 'H',
  捷: 'J',
  简: 'J',
  拉: 'L',
  老: 'L',
  罗: 'L',
  立: 'L',
  孟: 'M',
  马: 'M',
  蒙: 'M',
  缅: 'M',
  尼: 'N',
  挪: 'N',
  葡: 'P',
  日: 'R',
  瑞: 'R',
  斯: 'S',
  塞: 'S',
  泰: 'T',
  土: 'T',
  无: 'W',
  乌: 'W',
  匈: 'X',
  希: 'X',
  新: 'X',
  西: 'X',
  意: 'Y',
  英: 'Y',
  亚: 'Y',
  越: 'Y',
  印: 'Y',
  爪: 'Z',
};

// 需隐藏的设备类型
export const HIDE_DEV_TYPES = [DEVTYPES.unKnown, DEVTYPES.wifiTrans];
