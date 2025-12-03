import React, { useMemo, useState } from 'react';
import Strings from '@/i18n';
import { View, Image } from '@ray-js/ray';
import { BottomSheet } from '@ray-js/smart-ui';
import { LabelData } from '@/types';
import { getCdnPath } from '@/utils/getCdnPath';
import styles from './index.module.less';

interface LabelSelectProps {
  labelData: LabelData;
  onSelect: (label: string) => void;
}

function LabelSelect(props: LabelSelectProps) {
  const { labelData, onSelect } = props;
  const [active, setActive] = useState(0);
  const [show, setShow] = useState(false);

  const tabList = useMemo(() => {
    return (labelData?.imageCategory || []).map(item => item.categoryName);
  }, [labelData]);

  const labelList = useMemo(() => {
    return labelData?.imageCategory[active]?.categoryLabel || [];
  }, [active, labelData]);

  const handleTabClick = item => {
    setActive(item);
    setShow(true);
  };

  const handleSelect = item => {
    onSelect(item);
    setShow(false);
  };

  if (!labelData || (labelData.imageCategory || []).length === 0) {
    return null;
  }

  return (
    <View className={styles.labelSelectwrapper}>
      <View className={styles.tabs}>
        {tabList.map((item, index) => (
          <View className={styles.tab} key={item} onClick={() => handleTabClick(index)}>
            <View>{Strings.getLang(item as any)}</View>
          </View>
        ))}
      </View>
      <BottomSheet
        customClass={styles.bottomSheetWrapper}
        round
        show={show}
        overlay={false}
        onClose={() => setShow(false)}
        iconSize="0"
      >
        <View className={styles.content}>
          <View className={styles.hearder}>
            <View className={styles.tabName}>{Strings.getLang(tabList[active] as any) || ''}</View>
            <View className={styles.closeBox} onClick={() => setShow(false)} />
          </View>
          <View className={styles.listWrapper}>
            <View className={styles.labelList}>
              {labelList.map(item => {
                return (
                  <View className={styles.labelItem} key={item} onClick={() => handleSelect(item)}>
                    <Image
                      className={styles.labelIcon}
                      src={getCdnPath(`labelIcons/${item}.png`)}
                    />
                    <View className={styles.title}>{Strings.getLang(item as any)}</View>
                    <View className={styles.arrow} />
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}

export default LabelSelect;
