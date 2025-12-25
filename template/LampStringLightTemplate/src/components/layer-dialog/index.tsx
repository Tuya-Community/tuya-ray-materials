// 更多功能卡片组件
import React, { CSSProperties } from 'react';
import { View, Image } from '@ray-js/ray';
import Strings from '@/i18n';
import { useDebugPerf } from '@/hooks/useDebugPerf';

import './index.less';

type TProps = {
  isShow: boolean;
  title?: string;
  content: string;
  bgImg: string;
  style?: CSSProperties;
  onClick: () => void;
};

export const LayerDialog = (props: TProps) => {
  useDebugPerf(LayerDialog, props);
  const { title, content, isShow, style = {}, bgImg, onClick } = props;
  if (!isShow) {
    return null;
  }
  return (
    <View className="layer-dialog-wrapper" style={{ ...style }}>
      <View className="layer-dialog-mask" />
      <View className="layer-dialog-content-wrapper">
        <Image className="layer-dialog-bg" src={bgImg} />
        <View className="layer-dialog-content">
          <View className="layer-dialog-content-title">{title}</View>
          <View className="layer-dialog-content-text">{content}</View>
        </View>
        <View className="layer-dialog-btn-wrapper">
          <View className="layer-dialog-btn" hoverClassName="button-hover" onClick={onClick}>
            {Strings.getLang('gotIt')}
          </View>
        </View>
      </View>
    </View>
  );
};

export default LayerDialog;
