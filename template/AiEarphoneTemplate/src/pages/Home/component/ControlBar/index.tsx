import React, { FC } from 'react';
import { Text, View, Image } from '@ray-js/components';
import Res from '@/res';
import { showToast } from '@ray-js/ray';
import { useDispatch, useSelector } from 'react-redux';
import { selectUiStateByKey, updateUiState } from '@/redux/modules/uiStateSlice';
import Strings from '@/i18n';
import { selectfileSync } from '@/redux/modules/fileSyncSlice';
// @ts-ignore
import styles from './index.module.less';

const ControlBar: FC = () => {
  const isSyncing = useSelector(selectfileSync);
  const dispatch = useDispatch();
  const currTab = useSelector(selectUiStateByKey('currTab'));
  const productStyle = useSelector(selectUiStateByKey('productStyle'));
  const isCardStyle = productStyle === 'card';
  const ControlBtnList = isCardStyle
    ? [
      {
        key: 'history',
        name: Strings.getLang('main_tab_history'),
        img: Res.history,
        activeImg: Res.historyActive,
      },
      {
        key: 'mode',
        name: Strings.getLang('main_tab_mode'),
        img: Res.imgMode,
        activeImg: Res.imgModeActive,
      },

      {
        key: 'setting',
        name: Strings.getLang('main_tab_setting'),
        img: Res.setting,
        activeImg: Res.settingActive,
      },
    ]
    : [
      {
        key: 'mode',
        name: Strings.getLang('main_tab_mode'),
        img: Res.imgMode,
        activeImg: Res.imgModeActive,
      },
      {
        key: 'history',
        name: Strings.getLang('main_tab_history'),
        img: Res.history,
        activeImg: Res.historyActive,
      },

      {
        key: 'setting',
        name: Strings.getLang('main_tab_setting'),
        img: Res.setting,
        activeImg: Res.settingActive,
      },
    ];

  const handleTabClick = tab => {
    if (isSyncing) {
      showToast({ title: Strings.getLang('hint_content'), icon: 'none' });
      return;
    }
    dispatch(updateUiState({ currTab: tab.key }));
  };

  return (
    <View className={styles.container}>
      {ControlBtnList.map(item => {
        const { key, img, activeImg } = item;
        return (
          <View
            key={key}
            className={styles.item}
            onClick={() => {
              handleTabClick(item);
            }}
            style={{ opacity: currTab === key ? 1 : 0.5 }}
          >
            <Image className={styles.icon} src={currTab === key ? activeImg : img} />
            <Text className={styles.title}>{item.name}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default React.memo(ControlBar);
