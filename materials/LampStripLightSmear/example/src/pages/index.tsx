import React, { useState, useEffect } from 'react';
import { View, Text } from '@ray-js/ray';
import DimmerStrip, { hsv2rgbString } from '../../../src/index';

import styles from './index.module.less';

const DemoBlock = ({ title, children }) => (
  <View className={styles.demoBlock}>
    <View className={styles.demoBlockTitle}>
      <Text className={styles.demoBlockTitleText}>{title}</Text>
    </View>
    {children}
  </View>
);

enum SmearMode {
  all,
  single,
  clear,
}

const smearModeMap = {
  [SmearMode.all]: '油漆桶',
  [SmearMode.single]: '点选',
  [SmearMode.clear]: '橡皮擦',
};

type HSV = {
  h: number;
  s: number;
  v: number;
};

export default function Home() {
  const [smearedColor, setSmearedColor] = useState<HSV>({ h: 0, s: 1000, v: 1000 });
  const [lightColorMaps, setLightColorMaps] = useState({});
  const [smearMode, setSmearMode] = useState(SmearMode.all);

  const updateColorMap = (_smearedColor = smearedColor) => {
    const _lightColorMaps = {};
    const { h, s, v } = _smearedColor;
    new Array(20).fill(0).forEach((_, index) => {
      _lightColorMaps[index] = hsv2rgbString(h, s / 10, v / 10, 1);
    });
    setLightColorMaps(_lightColorMaps);
  };

  useEffect(() => {
    updateColorMap();
  }, []);

  const onChange = data => {
    const newCheckedMapColor = {};
    [...data].forEach(item => {
      newCheckedMapColor[item] = hsv2rgbString(
        smearedColor.h,
        smearedColor.s / 10,
        smearedColor.v / 10,
        1
      );
    });
    const _lightColorMaps = {
      ...lightColorMaps,
      ...newCheckedMapColor,
    };
    setLightColorMaps(_lightColorMaps);
  };

  const onEnd = data => {
    const newCheckedMapColor = {};
    [...data].forEach(item => {
      newCheckedMapColor[item] = hsv2rgbString(
        smearedColor.h,
        smearedColor.s / 10,
        smearedColor.v / 10,
        1
      );
    });
    const _lightColorMaps = {
      ...lightColorMaps,
      ...newCheckedMapColor,
    };
    setLightColorMaps(_lightColorMaps);
  };

  const handleChangeColor = () => {
    // 全选
    if (smearMode === SmearMode.all) {
      const newColor = { h: Math.floor(Math.random() * 360), s: 1000, v: 1000 };
      setSmearedColor(newColor);
      const _lightColorMaps = {};
      const { h, s, v } = newColor;
      new Array(20).fill(0).forEach((_, index) => {
        _lightColorMaps[index] = hsv2rgbString(h, s / 10, v / 10, 1);
      });
      setLightColorMaps(_lightColorMaps);
    } else if (smearMode === SmearMode.single) {
      // 单选
      const newColor = { h: Math.floor(Math.random() * 360), s: 1000, v: 1000 };
      setSmearedColor(newColor);
    }
  };

  const handleChangeType = () => {
    // 0-2循环
    const type = (smearMode + 1) % 3;
    setSmearMode(type);
    if (type === SmearMode.clear) {
      setSmearedColor({ h: 0, s: 50, v: 50 });
    } else if (type === SmearMode.single) {
      setSmearedColor({ h: Math.floor(Math.random() * 360), s: 1000, v: 1000 });
    } else {
      const _smearedColor = { h: Math.floor(Math.random() * 360), s: 1000, v: 1000 };
      updateColorMap(_smearedColor);
      setSmearedColor(_smearedColor);
    }
  };

  return (
    <View className={styles.view}>
      <DemoBlock title="基础用法">
        <DimmerStrip
          className="aaa"
          disabled={false}
          type={smearMode}
          gradient
          smearedColor={smearedColor}
          lightColorMaps={lightColorMaps}
          onLightChange={onChange}
          onLightEnd={onEnd}
        />
      </DemoBlock>

      <View
        style={{
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <View
          className={styles.btnRandom}
          style={{
            backgroundColor: hsv2rgbString(
              smearedColor.h,
              smearedColor.s / 10,
              smearedColor.v / 10,
              1
            ),
          }}
          onClick={handleChangeColor}
        >
          切换涂抹色
        </View>

        <View
          className={styles.btnType}
          style={{
            backgroundColor: hsv2rgbString(
              smearedColor.h,
              smearedColor.s / 10,
              smearedColor.v / 10,
              1
            ),
          }}
          onClick={handleChangeType}
        >
          切换模式:{smearModeMap[smearMode]}
        </View>
      </View>
    </View>
  );
}
