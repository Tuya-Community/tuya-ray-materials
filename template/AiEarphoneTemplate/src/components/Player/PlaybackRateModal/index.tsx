import React, { useCallback, useEffect, useState, FC, useMemo } from 'react';
import { View, Button, Text } from '@ray-js/components';
import { useSelector } from 'react-redux';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import CustomPopup from '@/components/CustomPopup';
import clsx from 'clsx';
import Strings from '@/i18n';
// @ts-ignore
import styles from './index.module.less';

const PLAYBACK_RATE_ARR = [0.5, 1, 2] as const;
type PlaybackRate = 0.5 | 1 | 2;

interface Props {
  show: boolean;
  currPlaybackRate: PlaybackRate;
  onClickOverlay: () => void;
  onConfirm: (v: PlaybackRate) => void;
}

const PlaybackRateModal: FC<Props> = ({ show, onClickOverlay, onConfirm, currPlaybackRate }) => {
  const { windowWidth } = useSelector(selectSystemInfo);
  const btnWidth = useMemo(() => (windowWidth - 44) / 3, [windowWidth]);
  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);

  useEffect(() => {
    setPlaybackRate(currPlaybackRate);
  }, [currPlaybackRate]);

  const handlePlaybackRateChange = rate => {
    setPlaybackRate(rate);
  };

  const handleBottomBtnClick = useCallback(() => {
    onConfirm(playbackRate);
  }, [playbackRate]);

  const handleClickOverlay = useCallback(() => {
    onClickOverlay();
    setTimeout(() => {
      setPlaybackRate(currPlaybackRate);
    }, 300);
  }, [currPlaybackRate]);

  return (
    <CustomPopup
      title={Strings.getLang('player_speed_select_title')}
      bottomBtnText={Strings.getLang('confirm')}
      show={show}
      onClickOverlay={handleClickOverlay}
      onBottomBtnClick={handleBottomBtnClick}
    >
      <View className={styles.btnGroupContainer}>
        {PLAYBACK_RATE_ARR.map((item, idx) => {
          const isActive = item === playbackRate;
          return (
            <Button
              key={item}
              className={isActive ? clsx(styles.btnItem, styles.btnItemActive) : styles.btnItem}
              style={{
                width: `${btnWidth}px`,
                marginRight: (idx + 1) % 3 ? '6px' : 0,
              }}
              onClick={() => {
                handlePlaybackRateChange(item);
              }}
            >
              <Text className={styles.btnItemText}>{`x${item.toFixed(1)}`}</Text>
            </Button>
          );
        })}
      </View>
    </CustomPopup>
  );
};

export default React.memo(PlaybackRateModal);
