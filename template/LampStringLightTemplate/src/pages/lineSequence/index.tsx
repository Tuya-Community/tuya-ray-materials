import React, { useCallback, useState, useMemo } from 'react';
import { View, Image, navigateBack, router } from '@ray-js/ray';
import { useActions, useDevice, useProps } from '@ray-js/panel-sdk';
import { TopBar } from '@/components';
import Strings from '@/i18n';
import { lampSchemaMap } from '@/devices/schema';
import { useDebugPerf } from '@/hooks/useDebugPerf';

import styles from './index.module.less';

export function LineSequence() {
  useDebugPerf(LineSequence);
  const range = useDevice(d => d.dpSchema?.light_bead_sequence?.property?.range) || [];
  const dpSchema = useDevice(d => d.dpSchema.light_bead_sequence.property);
  const light_bead_sequence = useProps(p => p.light_bead_sequence);
  const actions = useActions();
  const [lineSequence, setLineSequence] = useState(light_bead_sequence);
  const handleSave = useCallback(() => {
    actions.light_bead_sequence.set(lineSequence);
    navigateBack();
  }, [lineSequence]);

  const handleSetLineSequence = useCallback(i => {
    setLineSequence(i);
  }, []);

  const rangeI18n = useMemo(() => {
    return Strings.getRangeStrings(lampSchemaMap?.light_bead_sequence?.code, dpSchema);
  }, [dpSchema]);

  return (
    <View className={styles.lineSequenceWrapper}>
      <TopBar
        title={Strings.getLang('lineSortTitle')}
        isShowMenu={false}
        isShowLeft
        leftText={Strings.getLang('cancel')}
        rightTitle={Strings.getLang('save')}
        onRightClick={handleSave}
        onLeftClick={() => {
          router.back();
        }}
      />
      <View className={styles.lineSequenceContent}>
        <View className={styles.lineSequenceList}>
          {range.map((i, idx) => {
            const isActive = lineSequence === i;
            return (
              <View key={idx} className={styles.lineSequenceItem}>
                <View
                  className={styles.lineSequenceItemContent}
                  onClick={() => handleSetLineSequence(i)}
                  hoverClassName="button-hover"
                >
                  <View>{rangeI18n[i]}</View>
                  {isActive ? (
                    <Image className={styles.iconChecked} src="/images/icon-checked.png" />
                  ) : (
                    <View />
                  )}
                </View>
                <View className={styles.line} />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default LineSequence;
