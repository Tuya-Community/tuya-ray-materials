import { View } from '@ray-js/ray';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useActions, useStructuredActions, useStructuredProps, utils } from '@ray-js/panel-sdk';
import { useLampRoad } from '@/hooks/useLampRoad';
import { lightStripDataKey } from '@/constant';

import { WORK_MODE } from '@/types';
import { useSegmentNum } from '@/hooks/useSegmentNum';
import { useThrottleFn } from 'ahooks';
import { isEqual } from 'lodash-es';
import { useSetStorageData } from '@/hooks/useStorageData';
import { actions, useSelector } from '@/redux';
import { useDispatch } from 'react-redux';
import LightStrip from '../light-strip';
import WhiteLight from './whiteLight';
import ColorLight from './colorLight';
import { LightTab } from '../light-tab';

const { hsv2rgbString, brightKelvin2rgb } = utils;

type HSVFull = {
  hue: number;
  saturation: number;
  value: number;
};

type BTFull = {
  temperature: number;
  bright: number;
};

type HSV = {
  h: number;
  s: number;
  v: number;
};

type BT = {
  t: number;
  b: number;
};
/** 涂抹类型 */
enum SmearMode {
  all,
  single,
  clear,
}
/** 调光器模式 */
enum DimmerMode {
  white,
  colour,
  colourCard,
  combination,
}

export type LightProps = {
  colorMode: string;
  onChangeColorMode: (colorMode: string) => void;
};

export const Light = ({ colorMode, onChangeColorMode }: LightProps) => {
  const ledNumber = useSegmentNum();
  const [isMoving, setIsMoving] = useState(false);
  const isMovingRef = useRef(isMoving);
  const paintColorData = useStructuredProps(p => p.paint_colour_1);
  const paintColorDataRef = useRef(null);
  const stripCheckAll = useSelector(state => state.common.stripCheckAll);
  const stripCheckAllRef = useRef(stripCheckAll);
  stripCheckAllRef.current = stripCheckAll;
  const checkedIdList = useSelector(state => state.common.checkedIdList);
  const checkedSet = new Set(checkedIdList);
  const currentCheckedSetRef = useRef(checkedSet);
  currentCheckedSetRef.current = checkedSet;

  const colorModeRef = useRef(colorMode);
  colorModeRef.current = colorMode;
  const sActions = useStructuredActions();

  const [hsvFull, setHsvFull] = useState({
    hue: paintColorData?.hue ?? 0,
    saturation: paintColorData?.saturation ?? 1000,
    value: paintColorData?.value ?? 1000,
  });

  const [btFull, setBtFull] = useState({
    temperature: paintColorData?.temperature ?? 1000,
    bright: paintColorData?.brightness ?? 1000,
  });

  const hsvFullPreRef = useRef(hsvFull);
  const btFullPreRef = useRef(btFull);
  const checkedSetPreRef = useRef(checkedSet);

  const lightNum = ledNumber;
  const dispatch = useDispatch();
  /** 是否正在下发dp， 超时 1s 恢复为false */
  const isPutDpIngReg = useRef(false);

  useEffect(() => {
    if (isPutDpIngReg.current) {
      return;
    }
    const _paintColorData = paintColorData;
    if (!_paintColorData) {
      return;
    }
    if (isEqual(paintColorData, paintColorDataRef.current)) {
      return;
    }
    paintColorDataRef.current = _paintColorData;
    // 如果是油漆桶，并且数据不一致说明是通过遥控器或按钮上报上来的
    const isPaint = _paintColorData?.smearMode === SmearMode.all;
    if (isPaint) {
      const newSet = new Set<number>();
      new Array(lightNum).fill(0).map((_, i) => newSet.add(i));
      dispatch(actions.common.updateCheckedIdList(Array.from(newSet)));

      // 如果是彩光
      if (_paintColorData?.dimmerMode === DimmerMode.colour) {
        setTimeout(() => {
          const hsv = {
            h: _paintColorData?.hue,
            s: _paintColorData?.saturation,
            v: _paintColorData?.value,
          };
          updateColourStripDataListAllNotPutDp(hsv, true);
        }, 80);
        return;
      }
      // 如果是白光
      if (_paintColorData?.dimmerMode === DimmerMode.white) {
        setTimeout(() => {
          const bt = {
            t: _paintColorData?.temperature,
            b: _paintColorData?.brightness,
          };
          updateWhiteStripDataListAllNotPutDp(bt, true);
        }, 80);
      }
    }
  }, [isEqual(paintColorData, paintColorDataRef.current)]);

  // 灯珠列表数据
  const [update2Cloud, lightStripDataList] = useSetStorageData(lightStripDataKey);
  const currentLightStripDataList = lightStripDataList;
  useEffect(() => {
    if (colorModeRef.current !== 'colour') {
      return;
    }
    if (isEqual(hsvFull, hsvFullPreRef.current)) {
      return;
    }
    // 更新操作彩光时的灯珠数据
    updateColourStripDataListAll(
      {
        h: hsvFull?.hue,
        s: hsvFull?.saturation,
        v: hsvFull?.value,
      },
      stripCheckAllRef.current,
      {
        checkedSet: currentCheckedSetRef.current,
      }
    );
    hsvFullPreRef.current = hsvFull;
    checkedSetPreRef.current = currentCheckedSetRef.current;
  }, [isEqual(hsvFull, hsvFullPreRef.current)]);

  useEffect(() => {
    if (colorModeRef.current !== 'white') {
      return;
    }
    if (isEqual(btFull, btFullPreRef.current)) {
      return;
    }
    // 更新操作彩光时的灯珠数据
    updateWhiteStripDataListAll(
      {
        t: btFull?.temperature,
        b: btFull?.bright,
      },
      stripCheckAllRef.current,
      {
        checkedSet: currentCheckedSetRef.current,
        mode: DimmerMode.white,
      }
    );
    btFullPreRef.current = btFull;
    checkedSetPreRef.current = currentCheckedSetRef.current;
  }, [isEqual(btFull, btFullPreRef.current)]);

  const road = useLampRoad();
  const hsv = useMemo(
    () => ({
      h: hsvFull?.hue,
      s: hsvFull?.saturation,
      v: hsvFull?.value,
    }),
    [hsvFull]
  );

  const bt = useMemo(
    () => ({
      t: btFull?.temperature,
      b: btFull?.bright,
    }),
    [btFull]
  );

  const [currentHsv, setCurrentHsv] = useState<HSV>(hsv);
  const [currentBt, setCurrentBt] = useState<BT>(bt);
  const preHsvRef = useRef<HSV>(currentHsv);
  const preBtRef = useRef<BT>(currentBt);

  const lightStripDataListRef = useRef(null);

  const updateStripData2Cloud = data => {
    if (isEqual(data, lightStripDataListRef.current)) {
      return;
    }
    update2Cloud(data);
    lightStripDataListRef.current = data;
  };

  const updateStripDataList = useCallback(
    (
      _currentLightStripDataList,
      checkedSet,
      _currentColor: (HSV | BT) & { mode: DimmerMode },
      _isSectionAll = false
    ) => {
      const currentStripLen = _currentLightStripDataList?.length;
      // if (!currentStripLen) {
      //   return;
      // }
      // 如果选中的灯带数量大于当前灯带数量，直接补全
      if (currentStripLen < ledNumber) {
        const newLightStripDataList1 = new Array(ledNumber).fill(1).map((item, index) => {
          if (_currentColor.mode === DimmerMode.colour) {
            const { h = 0, s = 1000, v = 1000 } = _currentColor as HSV;
            const color = hsv2rgbString(h, Math.round(s / 10), Math.round(v / 10));
            return color?.replaceAll(/\s+/g, '');
          }

          const { t = 0, b = 1000 } = _currentColor as BT;
          const color = brightKelvin2rgb(b, t);
          return color?.replaceAll(/\s+/g, '');
        });
        updateStripData2Cloud(newLightStripDataList1);
        return newLightStripDataList1;
      }
      const newLightStripDataList = _currentLightStripDataList.map((item, index) => {
        if (checkedSet.has(index) || _isSectionAll) {
          if (_currentColor.mode === DimmerMode.colour) {
            const { h = 0, s = 1000, v = 1000 } = _currentColor as HSV;
            const color = hsv2rgbString(h, Math.round(s / 10), Math.round(v / 10));
            return color?.replaceAll(/\s+/g, '');
          }
          const { t = 0, b = 1000 } = _currentColor as BT;
          const color = brightKelvin2rgb(b, t);
          return color?.replaceAll(/\s+/g, '');
        }
        return item;
      });
      updateStripData2Cloud(newLightStripDataList);
      return newLightStripDataList;
    },
    [ledNumber]
  );
  const timeRef = useRef(null);

  const timeoutPutDpStatus = () => {
    /** 超时1s恢复为false */
    isPutDpIngReg.current = true;
    timeRef.current && clearTimeout(timeRef.current);
    timeRef.current = setTimeout(() => {
      isPutDpIngReg.current = false;
    }, 1000);
  };

  const { run: handleUpdate2Cloud, cancel: cancelHandleUpdate2Cloud } = useThrottleFn(
    dataList => {
      cancelHandleUpdate2Cloud && cancelHandleUpdate2Cloud();
      dataList && updateStripData2Cloud(dataList);
    },
    {
      wait: 300,
      trailing: false,
    }
  );

  const preUpdateCloudDataRef = useRef(null);

  useEffect(() => {
    const _paintColorData = paintColorData;
    if (!_paintColorData) {
      return;
    }
    if (isEqual(paintColorDataRef.current, _paintColorData)) {
      return;
    }
    paintColorDataRef.current = _paintColorData;
    const isSectionAll = _paintColorData.smearMode === SmearMode.all;
    const isSectionColour = _paintColorData.dimmerMode === DimmerMode.colour;
    if (isSectionColour) {
      // 彩光处理
      const _hsv = {
        h: _paintColorData?.hue,
        s: _paintColorData?.saturation,
        v: _paintColorData?.value,
      };
      setCurrentHsv(_hsv);
      preHsvRef.current = _hsv;
      const __checkedSet = _paintColorData.indexs || new Set();
      const newLightStripDataList = updateStripDataList(
        preUpdateCloudDataRef.current || currentLightStripDataList,
        __checkedSet,
        {
          ..._hsv,
          mode: DimmerMode.colour,
        },
        isSectionAll
      );
      preUpdateCloudDataRef.current = newLightStripDataList;
      handleUpdate2Cloud(newLightStripDataList);
      return;
    }
    // 白光处理
    const _bt = {
      t: _paintColorData?.temperature,
      b: _paintColorData?.brightness,
    };
    setCurrentBt(_bt);
    preBtRef.current = _bt;
    const __checkedSet = _paintColorData.indexs || new Set();
    const newLightStripDataList = updateStripDataList(
      preUpdateCloudDataRef.current || currentLightStripDataList,
      __checkedSet,
      {
        ..._bt,
        mode: DimmerMode.white,
      },
      isSectionAll
    );
    preUpdateCloudDataRef.current = newLightStripDataList;
    handleUpdate2Cloud(newLightStripDataList);
  }, [paintColorData]);

  const updateColourStripDataListAllNotPutDp = (
    _hsv = currentHsv,
    isSectionAll = false,
    extParams?
  ) => {
    const { checkedSet: _checkedSet } = extParams || {};
    const __checkedSet = _checkedSet || checkedSet || new Set();
    const _currentHsv = _hsv || currentHsv;
    preHsvRef.current = _currentHsv;
    if (!_currentHsv) {
      return;
    }
    // 全段控制时 下发dp 更新颜色
    if (isSectionAll) {
      const hsvFull = {
        hue: _currentHsv.h,
        saturation: _currentHsv.s,
        value: _currentHsv.v,
      };
      const indexs = new Set() as any;
      const dimmerMode = DimmerMode.colour;
      const smearMode = SmearMode.all;
      const res = {
        ...paintColorData,
        ...hsvFull,
        indexs,
        ledNumber,
        dimmerMode,
        smearMode,
      };
      const newLightStripDataList = updateStripDataList(
        currentLightStripDataList,
        __checkedSet,
        {
          ..._currentHsv,
          mode: DimmerMode.colour,
        },
        isSectionAll
      );
      paintColorDataRef.current = res;
      const _isEqualColor = isEqual(preUpdateCloudDataRef.current, newLightStripDataList);
      !_isEqualColor && handleUpdate2Cloud(newLightStripDataList);
      console.log('handleUpdate2Cloud no put dp');
      preUpdateCloudDataRef.current = newLightStripDataList;
    }
  };
  const updateColourStripDataListAll = (_hsv = currentHsv, isSectionAll = false, extParams?) => {
    const { checkedSet: _checkedSet } = extParams || {};
    const __checkedSet = _checkedSet || checkedSet || new Set();
    const _currentHsv = _hsv || currentHsv;
    preHsvRef.current = _currentHsv;
    if (!_currentHsv) {
      return;
    }
    if (isMovingRef.current) {
      // 滑动时实时，更新灯带颜色
      updateStripDataList(currentLightStripDataList, __checkedSet, {
        ..._currentHsv,
        mode: DimmerMode.colour,
      });
      return;
    }
    // 全段控制时 下发dp 更新颜色
    if (isSectionAll) {
      const hsvFull = {
        hue: _currentHsv.h,
        saturation: _currentHsv.s,
        value: _currentHsv.v,
      };
      const indexs = new Set() as any;
      const dimmerMode = DimmerMode.colour;
      const smearMode = SmearMode.all;
      const res = {
        ...paintColorData,
        ...hsvFull,
        indexs,
        ledNumber,
        dimmerMode,
        smearMode,
      };
      paintColorDataRef.current = res;
      timeoutPutDpStatus();
      sActions.paint_colour_1.set(res, {
        success() {
          const newLightStripDataList = updateStripDataList(
            currentLightStripDataList,
            __checkedSet,
            {
              ..._currentHsv,
              mode: DimmerMode.colour,
            },
            isSectionAll
          );
          const _isEqualColor = isEqual(preUpdateCloudDataRef.current, newLightStripDataList);
          console.warn(newLightStripDataList, 'handleUpdate2Cloud1');
          !_isEqualColor && handleUpdate2Cloud(newLightStripDataList);
          preUpdateCloudDataRef.current = newLightStripDataList;
        },
        fail(e) {
          console.error('fail', e);
        },
      });
      return;
    }
    // 松手时，下发 dp 数据
    // 如果外部有颜色传入并且存在选中的灯珠那么更新选中的灯珠颜色
    if (__checkedSet.size > 0) {
      const hsvFull = {
        hue: _currentHsv.h,
        saturation: _currentHsv.s,
        value: _currentHsv.v,
      };
      const indexs = __checkedSet;
      const dimmerMode = DimmerMode.colour;
      const smearMode = SmearMode.single;
      const res = {
        ...paintColorData,
        ...hsvFull,
        indexs,
        ledNumber,
        dimmerMode,
        smearMode,
      };
      paintColorDataRef.current = res;
      timeoutPutDpStatus();
      sActions.paint_colour_1.set(res, {
        success() {
          const newLightStripDataList = updateStripDataList(
            currentLightStripDataList,
            __checkedSet,
            {
              ..._currentHsv,
              mode: DimmerMode.colour,
            }
          );
          const _isEqualColor = isEqual(preUpdateCloudDataRef.current, newLightStripDataList);
          !_isEqualColor && newLightStripDataList && handleUpdate2Cloud(newLightStripDataList);
          preUpdateCloudDataRef.current = newLightStripDataList;
        },
        fail(params) {
          console.error('__checkedSet fail', params);
        },
      });
    }
  };

  const updateWhiteStripDataListAllNotPutDp = (
    _bt = currentBt,
    isSectionAll = false,
    extParams?
  ) => {
    const { checkedSet: _checkedSet } = extParams || {};
    const __checkedSet = _checkedSet || checkedSet || new Set();
    const _currentBt = _bt || currentBt;
    preBtRef.current = _currentBt;
    if (!_currentBt) {
      return;
    }
    if (colorMode === WORK_MODE.colour) {
      return;
    }
    // 全段控制时 下发dp 更新颜色
    if (isSectionAll) {
      const btFull = {
        temperature: _currentBt.t,
        brightness: _currentBt.b,
      };
      const indexs = new Set() as any;
      const dimmerMode = DimmerMode.white;
      const smearMode = SmearMode.all;
      const res = {
        ...paintColorData,
        ...btFull,
        indexs,
        ledNumber,
        dimmerMode,
        smearMode,
      };

      const newLightStripDataList = updateStripDataList(
        currentLightStripDataList,
        __checkedSet,
        {
          ..._currentBt,
          mode: DimmerMode.white,
        },
        isSectionAll
      );
      paintColorDataRef.current = res;
      const _isEqualColor = isEqual(preUpdateCloudDataRef.current, newLightStripDataList);
      console.warn(newLightStripDataList[0], 'handleUpdate2Cloud1 no put dp');
      console.warn(newLightStripDataList.length, 'handleUpdate2Cloud1 no put dp length');
      !_isEqualColor && handleUpdate2Cloud(newLightStripDataList);
      preUpdateCloudDataRef.current = newLightStripDataList;
    }
  };
  const updateWhiteStripDataListAll = (_bt = currentBt, isSectionAll = false, extParams?) => {
    const { checkedSet: _checkedSet } = extParams || {};
    const __checkedSet = _checkedSet || checkedSet || new Set();
    const _currentBt = _bt || currentBt;
    preBtRef.current = _bt;
    if (!_bt) {
      return;
    }
    if (isMoving) {
      // 滑动时实时，更新灯带颜色
      updateStripDataList(currentLightStripDataList, __checkedSet, {
        ..._currentBt,
        mode: DimmerMode.white,
      });
      return;
    }
    // 全段控制时 下发dp 更新颜色
    if (isSectionAll) {
      const btFull = {
        temperature: _currentBt.t,
        brightness: _currentBt.b,
      };
      const indexs = new Set() as any;
      const dimmerMode = DimmerMode.white;
      const smearMode = SmearMode.all;
      const res = {
        ...paintColorData,
        ...btFull,
        indexs,
        ledNumber,
        dimmerMode,
        smearMode,
      };

      paintColorDataRef.current = res;
      timeoutPutDpStatus();
      sActions.paint_colour_1.set(res, {
        success() {
          const newLightStripDataList = updateStripDataList(
            currentLightStripDataList,
            __checkedSet,
            {
              ..._currentBt,
              mode: DimmerMode.white,
            },
            isSectionAll
          );
          const _isEqualColor = isEqual(preUpdateCloudDataRef.current, newLightStripDataList);
          !_isEqualColor && handleUpdate2Cloud(newLightStripDataList);
          preUpdateCloudDataRef.current = newLightStripDataList;
        },
        fail(e) {
          console.error('fail', e);
        },
      });
      return;
    }
    // 松手时，下发 dp 数据
    // 如果外部有颜色传入并且存在选中的灯珠那么更新选中的灯珠颜色
    if (__checkedSet.size > 0) {
      const btFull = {
        temperature: _currentBt.t,
        brightness: _currentBt.b,
      };
      const indexs = __checkedSet;
      const dimmerMode = DimmerMode.white;
      const smearMode = SmearMode.single;
      const res = {
        ...paintColorData,
        ...btFull,
        indexs,
        ledNumber,
        dimmerMode,
        smearMode,
      };
      // 缓存数据 进行比对防治重复更新
      paintColorDataRef.current = res;
      timeoutPutDpStatus();
      sActions.paint_colour_1.set(res, {
        success() {
          const newLightStripDataList = updateStripDataList(
            currentLightStripDataList,
            __checkedSet,
            {
              ..._currentBt,
              mode: DimmerMode.white,
            }
          );
          const _isEqualColor = isEqual(preUpdateCloudDataRef.current, newLightStripDataList);
          !_isEqualColor && newLightStripDataList && handleUpdate2Cloud(newLightStripDataList);
          preUpdateCloudDataRef.current = newLightStripDataList;
        },
        fail(params) {
          console.error('__checkedSet fail', params);
        },
      });
    }
  };

  const dpActions = useActions();
  const { run: handleColorChange } = useThrottleFn(
    (data: HSVFull | BTFull, mode: WORK_MODE) => {
      if (mode === WORK_MODE.white) {
        setBtFull(data as BTFull);
        dpActions.work_mode.set(WORK_MODE.white);
      } else {
        const _hsv = data as HSVFull;
        setHsvFull(_hsv);
        dpActions.work_mode.set(WORK_MODE.colour);
        // 更新操作彩光时的灯珠数据
        updateColourStripDataListAll(
          {
            h: _hsv?.hue,
            s: _hsv?.saturation,
            v: _hsv?.value,
          },
          stripCheckAllRef.current,
          {
            checkedSet: currentCheckedSetRef.current,
          }
        );
        hsvFullPreRef.current = _hsv;
        checkedSetPreRef.current = currentCheckedSetRef.current;
      }
    },
    { wait: 333 }
  );

  const colorLightContent = useMemo(() => {
    return (
      <ColorLight
        hsvFull={hsvFull}
        data={currentLightStripDataList}
        isMoving={isMoving}
        onMovingChange={_isMoving => {
          setIsMoving(_isMoving);
          isMovingRef.current = _isMoving;
        }}
        onColorChange={handleColorChange}
      />
    );
  }, [JSON.stringify(hsvFull), JSON.stringify(currentLightStripDataList), isMoving]);

  return (
    <View>
      {currentLightStripDataList?.length && (
        <LightStrip
          mode={colorMode as WORK_MODE}
          data={currentLightStripDataList}
          isMoving={isMoving}
          ledNumber={ledNumber as unknown as number}
        />
      )}
      <LightTab
        colorMode={colorMode}
        road={road}
        onChangeColorMode={onChangeColorMode}
        colorContent={colorLightContent}
        whiteContent={
          <WhiteLight
            temperature={btFull.temperature}
            bright={btFull.bright}
            road={road}
            data={currentLightStripDataList}
            isMoving={isMoving}
            onMovingChange={_isMoving => {
              setIsMoving(_isMoving);
              isMovingRef.current = _isMoving;
            }}
            onColorChange={handleColorChange}
          />
        }
      />
    </View>
  );
};
