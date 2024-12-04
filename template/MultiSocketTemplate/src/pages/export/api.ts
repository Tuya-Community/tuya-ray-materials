import { exportStatisticsDay, exportStatisticsHour, exportStatisticsMonth } from '@ray-js/ray';

// 导出小时数据
export const exportHour = async params => {
  try {
    await exportStatisticsHour({
      email: params.email,
      devId: params.devId,
      dpExcelQuery: JSON.stringify(params.dpExcelQuery),
      date: params.date,
      type: 'avg',
      auto: 2,
      keepScalaPoint: true,
      lang: 'cn',
    });

    // 导出成功
  } catch {
    // 导出失败
  }
};

// 导出天数据
export const exportDay = async params => {
  try {
    await exportStatisticsDay({
      email: params.email,
      devId: params.devId,
      dpExcelQuery: JSON.stringify(params.dpExcelQuery),
      startDay: params.startDay,
      endDay: params.endDay,
      type: 'avg',
      keepScalaPoint: true,
      lang: 'cn',
    });

    // 导出成功
  } catch {
    // 导出失败
  }
};

// 导出月数据
export const exportMonth = async params => {
  try {
    await exportStatisticsMonth({
      email: params.email,
      devId: params.devId,
      dpExcelQuery: JSON.stringify(params.dpExcelQuery),
      startMonth: params.startMonth,
      endMonth: params.endMonth,
      type: 'avg',
      keepScalaPoint: true,
      lang: 'cn',
    });

    // 导出成功
  } catch {
    // 导出失败
  }
};
