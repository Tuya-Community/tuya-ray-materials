import { DateTimePicker } from '@ray-js/smart-ui';
import { trim } from 'lodash-es';
import React, { useCallback } from 'react';

export const TimePicker = (props: {
  time: { hour: number; minute: number };
  setTime: (v: { hour: number; minute: number }) => void;
}) => {
  const { time, setTime } = props;
  const { hour, minute } = time;

  const onTimeInput = useCallback(event => {
    const { detail } = event;
    const [hour, minute] = detail.split(':');
    setTime({
      hour: parseInt(trim(hour), 10),
      minute: parseInt(trim(minute), 10),
    });
  }, []);

  return (
    <DateTimePicker
      show-toolbar={false}
      type="time"
      value={`${hour}:${minute}`}
      onInput={onTimeInput}
    />
  );
};
