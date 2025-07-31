import React, { useCallback, useEffect, useState } from 'react';
import { ActionSheet } from '@ray-js/smart-ui';
import { useDevice, useProps, useActions } from '@ray-js/panel-sdk';
import Strings from '@/i18n';

export const ActionSheetEnum = ({ title, code, show, onClose }) => {
  const actions = useActions();
  const dpSchema = useDevice(device => device.dpSchema);
  const dpState = useProps();

  const [actionSheetShow, setActionSheetShow] = useState(false);
  const [actionsList, setActionsList] = useState([]);

  useEffect(() => {
    setActionSheetShow(show);
    if (show) {
      const codeSchema = dpSchema[code];
      const dataSource = codeSchema.property?.range || [];
      console.log('dataSource :>> ', dataSource);
      const data = dataSource.map((item, index) => {
        return { id: item, name: Strings.getDpLang(code, item), checked: dpState[code] === item };
      });
      setActionsList(data);
    }
  }, [show]);

  return (
    <ActionSheet
      show={actionSheetShow}
      title={title}
      cancelText={I18n.t('cancel')}
      actions={actionsList}
      zIndex={1000}
      nativeDisabled
      onSelect={evt => {
        const { id } = evt.detail;
        actions[code].set(id, { pipelines: [6, 5, 4, 3, 2, 1] });
        onClose();
      }}
      onCancel={onClose}
    />
  );
};
