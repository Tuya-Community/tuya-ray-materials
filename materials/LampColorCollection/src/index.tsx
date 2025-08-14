import React from 'react';
import { View } from '@ray-js/ray';

import ColorSelectorCircle from './ColorSelectorCircle';
import ColorSelectorIcon from './ColorSelectorIcon';

import Res from './res';
import { IProps, ThemeStyle } from './props';
import iconDelete from './res/icon-delete.png';
import { ColorCollectInnerDelete } from './ColorCollectInnerDelete';
import { classPrefix } from './constant';
import './index.less';

const ColorSelectorAnimation = (props: IProps) => {
  const {
    disableDelete,
    theme,
    className = '',
    contentClassName = '',
    style: _style,
    // 兼容之前版本, 不做属性透出，新版使用标准 style 属性代替
    containerStyle,
    iconDeleteColorStyle,
    contentStyle,
    colorList,
    circleSize = 48,
    limit = 6,
    activeIndex,
    onAdd,
    onDelete,
    onChecked,
  } = props;
  const style = containerStyle ?? _style ?? {};
  let themeStyle: { background: string; addBgColor: string } = theme as ThemeStyle;
  if (theme) {
    if (typeof theme === 'string') {
      const darkStyle = {
        background: '#393838',
        addBgColor: 'rgba(255, 255, 255, 0.12)',
      };
      const lightStyle = {
        background: '#fff',
        addBgColor: 'rgba(0, 0, 0, 0.05)',
      };
      themeStyle = theme === 'dark' ? darkStyle : lightStyle;
    }
  }

  const renderColorItem = () => {
    return colorList.map((item, index) => {
      return (
        <View
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className={`${classPrefix}__item-wrapper`}
        >
          <ColorSelectorCircle
            circleSize={circleSize}
            colorData={item}
            isSelected={activeIndex === index}
            onClick={() => onChecked && onChecked(item, index)}
          />
        </View>
      );
    });
  };
  const renderContent = () => {
    const isShowAdd = limit > colorList.length;
    return (
      <>
        {renderColorItem()}
        {isShowAdd && (
          <View className={`${classPrefix}__add`}>
            <ColorSelectorIcon
              circleSize={circleSize}
              bgColor={themeStyle.addBgColor}
              imageSource={Res.iconAdd as string}
              onClick={onAdd}
            />
          </View>
        )}
      </>
    );
  };
  const handleDelete = () => {
    if (!disableDelete) {
      return;
    }
    if (!onDelete || activeIndex < 0) {
      return;
    }
    const copyColorList = [...colorList];
    copyColorList.splice(activeIndex, 1);
    onDelete && onDelete(copyColorList, -1, activeIndex);
  };
  let iconDeleteColor =
    activeIndex >= 0 && disableDelete ? 'rgba(255, 0, 0, 1)' : 'rgba(255, 0, 0, 0.5)';
  if (iconDeleteColorStyle?.activeColor && activeIndex >= 0 && disableDelete) {
    iconDeleteColor = iconDeleteColorStyle.activeColor;
  }
  if (iconDeleteColorStyle?.disabledColor) {
    iconDeleteColor =
      activeIndex >= 0 && disableDelete ? iconDeleteColor : iconDeleteColorStyle.disabledColor;
  }
  return (
    <View className={`${classPrefix} ${className}`} style={{ ...style }}>
      <View
        className={`${classPrefix}__content ${contentClassName}`}
        style={{ background: themeStyle.background, ...contentStyle }}
      >
        {renderContent()}
      </View>
      <View
        className={`${classPrefix}__delete`}
        style={{ background: themeStyle.background }}
        onClick={handleDelete}
      >
        <View
          style={{
            background: iconDeleteColor,
            WebkitMaskImage: `url(${iconDelete})`,
            WebkitMaskSize: 'cover',
          }}
          className={`${classPrefix}__delete--icon`}
        />
      </View>
    </View>
  );
};

const nilFn = () => null;

ColorSelectorAnimation.defaultProps = {
  disableDelete: true,
  theme: 'light',
  style: {},
  contentStyle: {},
  limit: 6,
  onAdd: nilFn,
  onDelete: nilFn,
  onChecked: nilFn,
};

ColorSelectorAnimation.ColorCollectInnerDelete = ColorCollectInnerDelete;

export { ColorCollectInnerDelete } from './ColorCollectInnerDelete';

export default ColorSelectorAnimation;
