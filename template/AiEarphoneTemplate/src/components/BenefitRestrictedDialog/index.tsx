import React, { FC } from 'react';
import { View, Button } from '@ray-js/ray';
import { Dialog } from '@ray-js/smart-ui';
import ThemedImage from '@/components/ThemedImage';

import Strings from '@/i18n';
import Res from '@/res';
import { useSelector, useAppDispatch } from '@/redux';
import { updateUiState } from '@/redux/modules/uiStateSlice';

import styles from './index.module.less';

const BenefitRestrictedDialog: FC = () => {
  const dispatch = useAppDispatch();
  const show = useSelector(state => state.uiState.benefitRestrictedShow);

  const handleClose = (event: any) => {
    const action = event?.detail;
    if (action !== 'confirm') {
      dispatch(updateUiState({ benefitRestrictedShow: false }));
    }
  };

  const handleConfirm = () => {
    dispatch(updateUiState({ benefitRestrictedShow: false }));
  };

  return (
    <Dialog
      show={show}
      showCancelButton={false}
      closeOnClickOverlay
      useTitleSlot
      useConfirmButtonSlot
      onClose={handleClose}
      zIndex={9999}
      customClass={styles.dialog}
    >
      <View slot="title" className={styles.titleSlot}>
        <View className={styles.content}>
          <ThemedImage
            imageName="benefitRestrictedIcon"
            src={Res.benefitRestrictedIcon}
            className={styles.benefitRestrictedIcon}
          />
          <View className={styles.textGroup}>
            <View className={styles.title}>{Strings.getLang('benefit_dialog_power')}</View>
            <View className={styles.desc}>{Strings.getLang('benefit_dialog_power_desc')}</View>
          </View>
        </View>
        <Button className={styles.btnConfirm} onClick={handleConfirm}>
          {Strings.getLang('benefit_dialog_power_confirm')}
        </Button>
      </View>
    </Dialog>
  );
};

export default BenefitRestrictedDialog;
