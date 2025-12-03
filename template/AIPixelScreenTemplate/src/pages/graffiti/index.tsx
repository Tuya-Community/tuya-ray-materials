import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAppDispatch } from '@/redux';
import { addDiysAsync } from '@/redux/modules/diySlice';
import { updateMyActiveTab } from '@/redux/modules/otherSlice';
import { View, Image, router, showToast } from '@ray-js/ray';
import Strings from '@/i18n';
import PixelGraffiti from '@/components/PixelGraffiti';
import ColorSelect from '@/components/ColorSelect';
import globalStorage from '@/redux/storage';
import md5 from 'md5';
import { useActions, useStructuredActions, utils } from '@ray-js/panel-sdk';
import { authorizeAsync } from '@/api/nativeApi';
import { getCdnPath } from '@/utils/getCdnPath';
import { Dialog, NavBar } from '@ray-js/smart-ui';
import styles from './index.module.less';

const gfDeleteIcon = getCdnPath('images/gf-delete.png');
const saveIcon = getCdnPath('images/save.png');

export function Graffiti() {
  const dispatch = useAppDispatch();
  const actions = useActions();
  const dpActions = useStructuredActions();

  const [actionType, setActiontype] = useState('pencil');
  const [colour, setColour] = useState({
    hue: 0,
    saturation: 0,
    value: 100,
  });
  const [saveTick, setSaveTick] = useState(0);
  const [clearTrigger, setClearTrigger] = useState(0);

  const [isOpenPaint, setIsOpenPaint] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const isSave = useRef(false);

  useEffect(() => {
    // 清屏
    dpActions.pixel_doodle.set({
      type: 1,
      colour: { r: 0, g: 0, b: 0 },
      minX: 0,
      minY: 0,
      maxX: 31,
      maxY: 31,
    });

    return () => {
      if (!isSave.current) {
        actions.gadget_key.set('key_exit');
      }
    };
  }, []);

  const getPixelData = async (e: any) => {
    const { base64Data } = e.detail;
    const fileName = `${new Date().getTime()}.gif`;
    const data = base64Data.split(',')[1];
    const filePath = await globalStorage.set({ key: fileName, data, encoding: 'base64' });
    const hexData = utils.base64ToRaw(data);
    const _newDiys = [
      {
        path: filePath,
        id: 60,
        md5: md5(base64Data),
        rawData: hexData,
      },
    ];
    isSave.current = true;
    dispatch(addDiysAsync(_newDiys));
    dispatch(updateMyActiveTab('diy'));
    router.back();
  };

  const getSmearChange = (e: any) => {
    const { minX, minY, maxX, maxY, hexArr } = e.detail;
    let rgb = rgbColor;
    if (actionType === 'eraser') {
      rgb = { r: 0, g: 0, b: 0 };
    }
    dpActions.pixel_doodle.set({ type: 0, colour: rgb, minX, minY, maxX, maxY, hexArr });
  };

  const rgbColor = useMemo(() => {
    const rgbArr = utils.hsv2rgb(colour.hue, colour.saturation, colour.value);
    const rgb = { r: rgbArr[0], g: rgbArr[1], b: rgbArr[2] };
    if (actionType === 'paint') {
      dpActions.pixel_doodle.set({
        type: 1,
        colour: rgb,
        minX: 0,
        minY: 0,
        maxX: 31,
        maxY: 31,
      });
    }
    return rgb;
  }, [colour]);

  const handleBtnClick = type => {
    if (type === 'paint') {
      setIsOpenPaint(true);
      setActiontype('');
    } else {
      setActiontype(type);
      setIsOpenPaint(false);
    }
  };

  const save = async () => {
    try {
      // @ts-ignore
      await authorizeAsync({ scope: 'scope.writePhotosAlbum' });
    } catch (error) {
      return;
    }
    showToast({
      title: Strings.getLang('savedSuccessfully'),
      icon: 'none',
    });
    setSaveTick(saveTick + 1);
  };

  const handlePixelGraffitiClick = () => {
    if (isOpenPaint) {
      setActiontype('paint');
      dpActions.pixel_doodle.set({
        type: 1,
        colour: rgbColor,
        minX: 0,
        minY: 0,
        maxX: 31,
        maxY: 31,
      });
    }
  };

  const clickClear = () => {
    setShowDialog(true);
  };

  const handleClear = () => {
    setClearTrigger(clearTrigger + 1);
    setShowDialog(false);
    dpActions.pixel_doodle.set({
      type: 1,
      colour: { r: 0, g: 0, b: 0 },
      minX: 0,
      minY: 0,
      maxX: 31,
      maxY: 31,
    });
  };

  return (
    <>
      <View className={styles.pageWrap}>
        <NavBar
          customClass={styles.navBar}
          title={Strings.getLang('pixelGraffiti')}
          leftArrow
          onClickLeft={() => router.back()}
        />
        <View className={styles.container}>
          <View onClick={handlePixelGraffitiClick}>
            <PixelGraffiti
              penColor={`rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`}
              actionType={actionType}
              saveTick={saveTick}
              clearTrigger={clearTrigger}
              needStroke
              bindsmearChanged={getSmearChange}
              bindgetPixelData={getPixelData}
            />
          </View>

          <View className={styles.actionWrap}>
            <View className={styles.actions}>
              <View className={styles.btns}>
                <View
                  className={
                    actionType === 'pencil'
                      ? `${styles.btn} ${styles.activePencil}`
                      : `${styles.btn} ${styles.pencil}`
                  }
                  onClick={() => handleBtnClick('pencil')}
                />
                <View
                  className={
                    actionType === 'eraser'
                      ? `${styles.btn} ${styles.activeEraser}`
                      : `${styles.btn} ${styles.eraser}`
                  }
                  onClick={() => handleBtnClick('eraser')}
                />
                <View
                  className={
                    isOpenPaint
                      ? `${styles.btn} ${styles.activePaint}`
                      : `${styles.btn} ${styles.paint}`
                  }
                  onClick={() => handleBtnClick('paint')}
                />
              </View>
              <View className={styles.delete} onClick={clickClear}>
                <Image className={styles.deleteIcon} src={gfDeleteIcon} mode="aspectFill" />
              </View>
            </View>
            <View style={{ width: '718rpx', height: '354rpx' }}>
              <ColorSelect colour={colour} setColour={setColour} trackWidth={654} />
            </View>
          </View>
          <View className={styles.footer}>
            <View className={styles.btn} onClick={save}>
              <Image className={styles.icon} src={saveIcon} mode="aspectFill" />
              {Strings.getLang('save')}
            </View>
          </View>
        </View>
      </View>
      <Dialog
        useSlot
        useTitleSlot
        width="311px"
        show={showDialog}
        showCancelButton
        useConfirmButtonSlot
        useCancelButtonSlot
        onClose={() => setShowDialog(false)}
      >
        <View className={styles.textTitle}>{Strings.getLang('deeleteCanvasContent')}</View>
        <View className={styles.cancel} onClick={() => setShowDialog(false)}>
          {Strings.getLang('cancel')}
        </View>
        <View className={styles.saveText} onClick={handleClear}>
          {Strings.getLang('confirm')}
        </View>
      </Dialog>
    </>
  );
}

export default Graffiti;
