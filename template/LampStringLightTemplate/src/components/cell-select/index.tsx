import { Image, Text, View } from '@ray-js/ray';
import React, { useMemo, useState } from 'react';
import res from '@/res';
import { ActionSheet as ActionSheetComponent } from '@ray-js/smart-ui';
import { getArray, splitArray } from '@/utils/kit';
import Strings from '@/i18n';
import styles from './index.module.less';

export interface CellSelectProps {
  modalTitle: string;
  list: Array<{ title: string; id: number }>;
  current: number;
  onChange(id: number): void;
}

export const CellSelect: React.FC<CellSelectProps> = ({ modalTitle, list, onChange, current }) => {
  const [show, setShow] = useState(false);

  const data = splitArray(list, 3);

  const currentItme = useMemo(() => getArray(list).find(item => +item.id === +current), [current]);

  return (
    <>
      <View className={styles.contain} hoverClassName="button-hover" onClick={() => setShow(true)}>
        <Text className={styles.title}>{currentItme?.title}</Text>
        <Image className={styles.icon} mode="aspectFit" src={res.cell_right} />
      </View>
      <ActionSheetComponent
        title={modalTitle}
        show={show}
        cancelText={Strings.getLang('cancel')}
        confirmText={null}
        onCancel={() => {
          setShow(false);
        }}
        onClickOverlay={() => {
          setShow(false);
        }}
      >
        <View className={styles.modalContent}>
          {data.map((item, i) => (
            <View className={styles.row} key={i}>
              {item.map(item => (
                <View
                  hoverClassName="button-hover"
                  onClick={() => {
                    onChange(item.id);
                    setShow(false);
                  }}
                  key={item.id}
                  style={{
                    background: +current === +item.id ? '#0d84ff' : 'rgba(0, 0, 0, 0.05)',
                    color: +current === +item.id ? '#fff' : 'rgba(0, 0, 0, 0.9)',
                  }}
                  className={styles.item}
                >
                  {item.title}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ActionSheetComponent>
    </>
  );
};
