import { FC } from 'react';
import { View } from '@ray-js/ray';

import Strings from '@/i18n';
import Res from '@/res';
import { Text } from '../common';
import styles from './index.module.less';

interface Props {
  type: 'WHO_LV0' | 'WHO_LV1' | 'WHO_LV2' | 'WHO_LV3' | 'WHO_LV4' | 'WHO_LV5';
}
const colorList = ['#2DDBAE', '#75D788', '#9AD368', '#FCA849', '#F98460', '#FF4141'];

const ColorBar: FC<Props> = ({ type = 'WHO_LV0' }) => {
  const levelNumber = parseInt(type.slice(-1), 10);

  return (
    <View className={styles.container}>
      <View className={styles.bubbleBox} style={{ marginLeft: `${2 * levelNumber * 47}rpx` }}>
        <View
          className={styles.bgBubble}
          style={{
            backgroundColor: colorList[levelNumber],
            WebkitMaskImage: `url(${Res.textBubble})`,
          }}
        />
        <Text className={styles.typeText} numberOfLines={1}>
          {Strings.getLang(`dsc_${type}`)}
        </Text>
      </View>
      <View>
        <View className={styles.colorBarBox}>
          {colorList.map((item, index) => (
            <View
              className={styles.colorItem}
              key={item}
              style={{
                marginRight: index === colorList.length - 1 ? 0 : '2rpx',
                backgroundColor: item,
              }}
            />
          ))}
        </View>
        <View
          className={styles.circle}
          style={{ left: `${37 + levelNumber * 47}rpx`, borderColor: colorList[levelNumber] }}
        />
      </View>
    </View>
  );
};

export default ColorBar;
