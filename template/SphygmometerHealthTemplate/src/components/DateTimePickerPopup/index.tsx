import { ComponentProps, memo, useState } from 'react';
import { DateTimePicker, Popup } from '@ray-js/smart-ui';

type DateTimePickerProps = ComponentProps<typeof DateTimePicker>;

interface Props extends DateTimePickerProps {
  show: boolean;
  onClose: () => void;
}

const DateTimePickerPopup = ({ show = false, onClose, ...otherProps }: Props) => {
  const [isReady, setIsReady] = useState(false);

  return (
    <Popup position="bottom" show={show} onBeforeEnter={() => setIsReady(true)} onClose={onClose}>
      {isReady && <DateTimePicker {...otherProps} />}
    </Popup>
  );
};

export default memo(DateTimePickerPopup);
