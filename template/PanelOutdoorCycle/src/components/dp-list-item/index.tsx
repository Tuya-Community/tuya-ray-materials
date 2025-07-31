import React, { useState } from 'react';
import { Text, View } from '@ray-js/ray';
import { useActions, useDevice, useProps, utils } from '@ray-js/panel-sdk';
import { Switch } from '@ray-js/smart-ui';
import { IconSvg, ActionSheetEnum } from '@/components';
import List from '@ray-js/components-ty-cell';
import { useSelector } from 'react-redux';
import { selectThemeType } from '@/redux/modules/themeSlice';
import { icons } from '@/res';
import Strings from '@/i18n';
import dpCodes from '@/constant/dpCodes';
import styles from './index.module.less';

interface Props {
  code: string;
}

export const DpListItem: React.FC<Props> = props => {
  const { code } = props;
  const { scaleNumber } = utils;
  const { devInfo } = useDevice();
  const dpState = useProps();
  const theme = useSelector(selectThemeType);
  const currentSchema = devInfo.schema?.filter(i => i.code === code)[0];
  const actions = useActions();

  const { mode, type, range, scale, unit } = currentSchema?.property;

  // ActionSheet
  const [actionSheet, setActionSheet] = useState({
    show: false,
    code: '',
  });

  const onItemClick = () => {
    setActionSheet({
      show: true,
      code: currentSchema.code,
    });
  };

  const BoolItem = (
    <Switch
      style={{ pointerEvents: 'auto' }}
      disabled={mode === 'ro'}
      checked={dpState[code] as boolean}
      activeColor="var(--app-M1)"
      onChange={event => {
        const action = actions[code];
        action.set(event.detail);
      }}
    />
  );
  const CommonItem = (
    <View className={styles['right-item']}>
      <Text>
        {type === 'value'
          ? `${scaleNumber(scale, dpState[code])}${unit}`
          : [dpCodes.speedLimitEnum, dpCodes.speedLimitE].indexOf(code) !== -1
          ? Strings.getLang(`speedLimit_${dpState[code]}_${dpState[dpCodes.unitSet]}` as any)
          : Strings.getDpLang(code, dpState[code] as string)}
      </Text>
      <IconSvg
        d={icons.arrow}
        fill={theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(51, 51, 51, 0.5)'}
        size="12px"
      />
    </View>
  );

  const itemDisabled = mode === 'ro' || type === 'bool';
  return (
    <>
      <List.Item
        key={code}
        className={styles.listItem}
        style={{ pointerEvents: itemDisabled ? 'none' : 'auto' }}
        title={Strings.getDpLang(code)}
        gap="10px"
        content={type === 'bool' ? BoolItem : CommonItem}
        onClick={() => type !== 'bool' && onItemClick()}
      />

      {/* 枚举值 */}
      <ActionSheetEnum
        show={actionSheet.show}
        code={actionSheet.code}
        onClose={() => setActionSheet({ ...actionSheet, show: false })}
        title={Strings.getDpLang(code)}
      />
    </>
  );
};
