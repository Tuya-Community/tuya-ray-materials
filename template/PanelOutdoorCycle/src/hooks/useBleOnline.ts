import { useCallback, useState, useEffect } from 'react';
import {
  getBLEOnlineState,
  onBLEConnectStatusChange,
  offBLEConnectStatusChange,
  onBluetoothAdapterStateChange,
  offBluetoothAdapterStateChange,
  subscribeBLEConnectStatus,
  unsubscribeBLEConnectStatus,
} from '@ray-js/ray';

const useBleOnline = devId => {
  const [isBleOnline, setIsBleOnline] = useState(false);

  const handleBluetoothAdapterStateChange = useCallback(
    data => {
      if (!data.available) {
        setIsBleOnline(false);
      }
      if (!isBleOnline && data.available) {
        setIsBleOnline(true);
      }
    },
    [isBleOnline, setIsBleOnline]
  );

  const handleBleConnectStatusChange = useCallback(
    data => {
      if (data.deviceId === devId) {
        setIsBleOnline(data.status === 'CONNECTED');
      }
    },
    [devId]
  );

  useEffect(() => {
    subscribeBLEConnectStatus({ deviceId: devId });
    getBLEOnlineState({
      deviceId: devId,
      success: data => {
        if (typeof data.isOnline !== 'undefined') {
          setIsBleOnline(data.isOnline);
        }
      },
    });
    onBluetoothAdapterStateChange(handleBluetoothAdapterStateChange);
    onBLEConnectStatusChange(handleBleConnectStatusChange);
    return () => {
      unsubscribeBLEConnectStatus({ deviceId: devId });
      offBluetoothAdapterStateChange(handleBluetoothAdapterStateChange);
      offBLEConnectStatusChange(handleBleConnectStatusChange);
    };
  }, []);

  return { isBleOnline };
};
export default useBleOnline;
