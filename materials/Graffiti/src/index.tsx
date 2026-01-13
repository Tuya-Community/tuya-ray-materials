import React, { useMemo } from 'react';
import { View } from '@ray-js/ray';
import Graffiti from './components';
import { getUuid } from './utils';
import { defaultProps, IProps } from './props';

const classPrefix = 'ray-graffiti';

const RayGraffiti: React.FC<IProps> = props => {
  const canvasIdPrefix = useMemo(() => {
    return `${getUuid(classPrefix)}`;
  }, []);

  const {
    style = {},
    className = '',
    width,
    height,
    mode,
    gridSizeX,
    gridSizeY,
    pixelSizeX,
    pixelSizeY,
    pixelGap,
    pixelShape,
    pixelColor,
    penColor,
    actionType,
    needStroke,
    saveTrigger,
    clearTrigger,
    scale,
    isDragging,
    drawData,
    onStrokeChange,
    onSaveData,
  } = props;

  return (
    <View className={`${classPrefix} ${className}`} style={{ ...style }}>
      <Graffiti
        canvasIdPrefix={canvasIdPrefix}
        width={width}
        height={height}
        mode={mode}
        gridSizeX={gridSizeX}
        gridSizeY={gridSizeY}
        pixelSizeX={pixelSizeX}
        pixelSizeY={pixelSizeY}
        pixelGap={pixelGap}
        pixelShape={pixelShape}
        pixelColor={pixelColor}
        penColor={penColor}
        actionType={actionType}
        needStroke={needStroke}
        saveTrigger={saveTrigger}
        clearTrigger={clearTrigger}
        scale={scale}
        isDragging={isDragging}
        drawData={drawData}
        bindstrokeChange={e => onStrokeChange(e.detail)}
        bindsaveData={e => onSaveData(e.detail)}
      />
    </View>
  );
};

RayGraffiti.defaultProps = defaultProps;
RayGraffiti.displayName = classPrefix;

export default RayGraffiti;
