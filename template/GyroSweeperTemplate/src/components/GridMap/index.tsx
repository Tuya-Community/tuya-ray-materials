import React, { FC, useEffect, useState } from 'react';
import { MapApiFuncGridMap, parseGridMapData } from '@ray-js/gyro-map-sdk';
import { useMapData } from '@/hooks/useMapData';
import { getSystemInfoSync } from 'ray';
import { GridMapComponent } from '@ray-js/gyro-map-component';

type Props = {
  subRecordId?: string;
  onInitialized?: () => void;
};

const GridMap: FC<Props> = ({ subRecordId, onInitialized }) => {
  const { mapData, mapConfig } = useMapData(subRecordId);
  const [mapApiFuncs, setMapApiFuncs] = useState<MapApiFuncGridMap | null>(null);

  useEffect(() => {
    if (mapData && mapApiFuncs) {
      const gridMapData = parseGridMapData([mapData], mapConfig, false);

      const { mapData: convertedMapData, pathData: convertedPathData, pilePosition } = gridMapData;

      mapApiFuncs.drawMap(convertedMapData);
      convertedPathData.length > 0 && mapApiFuncs.drawCleanPath(convertedPathData);

      pilePosition &&
        convertedMapData.data?.length > 1 &&
        mapApiFuncs.drawChargingStation(pilePosition);
    }
  }, [mapData, mapApiFuncs]);

  return (
    <GridMapComponent
      config={{
        containerTop: '120px',
        containerHeight: `${getSystemInfoSync().screenHeight - 120}px`,
        showPath: false,
      }}
      onMapReady={funcs => {
        setMapApiFuncs(funcs);
        onInitialized && onInitialized();
      }}
    />
  );
};

export default GridMap;
