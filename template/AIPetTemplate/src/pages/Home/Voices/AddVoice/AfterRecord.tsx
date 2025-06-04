import React, { FC, useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  createInnerAudioContext,
  getAudioFileDuration,
  showLoading,
  showToast,
  hideLoading,
  fileRelationSave,
  getDevInfo,
} from '@ray-js/ray';
import { Dialog, DialogInstance, Icon } from '@ray-js/smart-ui';
import { iconPlay, iconRevert, iconTick } from '@/res/iconsvg';
import { THEME_COLOR } from '@/constant';
import clsx from 'clsx';
import Strings from '@/i18n';
import { uploadAudio } from '@/utils';
import { useDispatch } from 'react-redux';
import { fetchAudios } from '@/redux/modules/audiosSlice';
import { AppDispatch } from '@/redux';

import styles from './index.module.less';

type Props = {
  file: string;
  onRetry: () => void;
  onSave: () => void;
};

const AfterRecord: FC<Props> = ({ file, onRetry, onSave }) => {
  const dispatch = useDispatch();
  const { devId } = getDevInfo();
  const audioContext = useRef<ty.CreateInnerAudioContextTask>();
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioContext.current = createInnerAudioContext();

    audioContext.current?.onTimeUpdate?.(({ time }) => {
      if (time === 1) {
        audioContext.current?.stop?.({
          success: () => {
            setIsPlaying(false);
          },
        });
      }
    });

    getAudioFileDuration({
      path: file,
      success: res => {
        res.duration && setDuration(res.duration);
      },
    });

    return () => {
      audioContext.current?.destroy?.({});
    };
  }, [file]);

  const handleListen = () => {
    if (isPlaying) {
      audioContext.current?.stop?.({
        success: () => {
          setIsPlaying(false);
        },
      });
    } else {
      audioContext.current?.play?.({
        src: file,
        autoplay: true,
        loop: false,
        success: () => {
          setIsPlaying(true);
        },
      });
    }
  };

  const handleSave = async () => {
    try {
      const {
        data: { inputValue },
      } = await DialogInstance.input({
        context: this,
        title: Strings.getLang('dsc_input_audio_name'),
        overlayStyle: { background: 'transparent' },
        value: '',
        cancelButtonText: Strings.getLang('dsc_cancel'),
        confirmButtonText: Strings.getLang('dsc_confirm'),
        selector: '#smart-dialog-voice',
      });

      if (file) {
        try {
          showLoading({
            title: Strings.getLang('dsc_uploading'),
          });
          console.log('====22==file', file);

          const { cloudKey } = await uploadAudio(
            file,
            'pet_media-device',
            'application/octet-stream'
          );

          await fileRelationSave(
            {
              objectKey: cloudKey,
              fileName: `${inputValue}_@_${duration}`,
            },
            devId
          );

          await (dispatch as AppDispatch)(fetchAudios()).unwrap();

          onSave();
        } catch (err) {
          showToast({
            title: Strings.getLang('dsc_save_fail'),
            icon: 'fail',
          });
        } finally {
          hideLoading();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View className={styles.afterRecord}>
      <Text className={styles.duration}>{`00:${String(Math.round(duration / 1000)).padStart(
        2,
        '0'
      )}`}</Text>
      <View className={styles.row}>
        <View className={styles.item}>
          <View className={styles.iconWrapper} hoverClassName="touchable" onClick={onRetry}>
            <Icon name={iconRevert} size="128rpx" color="rgba(0, 0, 0, 0.25)" />
          </View>
          <Text className={styles.text}>{Strings.getLang('dsc_audio_add_retry')}</Text>
        </View>
        <View className={clsx(styles.item, styles.middle)}>
          <View className={styles.iconWrapper} hoverClassName="touchable" onClick={handleListen}>
            {isPlaying ? (
              <View className={styles.iconStop} />
            ) : (
              <Icon name={iconPlay} size="48rpx" color={THEME_COLOR} />
            )}
          </View>
          <Text className={styles.text}>
            {isPlaying ? Strings.getLang('dsc_listening') : Strings.getLang('dsc_listen')}
          </Text>
        </View>
        <View className={styles.item}>
          <View className={styles.iconWrapper} hoverClassName="touchable" onClick={handleSave}>
            <Icon name={iconTick} size="128rpx" color="#33d266" />
          </View>
          <Text className={styles.text} style={{ color: '#33d266' }}>
            {Strings.getLang('dsc_save')}
          </Text>
        </View>
      </View>
      <Dialog id="smart-dialog-voice" />
    </View>
  );
};

export default AfterRecord;
