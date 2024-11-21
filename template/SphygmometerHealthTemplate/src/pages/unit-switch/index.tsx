import React, { useCallback, useState } from 'react';
import { navigateBack, Text, View } from '@ray-js/ray';
import { Checkbox } from '@ray-js/smart-ui';

import { PageWrapper, TopBar, TouchableOpacity } from '@/components';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { updateUI } from '@/redux/action';
import { getDevId } from '@/utils';
import storage from '@/utils/netCache/storage';
import { HeightUnit, WeightUnit } from '@/utils/unit';
import styles from './index.module.less';

const heightUnits = ['cm', 'inch'];
const weightUnits = ['kg', 'lb', 'st', 'jin'];

interface Props {
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
  isDeviceOnline: boolean;
  theme?: any;
}

const UnitSwitch: React.FC<Props> = () => {
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);
  const weightUnit = useSelector(({ uiState }) => uiState.targetWeightUnit);
  const heightUnit = useSelector(({ uiState }) => uiState.targetHeightUnit);
  const [targetWeightUnit, setTargetWeightUnit] = useState(weightUnit);
  const [targetHeightUnit, setTargetHeightUnit] = useState(heightUnit);
  const handleSelectWeight = useCallback(
    async item => {
      setTargetWeightUnit(item);
    },
    [targetWeightUnit, targetHeightUnit]
  );
  const handleSelectHeight = useCallback(
    async item => {
      setTargetHeightUnit(item);
    },
    [targetWeightUnit, targetHeightUnit]
  );

  const handleSave = useCallback(() => {
    storage.setItem(`${getDevId()}targetWeightUnit`, targetWeightUnit);
    storage.setItem(`${getDevId()}targetHeightUnit`, targetHeightUnit);
    updateUI({ targetWeightUnit, targetHeightUnit });
    navigateBack();
  }, [targetWeightUnit, targetHeightUnit]);

  return (
    <>
      <TopBar right={<View />} title={Strings.getLang('dsc_UnitSwitch')} />
      <PageWrapper>
        <View className={styles.block}>
          <Text className={styles.title}>{Strings.getLang('unitWeightTitle')}</Text>
          {weightUnits.map(key => {
            const isSelected = targetWeightUnit === key;
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                className={styles.row}
                key={key}
                onClick={() => handleSelectWeight(key)}
              >
                <Text>{Strings.getLang(`${key}Unit`)}</Text>
                <Checkbox value={isSelected} />
              </TouchableOpacity>
            );
          })}
        </View>
        <View className={styles.block}>
          <Text className={styles.title}>{Strings.getLang('unitHeightTitle')}</Text>
          {heightUnits.map(key => {
            const isSelected = targetHeightUnit === key;
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                className={styles.row}
                key={key}
                onClick={() => handleSelectHeight(key)}
              >
                <Text>{Strings.getLang(`${key}Unit`)}</Text>
                <Checkbox value={isSelected} />
              </TouchableOpacity>
            );
          })}
        </View>
      </PageWrapper>

      <TouchableOpacity
        activeOpacity={0.7}
        className={styles.saveBtn}
        disabled={!targetWeightUnit || !targetHeightUnit}
        style={{
          backgroundColor: themeColor,
          opacity: !targetWeightUnit || !targetHeightUnit ? 0.3 : 1,
        }}
        onClick={handleSave}
      >
        <Text className={styles.saveTxt} style={{ color: '#fff' }}>
          {Strings.getLang('unitPageButSave')}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default UnitSwitch;
