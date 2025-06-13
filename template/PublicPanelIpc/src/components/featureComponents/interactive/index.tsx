import React, { useMemo } from 'react';
import { View, ScrollView } from '@ray-js/ray';
import { useActions, useProps, useDpSchema } from '@ray-js/panel-sdk';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { PopupTitle } from '@/components/popup-title';
import { IconFont } from '@/components/icon-font';
import { selectPanelInfoByKey } from '@/redux/modules/panelInfoSlice';
import Strings from '@/i18n';

import styles from './index.module.less';

const iconMap = {
  '0': 'move-control-rotate-place',
  '1': 'move-control-straight-line',
  '2': 'move-control-8',
  '3': 'move-control-rotation',
  '4': 'move-control-big-rotation',
  '5': 'move-control-z',
  '6': 'move-control-wave',
  '7': 'move-control-p-steering',
  '8': 'move-control-chacha',
  '9': 'tange1',
  '10': 'move-control-waltz',
};

interface IProps {}

export const Interactive: React.FC<IProps> = (props: IProps) => {
  const actions = useActions();
  const { state, ipc_manual_petting } = useProps(props => ({
    ipc_manual_petting: props.ipc_manual_petting,
    state: props.ipc_manual_petting_state,
  }));
  const handClick = (value: string) => {
    actions.ipc_manual_petting.set(value);
  };
  const brandColor = useSelector(selectPanelInfoByKey('brandColor'));
  const dpSchema = useDpSchema();

  const menu = useMemo(() => {
    if (!dpSchema?.ipc_manual_petting?.property?.range) return [];
    return dpSchema.ipc_manual_petting.property.range.map(key => ({
      key,
      label: I18n.t(`dp_ipc_manual_petting_${key}`),
      iconName: iconMap[key],
    }));
  }, []);
  return (
    // @ts-ignore
    <View className={styles.comContainer} style={{ '--brandColor': brandColor }}>
      <PopupTitle title={Strings.getLang('homeFeatureInteractiveMenuTitle')} />
      <ScrollView scrollY style={{ flex: 1 }} className={styles.contentWrapper}>
        <View className={styles.grid}>
          {menu.map(item => (
            <View key={item.key} className={styles.itemWarp}>
              <View
                onClick={() => handClick(item.key)}
                className={clsx(styles.item, {
                  [styles.activeItem]: ipc_manual_petting === item.key && state,
                })}
              >
                <View className={styles.iconWarp}>
                  <IconFont icon={item.iconName} otherClassName={styles.icon} />
                </View>
                <View className={clsx(styles.itemTitle, 'ellipsis-2-lines')}>{item.label}</View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
