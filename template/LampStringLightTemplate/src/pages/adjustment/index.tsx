import React, { useState } from 'react';
import { router, showToast, View } from '@ray-js/ray';
import { TopBar } from '@/components';
import Strings from '@/i18n';
import Card from '@/components/card';

import { Dialog, DialogInstance } from '@ray-js/smart-ui';
import { useActions, useDpSchema, useProps } from '@ray-js/panel-sdk';
import styles from './index.module.less';

export function Adjustment() {
  const schema = useDpSchema();
  const segmentNumSetMinMax = schema?.segment_num_set?.property || { max: 0, min: 0 };
  const ledNumberSetMinMax = schema?.led_number_set?.property || { max: 0, min: 0 };

  const segment_num_set = useProps(p => p.segment_num_set);
  // @ts-ignore
  const led_number_set = useProps(p => p.led_number_set);

  const actions = useActions();

  const handleClickLightTotalNum = () => {
    DialogInstance.input({
      selector: '#adjustment-smart-dialog1',
      title: Strings.getLang('lightTotalNum'),
      value: led_number_set,
      placeholder: `${ledNumberSetMinMax.min} ~ ${ledNumberSetMinMax.max}`,
      cancelButtonText: Strings.getLang('cancel'),
      cancelButtonColor: 'rgba(0, 0, 0, 0.7)',
      confirmButtonText: Strings.getLang('confirm'),
      confirmButtonColor: 'rgba(16, 130, 254, 1)',
      beforeClose(action, value) {
        if (action === 'confirm') {
          // @ts-nocheck
          if (
            +value !== +value ||
            Number(value) < ledNumberSetMinMax.min ||
            Number(value) > ledNumberSetMinMax.max
          ) {
            showToast({
              title: Strings.getLang('pleaseInputCorrectNum'),
              duration: 2000,
              icon: 'error',
            });
            return false;
          }
        }
        return true;
      },
    })
      .then(res => {
        const { inputValue } = res?.data || {};
        if (inputValue === undefined) {
          console.error('inputValue is undefined');
          return;
        }
        // @ts-ignore
        actions?.led_number_set?.set(Number(inputValue));
      })
      .catch(err => {
        console.warn(err);
      });
  };

  const handleClickShowSegments = () => {
    DialogInstance.input({
      selector: '#adjustment-smart-dialog2',
      title: Strings.getLang('showSegments'),
      value: `${segment_num_set}`,
      placeholder: `${segmentNumSetMinMax.min} ~ ${segmentNumSetMinMax.max}`,
      cancelButtonText: Strings.getLang('cancel'),
      cancelButtonColor: 'rgba(0, 0, 0, 0.7)',
      confirmButtonText: Strings.getLang('confirm'),
      confirmButtonColor: 'rgba(16, 130, 254, 1)',
      beforeClose(action, value) {
        if (action === 'confirm') {
          // @ts-nocheck
          if (
            +value !== +value ||
            Number(value) < segmentNumSetMinMax.min ||
            Number(value) > segmentNumSetMinMax.max
          ) {
            showToast({
              title: Strings.getLang('pleaseInputCorrectNum'),
              duration: 2000,
              icon: 'error',
            });
            return false;
          }
        }
        return true;
      },
    })
      .then(res => {
        const { inputValue } = res?.data || {};
        if (inputValue === undefined) {
          console.error('inputValue is undefined');
          return;
        }
        actions.segment_num_set.set(Number(inputValue));
      })
      .catch(err => {
        console.warn(err);
      });
  };

  return (
    <View className={styles.lineSequenceWrapper}>
      <TopBar
        title={Strings.getLang('applyAdjustment')}
        isShowMenu={false}
        leftText={Strings.getLang('cancel')}
        isShowLeft
        onLeftClick={() => {
          router.back();
        }}
      />

      <View className={styles.contentWrapper}>
        <View className={styles.cardWrapper}>
          <Card
            title={Strings.getLang('lightTotalNum')}
            subTitle={`(${ledNumberSetMinMax.min} ~ ${ledNumberSetMinMax.max})`}
            cardType="arrow"
            arrowLabel={`${+(led_number_set || 0)}`}
            onClick={handleClickLightTotalNum}
          />
          <Card
            title={Strings.getLang('showSegments')}
            subTitle={`(${segmentNumSetMinMax.min} ~ ${segmentNumSetMinMax.max})`}
            cardType="arrow"
            arrowLabel={`${segment_num_set}`}
            onClick={handleClickShowSegments}
          />
        </View>
      </View>
      <Dialog key={led_number_set} id="adjustment-smart-dialog1" />
      <Dialog key={segment_num_set} id="adjustment-smart-dialog2" />
    </View>
  );
}

export default Adjustment;
