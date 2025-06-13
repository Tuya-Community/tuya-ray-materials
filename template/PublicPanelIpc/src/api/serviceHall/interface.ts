import type { ServiceHallConfigVO } from '@/entities/serviceHall/interface';

export type GetServiceHallSettingParams = {
  type: 0;
  instanceId: string; // 设备uuid
  homeId: string;
};

export type GetServiceHallSettingRes = {
  recommendServiceList: ServiceHallConfigVO[];
  moreServiceList: ServiceHallConfigVO[];
  // bannerList
};
