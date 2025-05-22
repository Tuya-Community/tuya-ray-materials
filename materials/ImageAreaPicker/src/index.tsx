import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Image, MovableArea, MovableView, getSystemInfoSync } from '@ray-js/ray';
import { defaultProps, IProps } from './props';
import UnionTop from './images/union-top.png';
import UnionBottom from './images/union-bottom.png';
import './index.less';

const classPrefix = 'rayImageAreaPicker';

let _systemInfoResult = null;
export const getSystemInfoResult = () => {
  if (_systemInfoResult) {
    return _systemInfoResult;
  }
  try {
    const info = getSystemInfoSync();
    _systemInfoResult = info;
    return _systemInfoResult;
  } catch (err) {
    return {
      windowHeight: 667,
      windowWidth: 375,
      pixelRatio: 2,
    };
  }
};

// 获取真实的px
const getDeviceRealPx = px => {
  const info = getSystemInfoResult();
  return Math.round(px * (info.windowWidth / 375));
};

const RayImageAreaPicker: React.FC<IProps> = props => {
  const {
    className,
    style,
    filePath,
    imgWidth,
    imgHeight,
    width,
    height,
    backgroundColor,
    maskBgColor,
    isShowBox,
    onTouchMove,
    onTouchEnd,
    onError,
  } = props;

  const getPixelRatio = useCallback(() => {
    const { pixelRatio } = getSystemInfoResult();
    return pixelRatio;
  }, []);

  const getRealWidth = useCallback(() => {
    return getDeviceRealPx(width);
  }, []);

  const getRealHeight = useCallback(() => {
    return getDeviceRealPx(height);
  }, []);

  const pixelRatio = getPixelRatio();

  const realWidth = getRealWidth();

  const realHeight = getRealHeight();

  const [imgInfo, setImgInfo] = useState({
    width: imgWidth,
    height: imgHeight,
    filePath,
    xOffset: 0,
    yOffset: 0,
  });

  useEffect(() => {
    setImgInfo({
      width: imgWidth,
      height: imgHeight,
      filePath,
      xOffset: 0,
      yOffset: 0,
    });
  }, [filePath, imgWidth, imgHeight]);

  const curPos = useRef({ x: 0, y: 0 });

  const handleMove = e => {
    curPos.current = { x: e.detail.x, y: e.detail.y };
    const info = handleTouch(e.detail.x, e.detail.y);
    onTouchMove && onTouchMove({ ...info });
  };

  const handleTouchEnd = e => {
    const { x, y } = curPos.current;
    const info = handleTouch(x, y);
    onTouchEnd && onTouchEnd({ ...info });
  };

  const handleTouch = (x: number, y: number) => {
    const { width, height } = imgInfo;

    const topLeftX = Math.ceil(Math.abs(x) * pixelRatio);
    const topLeftY = Math.ceil(Math.abs(y) * pixelRatio);
    let bottomRightX = topLeftX + realWidth * pixelRatio;
    let bottomRightY = topLeftY + realHeight * pixelRatio;

    if (bottomRightX > width) {
      bottomRightX = width;
    }
    if (bottomRightY > height) {
      bottomRightY = height;
    }

    return {
      topLeftX,
      topLeftY,
      bottomRightX,
      bottomRightY,
    };
  };

  return (
    <View className={`${classPrefix} ${className}`} style={{ ...style }}>
      <View className={`${classPrefix}__editImgPreviewWrapper`} onTouchEnd={handleTouchEnd}>
        <MovableArea
          className={`${classPrefix}__movableArea`}
          style={{ width: `${realWidth}px`, height: `${realHeight}px`, backgroundColor }}
        >
          <MovableView
            className={`${classPrefix}__movableView`}
            style={{
              width: `${Math.ceil(imgInfo?.width / pixelRatio)}px`,
              height: `${Math.ceil(imgInfo?.height / pixelRatio)}px`,
            }}
            direction="all"
            animation={false}
            onChange={handleMove}
          >
            {imgInfo.filePath && (
              <Image
                className={`${classPrefix}__editImg`}
                src={imgInfo.filePath}
                mode="aspectFill"
                onError={onError as any}
              />
            )}
          </MovableView>
        </MovableArea>
        <View
          className={`${classPrefix}__editImgMask`}
          style={{ width: `${realWidth}px`, height: `${realHeight}px`, borderColor: maskBgColor }}
        >
          {isShowBox && (
            <>
              <Image
                className={`${classPrefix}__unionTop`}
                style={{ width: `${realWidth}px` }}
                src={UnionTop}
                mode="scaleToFill"
              />
              <Image
                className={`${classPrefix}__unionBottom`}
                style={{ width: `${realWidth}px` }}
                src={UnionBottom}
                mode="scaleToFill"
              />
            </>
          )}
        </View>
      </View>
    </View>
  );
};

RayImageAreaPicker.defaultProps = defaultProps;
RayImageAreaPicker.displayName = 'RayImageAreaPicker';

export default RayImageAreaPicker;
