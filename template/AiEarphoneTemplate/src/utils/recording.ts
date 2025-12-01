export const parseRealTimerResult = (realTimeResult: any) => {
  try {
    const resList = [];
    if (realTimeResult?.list?.length) {
      realTimeResult?.list?.forEach(item => {
        if (item.status === 1 && (item?.translate || item?.asr)) {
          resList.push({
            id: item.requestId,
            text: `${item?.asr || ''}\n${item?.translate || ''}`,
            channel: item.channel,
          });
        }
      });
    }
    return resList;
  } catch (error) {
    console.log('error', error);
    return [];
  }
};
