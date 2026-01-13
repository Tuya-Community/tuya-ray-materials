import React, { useState, useMemo } from 'react';
import { View, Image } from '@ray-js/ray';
import { utils } from '@ray-js/panel-sdk';
import Graffiti from '@ray-js/graffiti';
import { Decoder } from '@ray-js/code-sandbox/lib/decoder';
import clsx from 'clsx';
import ColorSelect from '../components/ColorSelect';
import Strings from '../i18n';
import {
  Eraser,
  EraserActive,
  Pencil,
  PencilActive,
  Paint,
  PaintActive,
  Plus,
  Minus,
  HandActive,
  Hand,
} from '../assets/images';

import styles from './index.module.less';

type IStrokeData = {
  points: Array<{ x: number; y: number }>;
};

type IData = {
  base64: string;
};

type ActionType = 'pencil' | 'eraser' | 'paint';

const step = 0.5;
const minScale = 1; // 最小倍数
const maxScale = 3; // 最大倍数

export function Home() {
  const [actionType, setActiontype] = useState<ActionType>('pencil');
  const [colour, setColour] = useState({
    hue: 0,
    saturation: 0,
    value: 100,
  });
  const [saveTrigger, setSaveTrigger] = useState(0);
  const [clearTrigger, setClearTrigger] = useState(0);
  const [isOpenPaint, setIsOpenPaint] = useState(false);
  const [drawData, setDrawData] = useState<any>();
  const [scale, setScale] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  console.log('[drawData]:', drawData);

  const rgbColor = useMemo(() => {
    const rgbArr = utils.hsv2rgb(colour.hue, colour.saturation, colour.value);
    const rgb = { r: rgbArr[0], g: rgbArr[1], b: rgbArr[2] };
    return rgb;
  }, [colour]);

  const handleStrokeChange = (data: IStrokeData) => {
    // eslint-disable-next-line no-console
    console.log('handleStrokeChange', data);
  };

  const handleSaveData = async (data: IData) => {
    // eslint-disable-next-line no-console
    console.log('handleSaveData', data);
  };

  const handleBtnClick = (type: ActionType) => {
    if (type === 'paint') {
      setIsOpenPaint(true);
      setActiontype(undefined);
    } else {
      setActiontype(type);
      setIsOpenPaint(false);
    }
  };

  const handleGraffitiClick = () => {
    if (isOpenPaint) {
      setActiontype('paint');
    }
  };

  const save = () => {
    setSaveTrigger(saveTrigger + 1);
  };

  const reset = () => {
    setClearTrigger(clearTrigger + 1);
  };

  // 放大
  const handleZoomIn = () => {
    if (scale < maxScale) {
      setScale(scale + step);
    }
  };

  // 缩小
  const handleZoomOut = () => {
    if (scale > minScale) {
      setScale(scale - step);
    }
  };

  const scalePercent = useMemo(() => {
    return `${scale * 100}%`;
  }, [scale]);

  return (
    <>
      <View className={styles.pageWrap}>
        <View className={styles.container}>
          <View className={styles.pixelGraffitiBox} onClick={handleGraffitiClick}>
            <Graffiti
              style={{ border: '4rpx solid rgba(255, 255, 255, 0.15)' }}
              penColor={`rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`}
              actionType={actionType}
              needStroke
              saveTrigger={saveTrigger}
              clearTrigger={clearTrigger}
              onStrokeChange={handleStrokeChange}
              onSaveData={handleSaveData}
              drawData={drawData}
              scale={scale}
              isDragging={isDragging}
            />
          </View>
          <View className={styles.actionBox}>
            <View className={styles.actionWrap}>
              <View className={styles.toolBox}>
                <View style={{ width: '582rpx', height: '354rpx' }}>
                  <ColorSelect colour={colour} setColour={setColour} />
                </View>
                <View className={styles.btns}>
                  <View className={styles.btn} onClick={() => handleBtnClick('pencil')}>
                    <Image
                      className={styles.icon}
                      src={actionType === 'pencil' ? PencilActive : Pencil}
                      mode="aspectFill"
                    />
                  </View>
                  <View className={styles.btn} onClick={() => handleBtnClick('eraser')}>
                    <Image
                      className={styles.icon}
                      src={actionType === 'eraser' ? EraserActive : Eraser}
                      mode="aspectFill"
                    />
                  </View>
                  <View className={styles.btn} onClick={() => handleBtnClick('paint')}>
                    <Image
                      className={styles.icon}
                      src={isOpenPaint ? PaintActive : Paint}
                      mode="aspectFill"
                    />
                  </View>
                </View>
              </View>

              <View className={styles.zoomWrap}>
                <View className={styles.moveIcon} onClick={() => setIsDragging(!isDragging)}>
                  {isDragging ? (
                    <Image className={styles.hand} src={HandActive} />
                  ) : (
                    <Image className={styles.hand} src={Hand} />
                  )}
                </View>
                <View className={styles.zoomBtns}>
                  <View
                    className={clsx(styles.zonmBtn, {
                      [styles.disabled]: scale <= minScale,
                    })}
                    onClick={handleZoomOut}
                  >
                    <Image className={styles.icon} src={Minus} />
                  </View>
                  <View>{scalePercent}</View>
                  <View
                    className={clsx(styles.zonmBtn, {
                      [styles.disabled]: scale >= maxScale,
                    })}
                    onClick={handleZoomIn}
                  >
                    <Image className={styles.icon} src={Plus} />
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className={styles.footer}>
            <View className={`${styles.btn} ${styles.reset}`} onClick={reset}>
              {Strings.getLang('clear')}
            </View>
            <View className={styles.btn} onClick={save}>
              {Strings.getLang('save')}
            </View>
          </View>
        </View>
      </View>
      <Decoder
        onCodeChange={data => {
          console.log(`[Decoder]`, data);
          try {
            const result =
              typeof data === 'string' ? JSON.parse(data) : Array.isArray(data) ? data : null;
            setDrawData(Array.isArray(result) ? result.flat() : null);
          } catch (error) {
            console.log(error);
          }
        }}
      />
    </>
  );
}

export default Home;
