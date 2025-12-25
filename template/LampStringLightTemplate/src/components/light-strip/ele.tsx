import { View, Image } from '@ray-js/ray';
import React, { useCallback } from 'react';
import { hsvToRgbStr, rgbStrToHsv } from '@/utils/color';
import getLightShowType, { ELightShowType } from '@/utils/getLightShowType';

import clsx from 'clsx';
import iconChecked from './res/icon-checked.png';
import iconUncheck from './res/icon-unchecked.png';
import stripOn from './res/strip-on.png';
import stripOff from './res/strip-off.png';

import styles from './ele.module.less';

const arr = new Array(6).fill(0);

const getRgba = (bgColor: string, a: number): string => {
  // 使用正则表达式匹配并捕获 rgb 中的三个数字
  // \s* 匹配0个或多个空格
  // (\d+) 捕获一个或多个数字
  const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

  if (match) {
    // 解构赋值获取捕获的 rgb 值 (match[0] 是整个匹配字符串，match[1]是第一个捕获组，以此类推)
    const [, r, g, b] = match;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  return `rgba(0, 0, 0, ${a})`;
};

type TRadioBoxProps = {
  checked: boolean;
  style?: React.CSSProperties;
};

const offBorderColor = '#454545';
const offColor = '#030303';
const RadioBox = (props: TRadioBoxProps) => {
  const { checked, style = {} } = props;

  return (
    <View className={styles.radioBoxWrapper} style={{ ...style }}>
      <Image src={checked ? iconChecked : iconUncheck} className={styles.radioBoxCircle} />
    </View>
  );
};

type TEleData = {
  idx: number;
  checked: boolean;
  onOff: boolean; // 开关
  brightness: number;
  onClick: (checked: boolean, index: number) => void;
  bgColor: string;
};

// 生成开始的元素
/**
 * @param {TEleData} data
 * @param {boolean} isGradient 是否是渐变，渐变的话，颜色是数组
 * @returns
 */
const generateStartEle = (data: TEleData, isGradient = false, lightNum = 20) => {
  const { idx, onOff = true, checked = false, bgColor = '#161616', brightness = 0, onClick } = data;
  let _bgColor = bgColor;
  const isLessThan3 = lightNum < 3;
  if (isGradient && onOff) {
    const [preColor, currentColor, nextColor] = bgColor;
    if (isLessThan3) {
      _bgColor = `linear-gradient(90deg, ${currentColor} 0%, ${nextColor} 200%)`;
    } else {
      _bgColor = `linear-gradient(90deg, ${currentColor} 0%, ${nextColor} 150%)`;
    }
  }
  if (!onOff) {
    _bgColor = offColor;
  }
  const lightShowType = getLightShowType();
  const isDot = lightShowType === ELightShowType.dot;

  const renderDot = () => {
    const _bgColorRgba = getRgba(_bgColor, 0.1);
    return (
      <View
        className={`${styles.lightEleDotWrapper}  ${styles.lightEleStart}`}
        style={{ background: _bgColorRgba }}
      >
        {arr.map((item, index) => (
          <View key={index} className={`${styles.lightEleDot}`} style={{ background: _bgColor }} />
        ))}
      </View>
    );
  };

  const renderLine = (offBorderColor: string) => {
    return (
      <View
        className={`${styles.lightEle}  ${styles.lightEleStart}`}
        style={{
          background: _bgColor,
          border: onOff ? 0 : `1px solid ${offBorderColor}`,
        }}
      />
    );
  };

  return (
    <View
      key={idx}
      className={`${styles.lightEleItemWrapper}`}
      hoverClassName="button-hover"
      onClick={() => onClick(!checked, idx)}
    >
      <RadioBox checked={checked} />
      {isDot ? renderDot() : renderLine(offBorderColor)}
      <View
        className={`${styles.lightBrightness}  ${styles.lightBrightnessEnd}`}
      >{`${brightness}%`}</View>
    </View>
  );
};

const generateEndEle = (data: TEleData, isGradient = false, lightNum = 20) => {
  const { idx, onOff = true, checked, bgColor, brightness, onClick } = data;
  let _bgColor = bgColor;
  if (isGradient && onOff) {
    const [preColor, currentColor] = bgColor;
    _bgColor = `linear-gradient(90deg, ${preColor} -50%, ${currentColor} 100%)`;
  }
  if (!onOff) {
    _bgColor = offColor;
  }
  const lightShowType = getLightShowType();
  const isDot = lightShowType === ELightShowType.dot;

  const renderDot = () => {
    const _bgColorRgba = getRgba(_bgColor, 0.1);
    return (
      <View
        className={`${styles.lightEleDotWrapper}  ${styles.lightEleEnd}`}
        style={{ background: _bgColorRgba }}
      >
        {arr.map((item, index) => (
          <View key={index} className={`${styles.lightEleDot}`} style={{ background: _bgColor }} />
        ))}
      </View>
    );
  };
  const renderLine = (offBorderColor: string) => {
    return (
      <View
        className={`${styles.lightEle}  ${styles.lightEleEnd}`}
        style={{
          background: _bgColor,
          border: onOff ? 0 : `1px solid ${offBorderColor}`,
        }}
      />
    );
  };
  return (
    <View
      key={idx}
      className={`${styles.lightEleItemWrapper}`}
      hoverClassName="button-hover"
      onClick={() => onClick(!checked, idx)}
    >
      <RadioBox checked={checked} />
      {isDot ? renderDot() : renderLine(offBorderColor)}
      <View
        className={`${styles.lightBrightness}  ${styles.lightBrightnessEnd}`}
      >{`${brightness}%`}</View>
    </View>
  );
};

const revertSet = new Set([6, 7, 8, 9, 10, 11, 12]);
const generateHorizontalEle = (data: TEleData, isGradient = false, lightNum = 20) => {
  const { idx, onOff = true, checked, bgColor, brightness, onClick } = data;
  let _bgColor = bgColor;
  if (isGradient && onOff) {
    const [preColor, currentColor, nextColor] = bgColor;
    if (revertSet.has(idx)) {
      _bgColor = `linear-gradient(-90deg, ${preColor} -50%, ${currentColor} 50%, ${nextColor} 150%)`;
    } else {
      _bgColor = `linear-gradient(90deg, ${preColor} -70%, ${currentColor} 50%, ${nextColor} 150%)`;
    }
  }
  if (!onOff) {
    _bgColor = offColor;
  }
  const renderDot = () => {
    const _bgColorRgba = getRgba(_bgColor, 0.1);
    return (
      <View className={`${styles.lightEleDotWrapper}`} style={{ background: _bgColorRgba }}>
        {arr.map((item, index) => (
          <View key={index} className={`${styles.lightEleDot}`} style={{ background: _bgColor }} />
        ))}
      </View>
    );
  };
  const renderLine = (offBorderColor: string) => {
    return (
      <View
        className={`${styles.lightEle}`}
        style={{
          background: _bgColor,
          border: onOff ? 0 : `1px solid ${offBorderColor}`,
        }}
      />
    );
  };
  const lightShowType = getLightShowType();
  const isDot = lightShowType === ELightShowType.dot;
  return (
    <View
      key={idx}
      className={`${styles.lightEleItemWrapper}`}
      onClick={() => onClick(!checked, idx)}
      hoverClassName="button-hover"
    >
      <RadioBox checked={checked} />
      {isDot ? renderDot() : renderLine(offBorderColor)}
      <View
        className={`${styles.lightBrightness}  ${styles.lightBrightnessEnd}`}
      >{`${brightness}%`}</View>
    </View>
  );
};
// 生成左开口向下的元素
const generateLeftDownEle = (data: TEleData, isGradient = false, lightNum = 20) => {
  const { idx, checked, bgColor, onOff = true, brightness, onClick } = data;
  let _bgColor = bgColor;
  if (isGradient && onOff) {
    const [preColor, currentColor, nextColor] = bgColor;
    _bgColor = `linear-gradient(135deg, ${preColor} -50%,${currentColor} 50%, ${nextColor} 150%)`;
  }
  if (!onOff) {
    _bgColor = offColor;
  }
  const renderDot = () => {
    const _bgColorRgba = getRgba(_bgColor, 0.1);
    return (
      <View
        className={`${styles.lightEleRectBgDot}`}
        style={{ background: onOff ? _bgColorRgba : offColor }}
      >
        <Image src={onOff ? stripOn : stripOff} className={`${styles.lightEleRectDot}`} />
        {arr.map((item, index) => (
          <View
            key={index}
            className={clsx(styles[`lightEleDot_${index}`], styles.lightEleDot)}
            style={{ background: _bgColor }}
          />
        ))}
      </View>
    );
  };
  const renderLine = (offBorderColor: string) => {
    return (
      <>
        <View
          className={`${styles.lightEleRectBg}`}
          style={{ background: onOff ? _bgColor : offBorderColor }}
        />
        <Image src={onOff ? stripOn : stripOff} className={`${styles.lightEleRect}`} />
      </>
    );
  };
  const lightShowType = getLightShowType();
  const isDot = lightShowType === ELightShowType.dot;
  return (
    <View
      key={idx}
      className={`${styles.lightEleItemWrapper} ${styles.lightEleItemWrapperLeftDown}`}
      onClick={() => onClick(!checked, idx)}
      hoverClassName="button-hover"
    >
      <RadioBox checked={checked} />
      {isDot ? renderDot() : renderLine(offBorderColor)}
      <View
        className={`${styles.lightBrightness}  ${styles.lightBrightnessEnd}`}
      >{`${brightness}%`}</View>
    </View>
  );
};

// 生成左开口向上的元素
const generateLeftUpEle = (data: TEleData, isGradient = false, lightNum = 20) => {
  const { idx, checked, bgColor, onOff = true, brightness, onClick } = data;
  let _bgColor = bgColor;
  if (isGradient && onOff) {
    const [preColor, currentColor, nextColor] = bgColor;
    _bgColor = `linear-gradient(315deg, ${preColor} -50%,${currentColor} 50%, ${nextColor} 150%)`;
  }
  if (!onOff) {
    _bgColor = offColor;
  }
  const renderDot = () => {
    const _bgColorRgba = getRgba(_bgColor, 0.1);
    return (
      <View
        className={`${styles.lightEleRectBgDot}`}
        style={{ background: onOff ? _bgColorRgba : offColor }}
      >
        <Image src={onOff ? stripOn : stripOff} className={`${styles.lightEleRectLeftUpDot}`} />
        {arr.map((item, index) => (
          <View
            key={index}
            className={clsx(styles[`lightEleDot_${index}`], styles.lightEleDot)}
            style={{ background: _bgColor }}
          />
        ))}
      </View>
    );
  };
  const renderLine = (offBorderColor: string) => {
    return (
      <Image
        src={onOff ? stripOn : stripOff}
        className={`${styles.lightEleRect} ${styles.lightEleRectLeftUp}`}
        style={{
          background: onOff ? _bgColor : offBorderColor,
        }}
      />
    );
  };
  const lightShowType = getLightShowType();
  const isDot = lightShowType === ELightShowType.dot;
  return (
    <View
      key={idx}
      className={`${styles.lightEleItemWrapper} ${styles.lightEleItemWrapperLeftUp}`}
      onClick={() => onClick(!checked, idx)}
      hoverClassName="button-hover"
    >
      <RadioBox checked={checked} />
      {isDot ? renderDot() : renderLine(offBorderColor)}
      <View
        className={`${styles.lightBrightness}  ${styles.lightBrightnessEnd}`}
      >{`${brightness}%`}</View>
    </View>
  );
};

// 生成右开口向下的元素
const generateRightDownEle = (data: TEleData, isGradient = false, lightNum = 20) => {
  const { idx, checked, bgColor, onOff = true, brightness, onClick } = data;
  let _bgColor = bgColor;
  if (isGradient && onOff) {
    const [preColor, currentColor, nextColor] = bgColor;
    _bgColor = `linear-gradient(135deg, ${preColor} -50%,${currentColor} 50%, ${nextColor} 120%)`;
  }
  if (!onOff) {
    _bgColor = offColor;
  }
  const renderDot = () => {
    const _bgColorRgba = getRgba(_bgColor, 0.1);
    return (
      <View
        className={`${styles.lightEleRectBgDot}`}
        style={{ background: onOff ? _bgColorRgba : offColor }}
      >
        <Image src={onOff ? stripOn : stripOff} className={`${styles.lightEleRectDot}`} />
        {arr.map((item, index) => (
          <View
            key={index}
            className={clsx(styles[`lightEleDot_${index}`], styles.lightEleDot)}
            style={{ background: _bgColor }}
          />
        ))}
      </View>
    );
  };
  const renderLine = (offBorderColor: string) => {
    return (
      <Image
        src={onOff ? stripOn : stripOff}
        className={`${styles.lightEleRect} ${styles.lightEleRectRightDown}`}
        style={{
          background: onOff ? _bgColor : offBorderColor,
        }}
      />
    );
  };
  const lightShowType = getLightShowType();
  const isDot = lightShowType === ELightShowType.dot;
  return (
    <View
      key={idx}
      className={`${styles.lightEleItemWrapper} ${styles.lightEleItemWrapperRightDown}`}
      onClick={() => onClick(!checked, idx)}
      hoverClassName="button-hover"
    >
      <RadioBox checked={checked} />
      {isDot ? renderDot() : renderLine(offBorderColor)}
      <View
        className={`${styles.lightBrightness}  ${styles.lightBrightnessEnd}`}
      >{`${brightness}%`}</View>
    </View>
  );
};

// 生成右开口向上的元素
const generateRightUpEle = (data: TEleData, isGradient = false, lightNum = 20) => {
  const { idx, checked, bgColor, onOff = true, brightness, onClick } = data;
  let _bgColor = bgColor;
  if (isGradient && onOff) {
    const [preColor, currentColor, nextColor] = bgColor;
    _bgColor = `linear-gradient(315deg, ${nextColor} -50%,${currentColor} 50%, ${preColor} 150%)`;
    console.warn(_bgColor, '_bgColor_bgColor');
  }
  if (!onOff) {
    _bgColor = offColor;
  }
  const renderDot = () => {
    const _bgColorRgba = getRgba(_bgColor, 0.1);
    return (
      <View
        className={`${styles.lightEleRectBgDot}`}
        style={{ background: onOff ? _bgColorRgba : offColor }}
      >
        <Image src={onOff ? stripOn : stripOff} className={`${styles.lightEleRectDot}`} />
        {arr.map((item, index) => (
          <View
            key={index}
            className={clsx(styles[`lightEleDot_${index}`], styles.lightEleDot)}
            style={{ background: _bgColor }}
          />
        ))}
      </View>
    );
  };
  const renderLine = (offBorderColor: string) => {
    return (
      <>
        <View
          className={`${styles.lightEleRectBg}`}
          style={{ background: onOff ? _bgColor : offBorderColor }}
        />
        <Image
          src={onOff ? stripOn : stripOff}
          className={`${styles.lightEleRect} ${styles.lightEleRectRightUp}`}
        />
      </>
    );
  };
  const lightShowType = getLightShowType();
  const isDot = lightShowType === ELightShowType.dot;
  return (
    <View
      key={idx}
      className={`${styles.lightEleItemWrapper} ${styles.lightEleItemWrapperRightUp}`}
      onClick={() => onClick(!checked, idx)}
      hoverClassName="button-hover"
    >
      <RadioBox checked={checked} />
      {isDot ? renderDot() : renderLine(offBorderColor)}
      <View
        className={`${styles.lightBrightness}  ${styles.lightBrightnessEnd}`}
      >{`${brightness}%`}</View>
    </View>
  );
};

const eleMap = {
  0: generateStartEle,
  1: generateHorizontalEle,
  2: generateHorizontalEle,
  3: generateHorizontalEle,
  4: generateHorizontalEle,
  5: generateLeftDownEle,

  6: generateLeftUpEle,
  7: generateHorizontalEle,
  8: generateHorizontalEle,
  9: generateHorizontalEle,
  10: generateHorizontalEle,
  11: generateHorizontalEle,
  12: generateRightDownEle,
  13: generateRightUpEle,
  14: generateHorizontalEle,
  15: generateHorizontalEle,
  16: generateHorizontalEle,
  17: generateHorizontalEle,
  18: generateHorizontalEle,
  19: generateEndEle,
};

function mapValue(value, inMin = 10, inMax = 1000, outMin = 200, outMax = 1000) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export const getLightEle = (index: number, data: TEleData, isGradient, lightNum) => {
  if (Array.isArray(data.bgColor)) {
    const bgColorList = data.bgColor.map(i => {
      const { h, s, v } = rgbStrToHsv(i);
      const realV = mapValue(v);
      const rgbStr = hsvToRgbStr({ h, s, v: realV });
      return rgbStr;
    });
    const _data = {
      ...data,
      bgColor: bgColorList,
    };
    return eleMap[index](_data, isGradient, lightNum);
  }
  const { h, s, v } = rgbStrToHsv(data.bgColor);
  const realV = mapValue(v);
  const rgbStr = hsvToRgbStr({ h, s, v: realV });
  const _data = {
    ...data,
    bgColor: rgbStr,
  };
  return eleMap[index](_data, isGradient, lightNum);
};
