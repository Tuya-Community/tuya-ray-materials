interface UserInfo {
  id?: string;
  userId: string; // 用户id
  devId: string; // 设备id
  type: 1 | 2 | 3 | 6; // 业务类型：1-血压计；2-厨房秤；3-体脂称；6-血氧仪
  userName: string; // 用户名
  sex: 0 | 1; // 性别 0-男 1-女
  birthday: number; // 生日 时间戳
  height: number; // 身高
  heightUnit: 'cm' | 'inch'; // 身高单位
  weight: number; // 体重
  weightUnit: 'kg' | 'lb' | 'st' | 'jin'; // 体重单位
  userType: number; // 用户类型, 1-主用户,2-临时用户,其他-dp配置用户
  avatar?: string; // 头像
  extInfo?: string | { weightScale: number }; // 扩大10倍保存体重，因为云端不支持小数存储
  userTypeCode?: string;
}

type DataType = 'year' | 'month' | 'week';

interface MeasureHistoryData<T> {
  data: T[];
  hasNext: boolean;
  totalCount: number;
}

interface MeasureHistoryStatistcs {
  totalCount: number;
}

interface SingleMeasureData {
  id: number;
  uuid: string;
  sys: number;
  dia: number;
  pulse: number;
  bpLevel: string;
  time: number;
  devId: string;
  userId: string;
  remark: string;
}

interface DataInfo {
  devId: string; // 设备id
  userId: string; // 用户id
  sys: number; // 收缩压
  dia: number; // 舒张压
  pulse: number; // 脉搏
  time: number; // 时间戳
  remark: string; // 备注
}

interface FiltedData {
  datas: any;
  hasNext: boolean;
  totalCount: number;
  pageNo: number;
  pageSize: number;
}

interface SingleFiledData {
  id: number;
  uuid: string;
  sys: number;
  dia: number;
  pulse: number;
  bpLevel: string;
  time: number;
  devId: string;
  userId: string;
  remark: string;
  arr: boolean;
  pid: string;
  reportType: number;
  status: number;
}

interface LatestData<T> {
  list: T[];
  avgData: {
    avgTotalSys: string;
    avgTotalDia: string;
    avgTotalPulse: string;
  };
}

interface LatestDataList {
  avgSys: string;
  avgDia: string;
  avgPulse: string;
  time: number;
}

interface UnallocatedData {
  datas: [];
  hasNext: boolean;
  totalCount: number;
}

interface DataJsonItem {
  dps: {
    1: number;
    2: number;
    3: number;
    4: boolean;
    9: string;
  };
  dpsTime: number;
}
