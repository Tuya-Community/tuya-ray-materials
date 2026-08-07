/*
 * @Author: hkc
 * @Date: 2025-07-09 16:55:50
 * @LastEditors: hkc
 * @LastEditTime: 2025-11-24 10:27:34
 * @Description:
 */
import React, { FC } from 'react';
import { View } from '@ray-js/components';
import { Button } from '@ray-js/smart-ui';

import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';

import styles from './index.module.less';

interface Props {
  // resultType?: string;
  image?: string;
  title?: string;
  desc?: string;
  buttonTitle?: string;
  onClick?: () => void;
}

const EmptyContent: FC<Props> = props => {
  const { image = Res.emptyImg, title, desc, buttonTitle, onClick } = props;
  return (
    <View className={styles.container}>
      <ThemedImage
        src={image}
        className={styles.img}
        imageName={image === Res.emptyImg ? 'emptyImg' : undefined}
      />
      {title && <View className={styles.title}>{title}</View>}
      {desc && <View className={styles.desc}>{desc}</View>}
      {buttonTitle && (
        // smart-ui打标无效，所以套了一层
        <View id="generateBtn" className={styles.buttonBox} onClick={onClick}>
          <Button customClass={styles.button}>{buttonTitle}</Button>
        </View>
      )}
    </View>
  );
};

export default React.memo(EmptyContent);
