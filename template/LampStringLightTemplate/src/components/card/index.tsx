// 更多功能卡片组件
import React from 'react';
import { View, Image, vibrateShort } from '@ray-js/ray';
import SwitchCom from '@ray-js/components-ty-switch';
import './index.less';

type TSwitchProps = {
  cardType: 'switch';
  checked: boolean;
  onClickTitleTips: () => void;
  onSwitchChange: (opened: boolean) => void;
};

type TCommonProps = {
  style?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  title: string;
  subTitle?: string;
  subTitleStyle?: React.CSSProperties;
};

type TArrowProps = {
  cardType: 'arrow';
  arrowLabel?: string;
  onClick: () => void;
};

type TProps = TCommonProps & (TArrowProps | TSwitchProps);

const nilFn = () => null;
const Card = (props: TProps) => {
  const { title, subTitle, subTitleStyle, cardType, style = {}, titleStyle = {} } = props;
  const { arrowLabel, onClick } = props as TArrowProps;
  const { checked, onClickTitleTips, onSwitchChange } = props as TSwitchProps;
  const handleSwitchChange = (value: boolean) => {
    vibrateShort({
      type: 'light',
    });
    onSwitchChange(value);
  };

  const isArrow = cardType === 'arrow';
  const renderTitleWrapper = () => {
    if (onClickTitleTips) {
      return (
        <>
          <View className="common-card-title">{title}</View>
          <Image className="common-card-title-tips" src="/images/icon-title-tips.png" />
        </>
      );
    }
    return <View className="common-card-title">{title}</View>;
  };

  const renderController = () => {
    if (cardType === 'switch') {
      return (
        <SwitchCom
          checked={checked}
          thumbWidth="24px"
          thumbHeight="24px"
          unCheckedColor="rgba(255, 255, 255, 0.1)"
          onChange={handleSwitchChange}
        />
      );
    }
    return <Image className="icon-arrow-right" src="/images/icon-arrow-right.png" />;
  };

  return (
    <View className="common-card-wrapper" style={{ ...style }} onClick={isArrow ? onClick : nilFn}>
      <View
        className="common-card-title-wrapper"
        style={{ ...titleStyle }}
        onClick={onClickTitleTips || nilFn}
      >
        {renderTitleWrapper()}
        {subTitle && (
          <View className="common-card-sub-title" style={{ ...subTitleStyle }}>
            {subTitle}
          </View>
        )}
      </View>
      <View className="common-card-handle-wrapper">
        {arrowLabel && <View className="common-card-arrow-label">{arrowLabel}</View>}
        <View className="common-card-handle">{renderController()}</View>
      </View>
    </View>
  );
};

export default Card;
