import React, { useMemo } from 'react';

import { getCHANGE_TYPE } from '@/constant/scenes';
import Strings from '@/i18n';
import { getArray } from '@/utils/kit';
import { View } from '@ray-js/ray';
import { SceneData } from '@/constant/type';
import { setBitValueWithOne, setBitValueWithZero } from '@ray-js/panel-sdk/lib/utils';

import { CommonSlider } from '../common-slider';
import { ConfigItem } from './ConfigItem';
import styles from './index.module.less';

export interface MotionConfigProps {
  motionId: number;
  values: Partial<SceneData>;
  onChange(values: Partial<SceneData>): void;
}

export const MotionIdsMap = {
  jianb: 1,
  duiji: 6,
  liushui: 10,
  kaihe: 16,
  fantan: 13,
  liuxin: 5,
};

export const MotionIds = Object.keys(MotionIdsMap).reduce(
  (acc, cur) => ({ ...acc, [MotionIdsMap[cur]]: cur }),
  {}
);

export const MotionConfig: React.FC<MotionConfigProps> = ({ motionId, values, onChange }) => {
  const changes = useMemo(
    () => getCHANGE_TYPE().find(item => item.id === motionId)?.options || [],
    [motionId]
  );

  return (
    <>
      {getArray(changes).map((change, i) => {
        let content = null;
        if (change.type === 'binary') {
          content = (
            <ConfigItem
              title={change.title}
              tabs={getArray(change.option).map(op => ({
                tab: op.title,
                tabKey: String(op.value),
              }))}
              value={String(values[change.field] || change.defaultValue || 0)}
              onChange={value => {
                const { position } = change;
                let v = +value;
                if (position) {
                  v = v
                    ? setBitValueWithOne(values?.setA, position)
                    : setBitValueWithZero(values?.setA, position);
                }
                onChange({
                  ...values,
                  [change.field]: v,
                });
              }}
              key={change.field}
            />
          );
        }

        if (change.type === 'number') {
          content = (
            <View style={{ paddingBottom: '20rpx' }} key={change.field}>
              <CommonSlider
                value={values[change.field] || change.defaultValue || 0}
                onAfterChange={value => {
                  onChange({
                    ...values,
                    [change.field]: value,
                  });
                }}
                min={change.min || 0}
                max={change.max || 100}
                eventName={`diyEditSpeed_${change.field}`}
                title={Strings.getLang('changeSpeed')}
                titleClassName={styles.cardSubTitle}
              />
            </View>
          );
        }

        if (content === null) {
          return <></>;
        }

        return (
          <React.Fragment key={change.field}>
            <View
              key={change.field}
              className={styles.divider}
              style={{ marginTop: '48rpx', marginBottom: '48rpx' }}
            />
            {content}
          </React.Fragment>
        );
      })}
    </>
  );
};
