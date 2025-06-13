export const enum ServiceHallPageType {
  MALL_HOME = 0, // 增值服务商城首页
  MALL_H5_URL = 1, // 增值服务链接
  CUSTOM_H5_URL = 2, // 自定义H5页面
  MINI_MINI_APPID = 3, // 小程序 appId 格式
  MAIN_MINI_URL = 4, // 小程序 url 格式
  MAIN_FUTURE = 5, // 主功能，预设的三个服务
}

export const enum ServiceStatus {
  NOT_OPEN = 0, // 未开通
  OPENED = 1, // 已开通
  EXPIRE = 2, // 已过期
}

export const enum ServiceOpenType {
  GROUP = 0, // 家庭开通
  DEVICE = 1, // 设备开通
}

export const enum ColorType {
  EMPTY = 0, // 空白
  DEFAULT = 1, // 默认颜色
  CUSTOM = 2, // 自定义颜色
}

export const enum ServiceFunctionName {
  MY_SERVICE = 'SERVICE_FUNCTION_MY_SERVICE',
  ORDER = 'SERVICE_FUNCTION_ORDER_MANAGE',
  REDEEM_CODE = 'SERVICE_FUNCTION_REDEEM',
}

export interface ServiceHallConfigVO {
  serviceId: number;
  serviceName: string;
  serviceDesc: string;
  serviceIcon: string;
  pageType: ServiceHallPageType;
  pageLink?: string; // pageType=1和2时必有，目标页链接
  miniAppUrl?: string; // pageType=3时必有，小程序短码链接
  miniAppId?: string; // pageType=3时必有，小程序 APPID
  categoryCode: string; // pageType=0和1时必有，增值服务大类
  serviceStatus: ServiceStatus;
  serviceOpenType: ServiceOpenType;
  expirationTime?: number; // serviceStatus=1时，服务到期时间戳
  deviceBackgroundColorType: ColorType;
  deviceBackgroundColor?: string;
  miniAppCornerEnable: 0 | 1; // 小程序角标启用:0=无，1=自定义
  miniAppCornerText?: string; // 小程序角标文字
  miniAppCornerTextColor?: string; // 小程序角标文字颜色
  miniAppCornerBackgroundColor?: string; // 小程序角标背景颜色，
  mainFunctionCode?: string;
  serviceFunctionName?: string;
  // serviceNameColor?: string;
  serviceNameDayColor?: string;
  serviceNameNightColor?: string;
}
