import { FC, useEffect, useState } from 'react';
import { Text, View } from '@ray-js/ray';

import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { updateUI } from '@/redux/action';
import { TouchableOpacity } from '../common';
import styles from './index.module.less';

const dateType = ['week', 'month', 'year'] as const;

const DateSelector: FC = () => {
  const type = useSelector(({ uiState }) => uiState.type);
  const [translateX, setTranslateX] = useState(0);
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);

  useEffect(() => {
    let val = 0;
    dateType.some((item, index) => {
      if (item === type) {
        val = index * 224;
        return true;
      }
      return false;
    });
    setTranslateX(val);
  }, [type]);

  const handleOnPress = (num: number, typeStr: string) => {
    updateUI({ type: typeStr });
  };

  return (
    <View className={styles.containerStyle}>
      <View
        className={styles.modeActiveBgBox}
        style={{
          left: `${translateX + 6}rpx`,
        }}
      >
        <View className={styles.buttonCheckedStyle} />
      </View>

      <View className={styles.dateBox}>
        {dateType.map((item, index) => (
          <TouchableOpacity
            className={styles.singleDate}
            key={item}
            onClick={() => handleOnPress(index, item)}
          >
            <Text
              className={styles.dateText}
              style={{ color: item === type ? themeColor : '#001E3E' }}
            >
              {Strings.getLang(`dsc_${item}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default DateSelector;
