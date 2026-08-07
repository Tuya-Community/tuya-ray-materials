import React, { useCallback, useEffect, useState, FC, useMemo } from 'react';
import { View, Button } from '@ray-js/components';
import { useSelector } from 'react-redux';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import CustomPopup from '@/components/CustomPopup';
import clsx from 'clsx';
import Strings from '@/i18n';
import { playbackRateList } from '@/pages/detail/enum';
import ThemedImage from '@/components/ThemedImage';

import styles from './index.module.less';

interface IProps {
  show: boolean;
  currentRate: number;
  onClickOverlay: () => void;
  onConfirm: (rate: number) => void;
}

const PlaybackRateModal: FC<IProps> = ({ show, onClickOverlay, onConfirm, currentRate }) => {
  const { windowWidth } = useSelector(selectSystemInfo);
  const btnWidth = useMemo(() => (windowWidth - 44) / 3, [windowWidth]);
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  useEffect(() => {
    setPlaybackRate(currentRate);
  }, [currentRate]);

  const handlePlaybackRateChange = rate => {
    setPlaybackRate(rate);
  };

  const handleBottomBtnClick = useCallback(() => {
    onConfirm(playbackRate);
  }, [playbackRate]);

  const handleClickOverlay = useCallback(() => {
    onClickOverlay();
    setTimeout(() => {
      setPlaybackRate(currentRate);
    }, 300);
  }, [currentRate]);

  return (
    <CustomPopup
      title={Strings.getLang('player_speed_select_title')}
      bottomBtnText={Strings.getLang('confirm')}
      show={show}
      onClickOverlay={handleClickOverlay}
      onBottomBtnClick={handleBottomBtnClick}
    >
      <View className={styles.btnGroupContainer}>
        {playbackRateList.map((item, idx) => {
          const isActive = item.value === playbackRate;
          return (
            <Button
              key={item.value}
              className={isActive ? clsx(styles.btnItem, styles.btnItemActive) : styles.btnItem}
              style={{
                width: `${btnWidth}px`,
                marginRight: (idx + 1) % 3 ? '6px' : 0,
              }}
              onClick={() => {
                handlePlaybackRateChange(item.value);
              }}
            >
              <ThemedImage src={item.icon} className={styles.icon} imageName={item?.iconName} />
            </Button>
          );
        })}
      </View>
    </CustomPopup>
  );
};

export default React.memo(PlaybackRateModal);
