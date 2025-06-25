import { devices } from '@/devices';
import Strings from '@/i18n';
import { useActions, useProps } from '@ray-js/panel-sdk';
import { ActionSheet, Cell } from '@ray-js/smart-ui';
import React, { FC, useMemo } from 'react';

type PropsEnum = {
  dpCode: string;
  onClick: (dpCode) => void;
};

export const Enum: FC<PropsEnum> = ({ dpCode, onClick }) => {
  const dpValue = useProps(props => props[dpCode]);
  const text = Strings.getDpLang(dpCode, dpValue);

  return (
    <Cell title={Strings.getDpLang(dpCode)} value={text} isLink onClick={() => onClick(dpCode)} />
  );
};

type PropsEnumPopup = {
  show: boolean;
  dpCode: string;
  onHide: () => void;
};

export const EnumPopup: FC<PropsEnumPopup> = ({ show, dpCode, onHide }) => {
  const dpActions = useActions();
  const dpValue = useProps(props => props[dpCode]);
  const range = useMemo(
    () => devices.common.getDpSchema()[dpCode]?.property?.range ?? [],
    [dpCode]
  ) as string[];

  const actions = range.map(item => ({
    id: item,
    name: Strings.getDpLang(dpCode, item),
    checked: dpValue === item,
  }));

  const handleSelect = evt => {
    const { id } = evt.detail;

    dpActions[dpCode].set(id);
  };

  return (
    <ActionSheet
      show={show}
      title={Strings.getDpLang(dpCode)}
      cancelText={Strings.getLang('cancel')}
      actions={actions}
      onSelect={handleSelect}
      onCancel={onHide}
      onClose={onHide}
    />
  );
};
