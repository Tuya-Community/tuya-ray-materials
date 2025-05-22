import React, { useState, useMemo } from 'react';
import { View, Image } from '@ray-js/ray';
import { utils } from '@ray-js/panel-sdk';
import Graffiti from '@ray-js/graffiti';
import ColorSelect from '../components/ColorSelect';
import Strings from '../i18n';
import Eraser from '../assets/images/eraser.png';
import EraserActive from '../assets/images/eraser-active.png';
import Pencil from '../assets/images/pencil.png';
import PencilActive from '../assets/images/pencil-active.png';
import Paint from '../assets/images/paint.png';
import PaintActive from '../assets/images/paint-active.png';
import styles from './index.module.less';

type IStrokeData = {
  points: Array<{ x: number; y: number }>;
};

type IData = {
  base64: string;
};

export function Home() {
  const [actionType, setActiontype] = useState<'pencil' | 'eraser' | 'paint'>('pencil');
  const [colour, setColour] = useState({
    hue: 0,
    saturation: 0,
    value: 100,
  });
  const [saveTrigger, setSaveTrigger] = useState(0);
  const [clearTrigger, setClearTrigger] = useState(0);
  const [isOpenPaint, setIsOpenPaint] = useState(false);

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

  const handleBtnClick = (type: string) => {
    if (type === 'paint') {
      setIsOpenPaint(true);
      setActiontype('');
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

  return (
    <>
      <View className={styles.pageWrap}>
        <View className={styles.container}>
          <View onClick={handleGraffitiClick}>
            <Graffiti
              style={{ border: '4rpx solid rgba(255, 255, 255, 0.15)' }}
              penColor={`rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`}
              actionType={actionType}
              needStroke
              saveTrigger={saveTrigger}
              clearTrigger={clearTrigger}
              onStrokeChange={handleStrokeChange}
              onSaveData={handleSaveData}
            />
          </View>

          <View className={styles.actionWrap}>
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
    </>
  );
}

export default Home;
