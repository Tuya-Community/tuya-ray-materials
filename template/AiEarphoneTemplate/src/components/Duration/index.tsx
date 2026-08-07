import React, { useMemo } from 'react';
import { View, Text } from '@ray-js/components';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import { RecordType } from '@/redux/modules/audioFileSlice';
import { DEVTYPES } from '@/constant/enums';
import { convertMillisecondsToTime } from '@/utils';

// @ts-ignore
import styles from './index.module.less';

// 只接收需要的 props
const TimeDisplay = ({ duration, currRecordType, isCardCalling, customDevType }) => {
  const showCallIcon = useMemo(() => {
    // 卡片只判断isCardCalling
    return (currRecordType === RecordType.Call && customDevType !== DEVTYPES.card) || isCardCalling;
  }, [currRecordType, customDevType, isCardCalling]);

  return <View className={styles.timeBox}>
    {showCallIcon && <ThemedImage imageName="callIcon" className={styles.callIcon} src={Res.callIcon} />}
    <Text className={styles.time}>{convertMillisecondsToTime(duration)}</Text>
  </View>
}

export default TimeDisplay;
