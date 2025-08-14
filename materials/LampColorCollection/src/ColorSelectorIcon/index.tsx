import React from 'react';
import { View, Image } from '@ray-js/ray';

import './index.less';
import { classPrefix } from '../constant';

interface Props {
  circleSize: number;
  imageSource: string;
  bgColor: string;
  onClick?: () => void;
}

const ColorSelectorIcon = (props: Props) => {
  const { imageSource, bgColor, circleSize = 48, onClick } = props;
  return (
    <View
      className={`${classPrefix}__icon`}
      style={{
        width: `${circleSize * 2}rpx`,
        height: `${circleSize * 2}rpx`,
      }}
      onClick={() => {
        onClick && onClick();
      }}
    >
      <View
        className={`${classPrefix}__icon--content`}
        style={{
          background: bgColor,
        }}
      >
        <Image src={imageSource} className={`${classPrefix}__icon--image`} />
      </View>
    </View>
  );
};

const nilFn = () => null;

ColorSelectorIcon.defaultProps = {
  onClick: nilFn,
};

export default ColorSelectorIcon;
