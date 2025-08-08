import Strings from '@/i18n';
import { usePageEvent } from '@ray-js/ray';
import { ActionSheet, SmartEventHandler } from '@ray-js/smart-ui';
import React, { FC, useCallback, useEffect, useState } from 'react';
import CountdownPicker from '../countdown-picker';

interface Props {
  title: string;
  description?: string;
  value?: number;
  min?: number;
  max?: number;
  type?: 'second' | 'minute';
  onConfirm?: (time: number) => void;
  onClose?: SmartEventHandler;
}

export const ActionSheetTimePickerInstance: {
  show: (props: Props) => void;
  close: () => void;
} = {
  show: () => {
    console.warn('need add global ActionSheet at you page');
  },
  close: () => {
    //
  },
};

const GlobalActionSheetTimePicker: FC = () => {
  const [props, setProps] = useState<Props>({ title: '' });
  const [visible, setVisible] = useState(false);
  const [isRenderPicker, setIsRenderPicker] = useState(false);
  const [time, setTime] = useState(0);
  const show = useCallback((props: Props) => {
    setProps(props);
    // 时间有可能超出max 或小于min 这里要重新计算
    if (props.value > props.max) {
      setTime(props.min);
    } else {
      setTime(props.value ?? props.min);
    }
    setIsRenderPicker(true);
    setVisible(true);
  }, []);
  const handleConfirm = useCallback(() => {
    // @ts-ignore
    props.onConfirm && props.onConfirm(time);
    setVisible(false);
  }, [props, time]);
  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);
  const handleChange = useCallback((v) => {
    setTime(v);
  }, []);

  const handleHideComplete = useCallback(() => {
    setIsRenderPicker(false);
  }, []);

  usePageEvent('onShow', () => {
    ActionSheetTimePickerInstance.show = show;
    ActionSheetTimePickerInstance.close = handleClose;
  });
  usePageEvent('onHide', () => {
    ActionSheetTimePickerInstance.show = () => {
      console.warn('need add global ActionSheet at you page');
    };
    ActionSheetTimePickerInstance.close = () => {
      //
    };
  });
  useEffect(() => {
    ActionSheetTimePickerInstance.show = show;
    ActionSheetTimePickerInstance.close = handleClose;
  }, []);
  console.log('props', props);
  return (
    <ActionSheet
      title={props.title}
      description={props.description}
      show={visible}
      closeOnClickAction={false}
      confirmText={Strings.getLang('confirm')}
      cancelText={Strings.getLang('cancel')}
      onConfirm={handleConfirm}
      onClose={handleClose}
      onCancel={handleClose}
      onAfterLeave={handleHideComplete}
    >
      {isRenderPicker && (
        <CountdownPicker
          min={props.min}
          max={props.max}
          itemHeight={44}
          value={props.value}
          type={props.type === 'minute' ? ['hour', 'minute'] : ['minute', 'second']}
          onChange={handleChange}
        />
      )}
    </ActionSheet>
  );
};

export default GlobalActionSheetTimePicker;
