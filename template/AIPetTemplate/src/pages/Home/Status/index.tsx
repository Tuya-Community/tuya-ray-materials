import React, { FC } from 'react';
import { router, Text, View } from '@ray-js/ray';
import { useProps } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import dpCodes from '@/config/dpCodes';
import { selectIpcCommonValue } from '@/redux/modules/ipcCommonSlice';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import Battery from '@/components/Battery';
import { Icon } from '@ray-js/smart-ui';
import { aiIcon, iconVoiceMic } from '@/res/iconsvg';
import Pets from '../Pets';

import styles from './index.module.less';

interface Props {
  showVoice: () => void;
}

const Status: FC<Props> = ({ showVoice }) => {
  const dpStatus = useProps(props => props[dpCodes.status]);
  const isFull = useSelector(selectIpcCommonValue('isFull'));

  return (
    <View className={clsx(styles.container, isFull && 'hide')}>
      <Pets />
      <View className={styles['status-wrapper']}>
        <Text className={styles.title}>{Strings.getDpLang(dpCodes.status, dpStatus)}</Text>
        <View className={styles.divider} />
        <Battery />
      </View>
      <View className={styles.btnBox}>
        <View className={styles.settingWrapper} hoverClassName="touchable" onClick={showVoice}>
          <Icon name={iconVoiceMic} size="40rpx" color="#FFB53E" />
        </View>
        <View
          className={styles.settingWrapper}
          hoverClassName="touchable"
          onClick={() => {
            router.push('/selectImage');
          }}
        >
          <Icon name={aiIcon} size="40rpx" color="#FFB53E" />
        </View>
      </View>
    </View>
  );
};

export default Status;
