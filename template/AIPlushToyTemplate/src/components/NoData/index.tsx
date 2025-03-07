import React, { CSSProperties, FC } from 'react';
import { Image, View, Text } from '@ray-js/ray';
import { Button } from '@ray-js/smart-ui';

import { imgNoData } from '@/res';
import { themeColor } from '@/constant';
import styles from './index.module.less';

interface Props {
  tip?: string;
  btnText?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

const NoData: FC<Props> = ({ tip, btnText, style, onClick }) => {
  return (
    <View className={styles.container} style={{ ...style }}>
      <Image src={imgNoData} className={styles.img} />
      <Text className={styles.text}>{tip}</Text>
      {onClick && btnText && (
        <Button round color={themeColor} customClass={styles.btn} onClick={onClick}>
          {btnText}
        </Button>
      )}
    </View>
  );
};

export default NoData;
