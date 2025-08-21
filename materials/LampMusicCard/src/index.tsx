/* eslint-disable react/require-default-props */
/* eslint-disable prettier/prettier */
import React, { useCallback } from 'react';
import { Text, View, Image } from '@ray-js/ray';
import Color from 'color';

import Icon from './Iconfont';
import { musicBox } from './config';
import LampMusicBar from './musicBar';
import { IProps } from './props';
import './index.less';

export { musicColorArr1, musicColorArr2, musicColorArr3, musicColorArr4 } from './config';
export { default as LampMusicBar } from './musicBar';

const classPrefix = 'lamp-music-card-';

function LampMusicCard(props: IProps) {
  const {
    data,
    className = '',
    theme = 'dark',
    style,
    contentStyle = {},
    iconCircleBgColor,
    iconColor = '#ffffff',
    onPlay,
    renderCustom,
    renderFoldIcon,
    titleStyle,
  } = props;
  const unfold = props.active;
  const handleClick = useCallback(() => {
    // 下发dp
    onPlay(!props.active);
  }, [props.active]);

  const colorArr = data?.colorArr || musicBox[0].colorArr;
  const isDark = theme === 'dark';
  const contentBgColor = isDark ? '#201e1e' : '#fff';
  const contentBg =
    contentStyle.background || contentStyle.backgroundColor || contentBgColor;

  let _iconCircleBgColor = isDark ? 'rgba(255,255,255,.1)' : 'rgba(222,227,249,1)';
  const _iconCircleBorderColor = isDark ? 'rgba(255,255,255,.15)' : 'transparent';
  _iconCircleBgColor = iconCircleBgColor;
  const __iconCircleBorderColor = _iconCircleBgColor ? Color(iconCircleBgColor).rgb().lighten(0.2).toString() : _iconCircleBorderColor

  const __iconCircleBgColor = {
    border: `1px solid ${__iconCircleBorderColor}`,
    background: _iconCircleBgColor,
  }
  return (
    <View
      className={`${isDark ? 'dark' : 'light'} ${classPrefix}wrapper ${className}`}
      style={{ ...style }}
    >
      <View className={`${classPrefix}title`} style={titleStyle}>
        <View className={`${classPrefix}title__left`}>
          <Image src={data?.icon} className={`${classPrefix}title__left__image`} />
          <Text
            className={`${classPrefix}title__left__text`}
            style={titleStyle?.color ? { color: titleStyle?.color } : {}}
          >
            {data.title}
          </Text>
        </View>
        <View className={`${classPrefix}title__right`} style={__iconCircleBgColor} onClick={handleClick}>
          {renderFoldIcon ? (
            renderFoldIcon(unfold)
          ) : (
            <Icon type={unfold ? 'triangleClose' : 'triangleOpen'} color={iconColor} />
          )}
        </View>
      </View>
      {unfold && (
        <View
          className={`${classPrefix}content`}
          style={{ background: contentBg, ...contentStyle }}
        >
          {renderCustom && renderCustom()}
          <LampMusicBar colorList={colorArr} bgColor={contentBg} />
        </View>
      )}
    </View>
  );
}

export default LampMusicCard;
