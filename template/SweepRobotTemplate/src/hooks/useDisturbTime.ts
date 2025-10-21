// 勿扰模式
import { PROTOCOL_VERSION } from '@/constant';
import { disturbTimeSetCode } from '@/constant/dpCodes';
import { useActions, useProps } from '@ray-js/panel-sdk';
import { decodeDoNotDisturb0x41, encodeDoNotDisturb0x40 } from '@ray-js/robot-protocol';
import { useEffect, useRef, useState } from 'react';

const defaultDoNotDisturbData = {
  enable: false,
  timeZone: 0,
  startHour: 22,
  startMinute: 0,
  endHour: 8,
  endMinute: 0,
};

// 解析定时指令
export const useDisturbTime = () => {
  const actions = useActions();
  const lastDataRef = useRef('');
  const dpValue = useProps(props => props[disturbTimeSetCode]);
  const isListeningRef = useRef(false);
  const [disturbTimeSetData, setDisturbTimeSetData] = useState<typeof defaultDoNotDisturbData>(
    defaultDoNotDisturbData
  );

  const dpChangeFunc = (value: string) => {
    if (value) {
      if (value === lastDataRef.current) return;
      lastDataRef.current = value;
      const res = decodeDoNotDisturb0x41({ command: value as string, version: PROTOCOL_VERSION });
      isListeningRef.current = true;
      setDisturbTimeSetData(res);
    }
  };

  useEffect(() => {
    if (isListeningRef.current) return;
    dpChangeFunc(dpValue);
    return () => {
      isListeningRef.current = false;
      lastDataRef.current = '';
    };
  }, [dpValue]);

  const updateDpValue = (value: typeof defaultDoNotDisturbData) => {
    const data = encodeDoNotDisturb0x40(value);
    actions[disturbTimeSetCode].set(data);
  };

  return { disturbTimeSetData, setDisturbTimeSetData, updateDpValue };
};
