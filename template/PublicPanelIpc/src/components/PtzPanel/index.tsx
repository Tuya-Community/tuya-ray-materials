import React from 'react';
import { View } from '@ray-js/ray';
import Ptz from '@/components/Ptz';
import Zoom from '@/components/Zoom';
import { useDevice } from '@ray-js/panel-sdk';
import Styles from './index.module.less';

const PtzPanel = () => {
  const devInfo = useDevice(device => device.devInfo);
  const { schema } = devInfo;
  const isPtz = schema.findIndex(item => item.code === 'ptz_control') !== -1;
  const isZoom = schema.findIndex(item => item.code === 'zoom_control') !== -1;

  return (
    <View className={Styles.PtzPanel}>
      <View style={{ display: isPtz ? '' : 'none' }}>
        <Ptz />
      </View>
      {isZoom && (
        <View className={!isPtz && isZoom ? Styles.justZoomWrap : Styles.zoomWrap}>
          <Zoom />
        </View>
      )}
    </View>
  );
};

export default PtzPanel;
