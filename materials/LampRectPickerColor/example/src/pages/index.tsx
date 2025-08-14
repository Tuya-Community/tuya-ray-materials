/*
 * @Author: mjh
 * @Date: 2024-08-28 14:43:38
 * @LastEditors: mjh
 * @LastEditTime: 2024-09-12 14:51:19
 * @Description:
 */
import React, { useState, useEffect } from 'react';
import { View, Text } from '@ray-js/components';
import { utils } from '@ray-js/panel-sdk';

import RectColor from '../../../src/index';
import DemoRjs from '../../../src/exampleComponent/demoRjs';

import styles from './index.module.less';

const { hsv2rgbString } = utils;

export default function Home() {
  const [favoriteColorList, setFavoriteColorList] = useState([
    { h: 0, s: 1000, v: 1000 },
    { h: 120, s: 1000, v: 1000 },
    { h: 220, s: 1000, v: 1000 },
    { h: 320, s: 1000, v: 1000 },
  ]);
  const [hs, setHS] = useState({ h: 100, s: 600 });

  const handleTouchStart = (hsRes: HS) => {
    console.log(hsRes, 'handleTouchStart');
  };
  const handleTouchMove = (hsRes: HS) => {
    console.log(hsRes, 'handleTouchMove');
  };
  const handleTouchEnd = (hsRes: HS) => {
    console.log(hsRes, 'handleTouchEnd');
    setHS(hsRes);
  };

  const [closed, setClosed] = useState(false);

  const handleClick = () => {
    setClosed(!closed);
  };

  const renderFavoriteColor = () => {
    return (
      <View style={{ display: 'flex' }}>
        {favoriteColorList.map((item, index) => {
          return (
            <View
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '15px',
                background: hsv2rgbString(item.h ?? 0, item.s ?? 1000, item.v ?? 1000),
              }}
              onClick={() => {
                const activeColor = favoriteColorList[index];
                setHS(activeColor); // 格式为{h:120,s:1000,v:1000}
              }}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View className={styles.view}>
      {/* 功能测试 */}
      {renderFavoriteColor()}
      <RectColor
        hs={hs}
        borderRadius={16} // 设置圆角 优先级低于 borderRadiusStyle
        borderRadiusStyle="16rpx 16rpx 0 0"
        rectWidth={340}
        rectHeight={200}
        borderStyleStr="border: 1px solid rgba(0, 0, 0, .1)"
        thumbRadius={16}
        isShowColorTip
        useEventChannel // 是否启用事件通道 一般不需要，只有在需要 与其他 Rjs 组件传递数据时使用
        eventChannelName="test122" // 事件通道名称
        closed={closed}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      <DemoRjs eventChannelName="test122" />
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
