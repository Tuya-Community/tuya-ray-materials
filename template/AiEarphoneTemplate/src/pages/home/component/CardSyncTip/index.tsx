/*
 * @Author: hkc
 * @Date: 2026-01-22 17:56:26
 * @Description:
 * @LastEditTime: 2026-06-07 20:58:22
 * @LastEditors: hkc
 */
import React, { useEffect, useState } from 'react';
import { View, Image, router } from '@ray-js/ray';
import { Icon } from '@ray-js/smart-ui';

import RightArrowIcon from '@tuya-miniapp/icons/dist/svg/Right';
import EllipsisText from '@/components/EllipsisText';
import { CurrentSyncCardDevInfo } from '@/redux/modules/fileSyncSlice';
import { getDomClientRect } from '@/utils/dom';
import Strings from '@/i18n';
import Res from '@/res';

import styles from './index.module.less';

interface IProps {
  show: boolean;
  deviceInfo: CurrentSyncCardDevInfo;
}

const Index: React.FC<IProps> = ({ show, deviceInfo }) => {
  const [height, setHeight] = useState(0);

  const getHeight = async () => {
    const rect = await getDomClientRect('card-sync-tip');
    setHeight(rect.height);
  };

  const handleClick = () => {
    const { deviceId } = deviceInfo;
    router.push(`/cardTransfer?deviceId=${deviceId}`, { subpackage: 'pkgEntry' });
  };

  useEffect(() => {
    getHeight();
  }, []);

  return (
    <View className={styles.container} style={{ height: `${show ? height : 0}px` }}>
      <View className={styles.inner} id="card-sync-tip" onClick={handleClick}>
        <Image src={Res.cardSyncingIcon} className={styles.icon} />
        <EllipsisText
          text={Strings.formatValue('cardTransfer.homeTip', deviceInfo?.name || 'AI Note')}
          className={styles.tip}
        />
        <Icon name={RightArrowIcon} color="#D9D9D9" size={12} />
      </View>
    </View>
  );
};

export default React.memo(Index);
