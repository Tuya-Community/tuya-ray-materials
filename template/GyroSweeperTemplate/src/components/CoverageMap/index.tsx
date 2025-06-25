import React, { FC, useEffect, useState } from 'react';
import { MapApiFuncCoverageMap, parseMapData } from '@ray-js/gyro-map-sdk';
import { useMapData } from '@/hooks/useMapData';
import { getSystemInfoSync } from 'ray';
import { CoverageMapComponent } from '@ray-js/gyro-map-component';

type Props = {
  subRecordId?: string;
  onInitialized?: () => void;
};

const CoverageMap: FC<Props> = ({ subRecordId, onInitialized }) => {
  const { mapData, mapConfig } = useMapData(subRecordId);
  const [mapApiFuncs, setMapApiFuncs] = useState<MapApiFuncCoverageMap | null>(null);

  useEffect(() => {
    if (mapData && mapApiFuncs) {
      const { pointsData, currentPos } = parseMapData([mapData], mapConfig);

      mapApiFuncs.drawMap && mapApiFuncs.drawMap(pointsData);

      mapApiFuncs.drawRobot && currentPos && mapApiFuncs.drawRobot(currentPos);
    }
  }, [mapData, mapApiFuncs]);

  return (
    <CoverageMapComponent
      config={{
        containerTop: '120px',
        containerHeight: `${getSystemInfoSync().screenHeight - 120}px`,
        borderWidth: 0.5,
      }}
      onMapReady={funcs => {
        setMapApiFuncs(funcs);
        onInitialized && onInitialized();
      }}
    />
  );
};

export default CoverageMap;
