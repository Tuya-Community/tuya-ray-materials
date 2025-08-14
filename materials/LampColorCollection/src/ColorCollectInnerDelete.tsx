/* eslint-disable react/no-array-index-key */
import React, { useMemo } from 'react';
import { View, ScrollView } from '@ray-js/ray';

import ColorSelectorCircle from './ColorSelectorCircle';
import ColorSelectorIcon from './ColorSelectorIcon';

import Res from './res';
import { IProps, ThemeStyle } from './innerProps';
import './ColorCollectInnerDelete.less';
import { classPrefix, classPrefixInner } from './constant';

export const ColorCollectInnerDelete = (props: IProps) => {
  const {
    disableDelete,
    theme,
    className = '',
    style,
    contentClassName = '',
    contentStyle,
    colorList,
    circleSize,
    limit = 6,
    activeIndex,
    addButtonPos = 'head',
    renderDeleteElement,
    onAdd,
    onDelete,
    onChecked,
  } = props;
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

  const handleShowDelete = (colorItem, index: number) => {
    onChecked && onChecked(colorItem, index);
  };

  const handleDelete = (_activeIndex: number) => {
    if (!disableDelete) {
      return;
    }
    if (!onDelete) {
      return;
    }
    const copyColorList = [...colorList];
    copyColorList.splice(_activeIndex, 1);
    onDelete && onDelete(copyColorList, -1, _activeIndex);
  };

  const handleChecked = (colorItem, _activeIndex: number) => {
    onChecked && onChecked(colorItem, _activeIndex);
    if (_activeIndex === activeIndex) {
      handleDelete(_activeIndex);
    }
  };

  const isShowAdd = useMemo(() => {
    return limit > colorList.length;
  }, [limit, colorList.length]);
  const renderColorItem = () => {
    return colorList.map((item, index) => {
      return (
        <View
          key={index}
          className={`${classPrefixInner}__item-wrapper`}
          style={{
            width: circleSize * 2,
            height: circleSize * 2,
          }}
        >
          <ColorSelectorCircle
            colorData={item}
            circleSize={circleSize}
            isSelected={activeIndex === index}
            isShowDelete={disableDelete}
            renderDeleteElement={renderDeleteElement}
            onLongPress={() => handleShowDelete(item, index)}
            onClick={() => handleChecked(item, index)}
          />
        </View>
      );
    });
  };
  const renderContent = () => {
    const isHead = addButtonPos === 'head';
    return (
      <View className={`${classPrefixInner}__add`}>
        {isHead && isShowAdd && (
          <View
            className={`${classPrefixInner}__add--head`}
            style={{
              width: circleSize * 2,
            }}
          >
            <ColorSelectorIcon
              circleSize={circleSize}
              bgColor={themeStyle.addBgColor}
              imageSource={Res.iconAdd as string}
              onClick={onAdd}
            />
          </View>
        )}
        {renderColorItem()}
        {!isHead && isShowAdd && (
          <View
            className={`${classPrefixInner}__add--tail`}
            style={{
              width: circleSize * 2,
            }}
          >
            <ColorSelectorIcon
              circleSize={circleSize}
              bgColor={themeStyle.addBgColor}
              imageSource={Res.iconAdd as string}
              onClick={onAdd}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View className={`${classPrefix} ${className}`} style={{ ...style }}>
      <ScrollView
        scrollX
        className={`${classPrefixInner} ${contentClassName}`}
        style={{ ...contentStyle }}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const nilFn = () => null;

ColorCollectInnerDelete.defaultProps = {
  disableDelete: true,
  theme: 'light',
  style: {},
  contentStyle: {},
  limit: 6,
  addButtonPos: 'head',
  onAdd: nilFn,
  onDelete: nilFn,
  onChecked: nilFn,
  renderDeleteElement: null,
  circleSize: 48,
};

export default ColorCollectInnerDelete;
