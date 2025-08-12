import React from 'react';
import { View, Text } from '@ray-js/ray';
import Svg, {Icon} from '@ray-js/svg';
import {useInterval} from 'ahooks'
import styles from './index.module.less';
import {icons} from '../res'

const DemoBlock = ({ title, children }) => (
  <View className={styles.demoBlock}>
    <View className={styles.demoBlockTitle}>
      <Text className={styles.demoBlockTitleText}>{title}</Text>
    </View>
    {children}
  </View>
);

export default function Home() {
  const percent = React.useRef(0)
  const [stroke, setStroke] = React.useState(0)

  const scope = 330
  useInterval(() => {
    if (percent.current >= 0 && percent.current < 100) {
      percent.current = percent.current + 1
      setStroke(percent.current / 100 * scope)
    } else {
      percent.current = 0
      setStroke(0)
    }
  }, 1000)
  return (
    <View className={styles.view}>
      <DemoBlock title="Icon（单 path）">
        <Icon d={icons.power}></Icon>
      </DemoBlock>
      <DemoBlock title="Icon（多 path、多色）">
        <Icon d={icons.switch} size={'100rpx'} color={['gray', 'red']}></Icon>
      </DemoBlock>
      <DemoBlock title="圆形">
        <Svg
          width="80px"
          height="80px"
        >
          <circle cx="40" cy="40" r="40" fill="red" />
        </Svg>
      </DemoBlock>
      <DemoBlock title="裁切">
        <Svg
          width="80px"
          height="80px"
          viewBox="40 40 40 40"
        >
          <circle cx="40" cy="40" r="40" fill="red" />
        </Svg>
      </DemoBlock>
      <DemoBlock title="矩形">
        <Svg
          width="200px"
          height="100px"
        >
          <rect width="200" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)" />
        </Svg>
      </DemoBlock>
      <DemoBlock title="椭圆渐变">
        <Svg
          width="170px"
          height="110px"
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
              <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
            </linearGradient>
          </defs>
          <ellipse cx="85" cy="55" rx="85" ry="55" fill="url(#grad1)" />
        </Svg>
      </DemoBlock>
      <DemoBlock title="阴影">
        <Svg>
          <defs>
            <filter id="f1" x="0" y="0" width="200%" height="200%">
              <feOffset result="offOut" in="SourceAlpha" dx="20" dy="20" />
              <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
              <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
          </defs>
          <rect width="90" height="90" stroke="green" stroke-width="3"
          fill="yellow" filter="url(#f1)" />
        </Svg>
      </DemoBlock>
      <DemoBlock title="圆形进度条">
        <Svg
          width="160px"
          height="160px"
        >
          <defs>
            <linearGradient id="color">
              <stop offset="0%"  stop-color="#229453"/>
              <stop offset="50%"  stop-color="#66c18c"/>
              <stop offset="100%" stop-color="#b9dec9"/>
            </linearGradient>
          </defs>
          <circle cx='80' cy='80' r='70' stroke='#999999' stroke-width="20" fill="none" stroke-dasharray="330,300" stroke-linecap="round" transform="rotate(135, 80, 80)"></circle>
          <circle cx='80' cy='80' r='70' stroke='pink' stroke-width="10" fill="none"  stroke-dasharray="330,300" stroke-linecap="round" transform="rotate(135, 80, 80)"></circle>
          <circle cx='80' cy='80' r='70' stroke='url(#color)' stroke-width="10" fill="none" style={`stroke-dasharray: ${stroke},900; transition: stroke-dasharray 2s`} stroke-linecap="round" transform="rotate(135, 80, 80)"></circle>
        </Svg>
      </DemoBlock>
    </View>
  );
}
