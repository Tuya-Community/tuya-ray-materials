/*
 * @Author: hkc
 * @Date: 2025-11-27 18:16:59
 * @LastEditors: hkc
 * @LastEditTime: 2025-12-02 20:01:05
 * @Description: Lottie渲染组件
 */
import React from 'react';
import { View } from '@ray-js/ray';
import Lottie from '@/components/LottieRender/Lottie';

interface IProps {
  className?: string;
  lottieData: any;
  status?: 'play' | 'stop';
  width?: string;
  height?: string;
  style?: React.CSSProperties;
  canvasId?: string;
  scale?: number;
}

const Index: React.FC<IProps> = ({
  className,
  lottieData,
  status = 'play',
  width,
  height,
  style = {},
  canvasId,
}) => {
  return (
    <View className={className} style={{ width, height, ...style }}>
      <Lottie canvasId={canvasId} lottieData={lottieData} status={status} />
    </View>
  );
};

export default Index;
