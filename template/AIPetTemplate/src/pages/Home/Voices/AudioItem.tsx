import React, { FC, memo, useContext, useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  createInnerAudioContext,
  showLoading,
  showToast,
  hideLoading,
  notifyDownload,
  getDevInfo,
} from '@ray-js/ray';
import { Icon, Loading, SwipeCell } from '@ray-js/smart-ui';
import { iconClock, iconDelete, iconHeadphones } from '@/res/iconsvg';
import { useDispatch } from 'react-redux';
import { deleteAudios, fetchAudioDetail } from '@/redux/modules/audiosSlice';
import { AppDispatch } from '@/redux';
import { emitter } from '@/utils';
import Strings from '@/i18n';
import { useActions, useProps } from '@ray-js/panel-sdk';
import dpCodes from '@/config/dpCodes';
import clsx from 'clsx';
import Checkbox from '@/components/Checkbox';

import { CreateInnerAudioContextTask } from '@/types';
import styles from './index.module.less';
import { VoiceContext } from '.';

type Props = {
  data: Audio;
  current: string;
  onPlay: (fileNo: string) => void;
};

const AudioItem: FC<Props> = memo(({ data, current, onPlay }) => {
  const { fileNo, publicUrl, fileName } = data;
  const { devId } = getDevInfo();
  const dispatch = useDispatch();
  const actions = useActions();
  const { edit, selectedIds, setSelectedIds } = useContext(VoiceContext);
  const selected = selectedIds.includes(fileNo);
  const dpFileNo = useProps(props => props[dpCodes.fileNo]);
  const [isListening, setIsListening] = useState(false);
  const [btnStatus, setBtnStatus] = useState(0);

  const downloadTimer = useRef<NodeJS.Timeout>();
  const audioContext = useRef<CreateInnerAudioContextTask>();
  const [name, duration] = fileName.split('_@_');

  useEffect(() => {
    audioContext.current = createInnerAudioContext();

    audioContext.current.onTimeUpdate(({ time }) => {
      console.log('onTimeUpdate', time);
      if (time === 1) {
        audioContext.current.stop({
          success: () => {
            setIsListening(false);
          },
        });
      }
    });

    const handleAudioPlay = ListeningfileNo => {
      if (ListeningfileNo !== fileNo) {
        setIsListening(false);
      }
    };

    emitter.on('audioPlay', handleAudioPlay);

    return () => {
      audioContext.current.destroy({});

      emitter.off('audioPlay', handleAudioPlay);
    };
  }, []);

  useEffect(() => {
    if (dpFileNo.includes(fileNo) && btnStatus === 1) {
      setBtnStatus(2);
      actions[dpCodes.play].set(true);
      onPlay('');
      downloadTimer.current && clearTimeout(downloadTimer.current);

      setTimeout(() => {
        setBtnStatus(0);
      }, 2000);
    }
  }, [dpFileNo]);

  const handleSelect = () => {
    setSelectedIds(prev => {
      if (prev.includes(fileNo)) {
        return prev.filter(id => id !== fileNo);
      }

      return prev.concat(fileNo);
    });
  };

  const handleListen = async () => {
    if (isListening) {
      audioContext.current.stop({
        success: () => {
          setIsListening(false);
        },
      });
    } else {
      let src = publicUrl;

      if (!src) {
        const { publicUrl } = await (dispatch as AppDispatch)(fetchAudioDetail(fileNo)).unwrap();
        src = publicUrl;
      }

      emitter.emit('audioPlay', fileNo);

      audioContext.current.play({
        src,
        autoplay: true,
        loop: false,
        success: () => {
          setIsListening(true);
        },
      });
    }
  };

  const handleDelete = async () => {
    try {
      showLoading({
        title: '',
      });

      await (dispatch as AppDispatch)(deleteAudios([fileNo])).unwrap();
    } catch (err) {
      showToast({
        title: Strings.getLang('dsc_delete_failed'),
        icon: 'fail',
      });
    } finally {
      hideLoading();
    }
  };

  const handlePlay = async () => {
    if (current && current !== fileNo) {
      showToast({
        title: Strings.getLang('dsc_please_wait_after_last_done'),
        icon: 'none',
      });
      return;
    }

    try {
      setBtnStatus(1);
      onPlay(fileNo);
      await notifyDownload(fileNo, devId);

      downloadTimer.current = setTimeout(() => {
        setBtnStatus(0);
        onPlay('');

        showToast({
          title: Strings.getLang('dsc_download_timeout'),
          icon: 'fail',
        });
      }, 60 * 1000);
    } catch (err) {
      showToast({
        title: Strings.getLang('dsc_download_failed'),
        icon: 'fail',
      });
    }
  };

  return (
    <SwipeCell
      rightWidth={64}
      slot={{
        right: (
          <View className={styles.delete} hoverClassName="touchable" onClick={handleDelete}>
            <Icon name={iconDelete} size="24px" color="#fff" />
          </View>
        ),
      }}
    >
      <View className={styles.item}>
        {edit && (
          <Checkbox checked={selected} onChange={handleSelect} style={{ marginRight: '16rpx' }} />
        )}
        <View className={styles.btnLeft} hoverClassName="touchable" onClick={handleListen}>
          {isListening ? (
            <View className={styles.iconStop} />
          ) : (
            <Icon name={iconHeadphones} size="48rpx" color="#474849" />
          )}
        </View>
        <View className={styles.middle}>
          <Text className={styles.title}>{name}</Text>
          {isListening ? (
            <Text className={styles.desc}>{Strings.getLang('dsc_listening')}</Text>
          ) : (
            <View className={styles.middleBottom}>
              <Icon
                name={iconClock}
                size="24rpx"
                color="var(--panel-icon-lighter)"
                customStyle={{ marginRight: '16rpx' }}
              />
              <Text className={styles.desc}>{Math.round(+duration / 1000)}s</Text>
            </View>
          )}
        </View>
        <View
          className={clsx(styles.btnRight, btnStatus !== 0 && styles.active)}
          onClick={handlePlay}
        >
          {btnStatus === 1 && <Loading size="32rpx" color="#fff" customClass={styles.loading} />}
          <Text className={styles.text}>
            {btnStatus === 0
              ? Strings.getLang('dsc_play_in_device')
              : btnStatus === 1
              ? Strings.getLang('dsc_sending')
              : Strings.getLang('dsc_sent')}
          </Text>
        </View>
      </View>
    </SwipeCell>
  );
});

export default AudioItem;
