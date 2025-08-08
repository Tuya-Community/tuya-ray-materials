import { usePageEvent } from '@ray-js/ray';
import { ActionSheet, SmartAction, SmartEventHandler } from '@ray-js/smart-ui';
import React, { FC, useCallback, useEffect, useState } from 'react';

type Action = { value: string | number } & SmartAction;

interface Props {
  title: string;
  description?: string;
  actions: Action[];
  onSelect?: SmartEventHandler<Action>;
  onConfirm?: SmartEventHandler<Action[]>;
  onClose?: SmartEventHandler;
}

export const ActionSheetInstance: {
  show: (props: Props) => void;
  close: () => void;
} = {
  show: () => {
    console.warn('need add global ActionSheet at you page');
  },
  close: () => {},
};

const GlobalActionSheet: FC = () => {
  const [props, setProps] = useState<Props>({ title: '', actions: [] });
  const [visible, setVisible] = useState(false);
  const [actions, setActions] = useState([]);
  const show = useCallback((props: Props) => {
    setProps(props);
    setActions(props.actions);
    setVisible(true);
  }, []);
  const handleConfirm = useCallback(() => {
    // @ts-ignore
    props.onConfirm && props.onConfirm({ detail: actions.filter((item) => item.checked) });
    setVisible(false);
  }, [props, actions]);
  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);
  const handleSelection = useCallback(
    (event) => {
      const { detail } = event;
      setActions((list) => {
        return list.map((item) => {
          if (detail.value === item.value) {
            item.checked = !item.checked;
          }
          return item;
        });
      });
      if (props.onSelect) {
        props.onSelect(event);
        setVisible(false);
      }
    },
    [props],
  );

  usePageEvent('onShow', () => {
    ActionSheetInstance.show = show;
    ActionSheetInstance.close = handleClose;
  });
  usePageEvent('onHide', () => {
    ActionSheetInstance.show = () => {
      console.warn('need add global ActionSheet at you page');
    };
    ActionSheetInstance.close = () => {};
  });
  useEffect(() => {
    ActionSheetInstance.show = show;
    ActionSheetInstance.close = handleClose;
  }, []);

  return (
    <ActionSheet
      {...props}
      show={visible}
      closeOnClickAction={false}
      confirmText={!props.onSelect ? I18n.t('confirm') : ''}
      cancelText={I18n.t('cancel')}
      onSelect={handleSelection}
      onConfirm={handleConfirm}
      onClose={handleClose}
      onCancel={handleClose}
    />
  );
};

export default GlobalActionSheet;
