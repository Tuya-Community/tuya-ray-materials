import React, { useCallback } from 'react';
import { View, Text } from '@ray-js/ray';
import className from './index.less?modules';

type IProps = {
  bgColor?: string;
  fontColor?: string;
  fontSize?: number;
  children?: any;
  onClick: () => void;
};

const Button = (props: IProps) => {
  const { bgColor = 'rgba(16, 130, 254, 1)', fontColor = '#fff', children, onClick = () => null, fontSize= 16 } = props;
  const renderChildren = useCallback(() => {
    if (typeof children === 'string') {
      return <Text className={`${className.text}`} style={{ color: fontColor, fontSize: `${fontSize * 2}rpx` }}>{children}</Text>;
    }
    return children;
  }, [children]);

  return (
    <View className={`${className.buttonWrapper}`} style={{ backgroundColor: bgColor }} onClick={onClick}>
      {renderChildren()}
    </View>
  );
}

export default Button;
