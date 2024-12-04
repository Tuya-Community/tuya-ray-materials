import React from 'react';
import Actionsheet from '@ray-js/components-ty-actionsheet';
import DatePicker, { DatePickerProps } from '../date-picker';

interface Props extends DatePickerProps {
  visible: boolean;
  title: string;
  cancelText: string;
  okText: string;
  onCancel: () => void;
  onOk: (date: Date) => void;
  onClickOverlay: () => void;
}

export const DateActionSheet: React.FC<Props> = React.memo<Props>(props => {
  const {
    visible,
    title,
    date,
    onClickOverlay,
    onCancel,
    onOk,
    cancelText,
    okText,
    ...pickerProps
  } = props;
  const [value, setValue] = React.useState(date);

  React.useEffect(() => {
    setValue(value);
  }, [value]);

  const handleChange = React.useCallback(data => {
    setValue(data);
  }, []);

  const handleOKClick = React.useCallback(() => {
    onOk(value);
  }, [value]);

  return (
    <Actionsheet
      overlayCloseable
      position="bottom"
      show={visible}
      header={title}
      cancelText={cancelText}
      okText={okText}
      onClickOverlay={onClickOverlay}
      onCancel={onCancel}
      onOk={handleOKClick}
    >
      <DatePicker {...pickerProps} date={value} onDateChange={handleChange} />
    </Actionsheet>
  );
});

DateActionSheet.defaultProps = {
  ...DatePicker.defaultProps,
};
