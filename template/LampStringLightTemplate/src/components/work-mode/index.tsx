import Strings from '@/i18n';
import res from '@/res';
import { Image, Text, View } from '@ray-js/ray';
import React from 'react';
import { useCloudStorageKey } from '@/hooks/useCloudStorageKey';
import { WORK_MODE_PRE_COLOR_MODE, WORK_MODE_SCENE_MODE } from '@/constant';
import { useSupport } from '@ray-js/panel-sdk';
import { dpCodes } from '@/constant/dpCodes';
import { useIsSupport } from '@/hooks/useIsSupport';
import { useStopLocalMusic } from '@/hooks/useStopLocalMusic';
import styles from './index.module.less';

export interface WorkModeProps {
  current: string;
  onChange(mode: string): void;
  isFixed?: boolean;
}

export const WorkMode: React.FC<WorkModeProps> = ({ current, onChange, isFixed }) => {
  const { value } = useCloudStorageKey(WORK_MODE_PRE_COLOR_MODE, {
    defaultValue: ['colour', 'white'].includes(current) ? current : 'colour',
  });
  const { value: sceneMode, setValue: setSceneMode } = useCloudStorageKey(WORK_MODE_SCENE_MODE, {
    defaultValue: 'scene',
  });

  const isSupport = useIsSupport();

  const list = [
    {
      label: Strings.getLang('color'),
      value,
      values: ['colour', 'white'],
      icon: res.workmode_color,
      checkedIcon: res.workmode_color_check,
      activeBgColor: 'linear-gradient(45deg, rgba(0, 78, 255, 0.4) 0%, rgba(0, 194, 255, 0.4) 82%)',
      show: isSupport.isSupportLight,
    },
    {
      label: Strings.getLang('music'),
      value: 'music',
      icon: res.workmode_music,
      checkedIcon: res.workmode_music_check,
      activeBgColor:
        'linear-gradient(45deg, rgba(0, 220, 62, 0.4) 0%, rgba(227, 255, 53, 0.4) 82%)',
      show: isSupport.isSupportMusic,
      onClick: () => setSceneMode('music'),
    },
    {
      label: Strings.getLang('scene'),
      value: 'scene',
      icon: res.workmode_scene,
      checkedIcon: res.workmode_scene_check,
      activeBgColor:
        'linear-gradient(45deg, rgba(252, 188, 22, 0.4) 0%, rgba(235, 255, 0, 0.4) 82%)',
      value2: 'scene',
      onClick: () => setSceneMode('scene'),
      show: isSupport.isSupportScene,
    },
    {
      label: Strings.getLang('diy'),
      value: 'diy',
      icon: res.workmode_diy,
      checkedIcon: res.workmode_diy_check,
      activeBgColor:
        'linear-gradient(45deg, rgba(236, 13, 200, 0.4) 0%, rgba(255, 117, 254, 0.4) 82%)',
      value2: 'diy',
      onClick: () => setSceneMode('diy'),
      show: isSupport.isSupportScene,
    },
  ].filter(item => item.show);

  return (
    <View
      className={styles.contain}
      style={{
        paddingBottom: isFixed ? '48rpx' : '24rpx',
        paddingTop: isFixed ? '0px' : '12rpx',
      }}
    >
      {isFixed && <View className={styles.bg} />}
      {list.map(item => {
        let isActive = current === item.value;
        if (item.values) {
          isActive = item.values.includes(current);
        }
        if (item.value === 'scene' && current === 'scene') {
          isActive = item.value2 === sceneMode;
        }
        return (
          <View
            className={styles.item}
            key={item.label}
            style={
              isActive
                ? {
                    background: item.activeBgColor,
                  }
                : {}
            }
            hoverClassName="button-hover"
            onClick={() => {
              onChange(item.value);
              item.onClick && item.onClick();
              // 切换到其他模式，下发停止本地音乐
            }}
          >
            <Image className={styles.icon} src={isActive ? item.checkedIcon : item.icon} />
            <Text
              className={styles.text}
              style={
                isActive
                  ? {
                      color: '#fff',
                    }
                  : {}
              }
            >
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
