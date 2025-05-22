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
  emptyImg?: string;
  imgStyle?: CSSProperties;
  textStyle?: CSSProperties;
}

const NoData: FC<Props> = ({ tip, btnText, style, onClick, emptyImg, imgStyle, textStyle }) => {
  return (
    <View className={styles.container} style={{ ...style }}>
      <Image src={emptyImg || imgNoData} className={styles.img} style={imgStyle} />
      <Text className={styles.text} style={textStyle}>{tip}</Text>
      {onClick && btnText && (
        <Button round color={themeColor} customClass={styles.btn} onClick={onClick}>
          {btnText}
        </Button>
      )}
    </View>
  );
};

export default NoData;
