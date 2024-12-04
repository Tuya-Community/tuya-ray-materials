import Strings from '@/i18n';
import Res from '@/res';
import { Button, Image, Input, Text, View, nativeDisabled } from '@ray-js/ray';
import React, { FC, useEffect, useState } from 'react';
import { Grid, GridItem, Popup } from '@ray-js/smart-ui';
import { stringToByte } from '@ray-js/robot-protocol';
import { THEME_COLOR } from '@/constant';

import styles from './index.module.less';

type Props = {
  show: boolean;
  onConfirm: (hexId: string) => void;
  onCancel: () => void;
};

const FLOOR_MATERIAL_LIST = [
  {
    name: Strings.getLang('dsc_floor_material_type_0'),
    hexId: '00',
    image: Res.floorMaterialDefault,
  },
  {
    name: Strings.getLang('dsc_floor_material_type_1'),
    hexId: '01',
    image: Res.floorMaterialCeramic,
  },
  {
    name: Strings.getLang('dsc_floor_material_type_2'),
    hexId: '02',
    image: Res.floorMaterialWoodHorizontal,
  },
];

const FloorMaterialPopLayout: FC<Props> = ({ show, onCancel, onConfirm }) => {
  const iconColor = THEME_COLOR;

  const _onCancel = () => {
    onCancel && onCancel();
  };

  const _onConfirm = (hexId: string) => {
    onConfirm && onConfirm(hexId);
  };

  useEffect(() => {
    nativeDisabled(show as any);
  }, [show]);

  return (
    <Popup
      show={show}
      position="center"
      round
      safeAreaInsetBottom={false}
      customStyle={{ marginBottom: 0, backgroundColor: 'transparent' }}
      overlayStyle={{ background: 'rgba(0, 0, 0, 0.4)' }}
      closeable
      closeIconPosition="top-right"
      onClickOverlay={_onCancel}
      onClose={_onCancel}
    >
      <View className={styles.container}>
        <Grid columnNum={3} border={false} className={styles.content}>
          {FLOOR_MATERIAL_LIST.map(item => {
            return (
              <GridItem
                text={item.name}
                key={item.name}
                onClick={() => _onConfirm(item.hexId)}
                iconClass={styles.imageItemWrapper}
                slot={{
                  icon: <Image src={item.image} className={styles.imageItem} />,
                }}
              />
            );
          })}
        </Grid>
      </View>
    </Popup>
  );
};

export default FloorMaterialPopLayout;
