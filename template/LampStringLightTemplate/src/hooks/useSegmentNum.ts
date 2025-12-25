import { dpCodes } from '@/constant/dpCodes';
import { devices } from '@/devices';
import { getGroupDeviceListFromDevInfo } from '@/utils/getGroupDeviceListFromDevInfo';
import { useActions, useProps } from '@ray-js/panel-sdk';
import { useEffect, useRef, useState } from 'react';

const DEFAULT_LED_STRIP = 1;
export const useSegmentNum = () => {
  const segment_num_set = useProps(p => p.segment_num_set);
  const led_number_set = useProps(p => p.led_number_set);
  const [groupLedNumber, setGroupLedNumber] = useState(-1);
  const actions = useActions();
  const { storage } = devices.common.model.abilities;
  const loadRef = useRef(false);

  useEffect(() => {
    if (loadRef.current) {
      return;
    }
    const devInfo = devices.common.getDevInfo();
    const groupId = devInfo?.groupId;
    if (groupId) {
      const key = `seg_${groupId}`;
      storage.get(key).then(res => {
        console.log(`${key}:`, res);
        if (res?.data) {
          loadRef.current = true;
          return;
        }
        getGroupDeviceListFromDevInfo({
          groupId,
          success(res) {
            const { deviceList = [] } = res;
            if (!deviceList.length) {
              return;
            }
            const supportDeviceList = [];
            deviceList.forEach(item => {
              const { schema } = item as unknown as {
                schema: {
                  code: string;
                }[];
              };
              if (schema.some(item => item.code === 'paint_colour_1')) {
                supportDeviceList.push(item);
              }
            });
            if (!supportDeviceList?.[0]) {
              return;
            }
            storage.set(key, segment_num_set);
            const { dps, schema = [] } = supportDeviceList?.[0] || {};
            const dpId = schema.find(item => item.code === dpCodes.segment_num_set)?.id;
            const ledNumber = dps[dpId];
            const segmentNum = ledNumber ?? DEFAULT_LED_STRIP;
            segment_num_set !== segmentNum && actions.segment_num_set.set(segmentNum);
            setGroupLedNumber(segmentNum);

            const ledNumberSetDpId = schema.find(item => item.code === dpCodes.led_number_set)?.id;
            const ledNumberSet = dps[ledNumberSetDpId];
            led_number_set !== ledNumberSet && actions.led_number_set.set(ledNumberSet);
          },
        });
      });
    }
  }, [segment_num_set, led_number_set]);
  return groupLedNumber > 0 ? groupLedNumber : segment_num_set;
};
