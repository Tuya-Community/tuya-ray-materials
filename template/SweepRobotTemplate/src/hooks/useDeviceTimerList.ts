import { PROTOCOL_VERSION } from '@/constant';
import { deviceTimerCode } from '@/constant/dpCodes';
import { useSendDp } from '@/hooks/useSendDp';
import { useProps } from '@ray-js/panel-sdk';
import { decodeDeviceTimer0x31, encodeDeviceTimer0x30, TimerData } from '@ray-js/robot-protocol';
import { useEffect, useRef, useState } from 'react';

// 解析定时指令
export const useDeviceTimerList = () => {
  const lastTimerDataRef = useRef('');

  const deviceTimerValue = useProps(props => props[deviceTimerCode]);
  const isListeningRef = useRef(false);
  const [timerList, setTimerList] = useState<TimerData[]>([]);
  const { sendDP } = useSendDp();

  const dpChangeFunc = deviceTimerValue => {
    if (deviceTimerValue) {
      if (deviceTimerValue === lastTimerDataRef.current) return;
      lastTimerDataRef.current = deviceTimerValue;
      const res = decodeDeviceTimer0x31({
        command: deviceTimerValue as string,
        version: PROTOCOL_VERSION,
      });
      isListeningRef.current = true;
      setTimerList(res?.list || []);
    }
  };

  useEffect(() => {
    if (isListeningRef.current) return;
    dpChangeFunc(deviceTimerValue);
    return () => {
      isListeningRef.current = false;
      lastTimerDataRef.current = '';
    };
  }, [deviceTimerValue]);

  const deleteTimer = (index: number) => {
    const newList = [...timerList];
    newList.splice(index, 1);
    const data = encodeDeviceTimer0x30({
      list: newList,
      version: PROTOCOL_VERSION,
      number: newList.length,
    });
    sendDP(deviceTimerCode, data);
  };

  const updateTimer = (index: number, timerData: TimerData) => {
    const newList = [...timerList];
    newList[index] = timerData;
    const data = encodeDeviceTimer0x30({
      list: newList,
      version: PROTOCOL_VERSION,
      number: newList.length,
    });
    sendDP(deviceTimerCode, data);
  };

  const addTimer = (timerData: TimerData) => {
    const newList = [...timerList, timerData];
    const data = encodeDeviceTimer0x30({
      list: newList,
      version: PROTOCOL_VERSION,
      number: newList.length,
    });
    sendDP(deviceTimerCode, data);
  };

  return { timerList, deleteTimer, updateTimer, addTimer };
};
