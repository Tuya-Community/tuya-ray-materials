import React, { useState, useEffect } from 'react';
import { View } from '@ray-js/components';

import LampRectWhitePicker from '../../../src/index';
import DemoRjs from '../../../src/exampleComponent/demoRjs';

import styles from './index.module.less';

export default function Home() {
  const [temp, setTemp] = useState(0);

  const handleTouchStart = (_temp: number) => {
    console.log(_temp, 'handleTouchStart');
  };
  const handleTouchMove = (_temp: number) => {
    console.log(_temp, 'handleTouchMove');
  };
  const handleTouchEnd = (_temp: number) => {
    console.log(_temp, 'handleTouchEnd');
    setTemp(_temp);
  };

  const [closed, setClosed] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setTemp(740);
      // setClosed(false);
    }, 1000);
  }, []);

  const handleClick = () => {
    setClosed(!closed);
  };

  return (
    <View className={styles.view}>
      <LampRectWhitePicker
        canvasId="canvas"
        temp={temp}
        borderRadius={16} // 设置圆角 优先级低于 borderRadiusStyle
        // borderRadiusStyle="62rpx 62rpx 0 0"
        rectWidth={340}
        rectHeight={200}
        thumbRadius={16}
        isShowTip
        closed={closed}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      <DemoRjs />
      <View
        onClick={handleClick}
        style={{
          color: '#999',
          background: '#fff',
          width: '100px',
          height: '40px',
          lineHeight: '40px',
          textAlign: 'center',
          borderRadius: '5px',
        }}
      >
        切换开关
      </View>
    </View>
  );
}
