import React, { useState } from 'react';
import { ActionSheet as ActionSheetComponent } from '@ray-js/smart-ui';
import { Image, router, View } from 'ray';
import res from '@/res';
import Strings from '@/i18n';
import { dpCodes } from '@/constant/dpCodes';
import { useProps } from '@ray-js/panel-sdk';
import styles from './index.module.less';
import { HoverView } from '../hover-view';

export interface DiyTypeModalProps {
  show: boolean;
  onCancel: VoidFunction;
  onShowTip: (tip: string) => void;
}

type CardProps = {
  title: string;
  onClick: VoidFunction;
  style?: React.CSSProperties;
};

const Card: React.FC<CardProps> = ({ title, onClick, style }) => (
  <HoverView className={styles.cardContain} onClick={onClick} style={style}>
    <View style={{ display: 'flex' }}>
      {[45, 46].map(id => (
        <Image
          style={{
            width: '75px',
            height: '44px',
          }}
          mode="aspectFill"
          key={id}
          src={res[`diy_modal_icon${id}`]}
        />
      ))}
    </View>
    <View style={{ display: 'flex' }}>
      {[43, 40, 44].map(id => (
        <Image
          style={{
            width: '50px',
            height: '44px',
          }}
          mode="aspectFill"
          key={id}
          src={res[`diy_modal_icon${id}`]}
        />
      ))}
    </View>
    <View className={styles.cardTitle}>{title}</View>
  </HoverView>
);

export const DiyTypeModal: React.FC<DiyTypeModalProps> = ({ show, onCancel, onShowTip }) => {
  const ledNumber = useProps(p => p[dpCodes.led_number_set]);

  return (
    <ActionSheetComponent
      confirmText={null}
      show={show}
      onCancel={onCancel}
      title={Strings.getLang('chooseEffect')}
      cancelText={Strings.getLang('cancel')}
    >
      <View className={styles.cardGroup}>
        <Card
          style={{ marginRight: '5px' }}
          onClick={() => {
            router.push('/diyEdit');
            onCancel();
          }}
          title={Strings.getLang('dynamicEffects')}
        />
        <Card
          style={{ marginLeft: '5px' }}
          onClick={() => {
            if (ledNumber === 0) {
              onShowTip(Strings.getLang('diyModalTipConfigLedNum'));
              return;
            }
            router.push('/staticDiyEdit');
            onCancel();
          }}
          title={Strings.getLang('staticEffect')}
        />
      </View>
    </ActionSheetComponent>
  );
};

export interface UseDiyTypeModalOps {
  onShowTip: (tip: string) => void;
}

export const useDiyTypeModal = ({ onShowTip }: UseDiyTypeModalOps) => {
  const [show, setShow] = useState(false);
  return {
    show,
    setShow,
    modal: <DiyTypeModal onShowTip={onShowTip} show={show} onCancel={() => setShow(false)} />,
  };
};
