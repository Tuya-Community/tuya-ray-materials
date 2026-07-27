export enum CredentialState {
  // 待使用
  PENDING_USE = 1,
  // 使用中
  IN_USE = 2,
  // 已使用
  USED = 3,
  // 已过期
  EXPIRED = 4,
}

export type CredentialUsageState = "unused" | "using" | "used" | string;

// 计量类型
export enum MeteringType {
  // 频率
  COUNT = 1,
  // 流量
  TRAFFIC = 2,
}

// 计量
export enum MeteringUnit {
  // 次
  TIMES = 10,
  // MB
  MINUTES = 20,
  // GB
  HOURS = 21,
}

export enum QuotaPeriodUnit {
  NONE = 0,
  // 年
  YEAR = 1,
  // 月
  MONTH = 2,
  // 天
  DAY = 3,
  // 周
  WEEK = 4,
}

export interface CredentialMetering {
  meteringType: MeteringType;
  meteringUnit: MeteringUnit;
  quotaPeriodUnit: QuotaPeriodUnit;
  quota: number;
}

export interface CredentialPerformance {
  consumeType: number;
  consumeInCurrentMonth: boolean;
}

export interface CredentialQuotaUsage {
  // 剩余用量
  leftQuantity: number;
  // 已使用用量
  usedQuantity: number;
}

export interface CredentialOrder {
  orderId: string;
  commodityCode: string;
  skuCode: string;
  subscribeOrder: boolean;
}

export interface VasCredential {
  catalogCode: string;
  externalCode: string;
  effectiveStartDate: number;
  effectiveEndDate: number;
  state: CredentialState;
  usageState: CredentialUsageState;
  metering: CredentialMetering;
  performance: CredentialPerformance;
  quotaUsage: CredentialQuotaUsage;
  order: CredentialOrder;
}
