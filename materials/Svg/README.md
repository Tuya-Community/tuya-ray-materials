English | [简体中文](./README-zh_CN.md)

# @ray-js/svg

[![latest](https://img.shields.io/npm/v/@ray-js/svg/latest.svg)](https://www.npmjs.com/package/@ray-js/svg) [![download](https://img.shields.io/npm/dt/@ray-js/svg.svg)](https://www.npmjs.com/package/@ray-js/svg)

> Tuya Ray Svg

## Installation

```sh
$ npm install @ray-js/svg
# or
$ yarn add @ray-js/svg
```

## Unit Adaptation

`rpx2px` supports conversion to rem or px, and the Icon component has built-in support, but the tags in the Svg component are uncontrollable, so developers need to use the `rpx2px` method for adaptation.

## Icon Cutout Guide (Figma)

1. Select icon: select the corresponding icon to export, if it is not a Group, you can Group Selection and then Flatten.
2. Modify the viewport: the unified viewport of the Icon component is "0 0 1024 1024", which needs to meet this standard.
3. Export icon: Copy the icon selected in Figma to https://jakearchibald.github.io/svgomg/ to see if there are multiple paths, if not, you can directly copy the path, if so, it is recommended to use the vscode SVG plug-in to compress it path.
4. Multi-path: If you can't meet svg that cannot combine paths, you can still use Icon's multi-path mode.

## Usage

### Icon（single path）

```tsx
import { Icon } from '@ray-js/svg';

<Icon d="M960 481.882L960 -0.000732422H779.294V481.882H960ZM207.059 120.47H56.4706V481.882H207.059V120.47ZM658.824 1024V843.294C658.824 760.127 591.403 692.706 508.235 692.706C425.068 692.706 357.647 760.127 357.647 843.294V1024H658.824Z" />;
```

### Icon（multi path, multi color）

```tsx
import { Icon } from '@ray-js/svg';

<Icon
  d={[
    'M757.365 142.378C778.242 110.927 821.035 102.04 849.427 126.918C914.608 184.033 964.522 257.032 994.002 339.32C1031.2 443.157 1033.88 556.231 1001.62 661.711C969.371 767.19 903.918 859.434 815.008 924.711C726.098 989.988 618.485 1024.81 508.188 1023.99C397.891 1023.16 290.808 986.747 202.88 920.153C114.952 853.559 50.88 760.351 20.2021 654.403C-10.4758 548.456 -6.11927 435.433 32.6233 332.162C63.3252 250.323 114.32 178.074 180.345 121.937C209.104 97.4841 251.759 107.007 272.166 138.765C292.573 170.523 282.822 212.415 255.285 238.237C213.47 277.449 180.963 325.94 160.615 380.178C132.217 455.876 129.023 538.722 151.51 616.382C173.997 694.042 220.962 762.364 285.414 811.178C349.866 859.991 428.358 886.685 509.206 887.287C590.054 887.889 668.935 862.367 734.106 814.518C799.277 766.67 847.255 699.055 870.896 621.738C894.536 544.422 892.577 461.538 865.309 385.425C845.771 330.89 813.99 281.92 772.763 242.09C745.614 215.861 736.487 173.828 757.365 142.378Z',
    'M443.72 68.2667C443.72 30.564 474.284 0 511.987 0C549.689 0 580.253 30.564 580.253 68.2667V375.467C580.253 413.169 549.689 443.733 511.987 443.733C474.284 443.733 443.72 413.169 443.72 375.467V68.2667Z',
  ]}
  size={'100rpx'}
  color={['gray', 'red']}
/>;
```

### Circle

```tsx
import Svg from '@ray-js/svg';

<Svg width="80px" height="80px">
  <circle cx="40" cy="40" r="40" fill="red" />
</Svg>;
```

### Clip

```tsx
import Svg from '@ray-js/svg';

<Svg width="80px" height="80px" viewBox="40 40 40 40">
  <circle cx="40" cy="40" r="40" fill="red" />
</Svg>;
```

### Rectangle

```tsx
import Svg from '@ray-js/svg';

<Svg width="200px" height="100px">
  <rect width="200" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)" />
</Svg>;
```

### Ellipse Gradient

```tsx
import Svg from '@ray-js/svg';

<Svg width="170px" height="110px">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
    </linearGradient>
  </defs>
  <ellipse cx="85" cy="55" rx="85" ry="55" fill="url(#grad1)" />
</Svg>;
```

### Shadow

```tsx
import Svg from '@ray-js/svg';

<Svg>
  <defs>
    <filter id="f1" x="0" y="0" width="200%" height="200%">
      <feOffset result="offOut" in="SourceAlpha" dx="20" dy="20" />
      <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
      <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
    </filter>
  </defs>
  <rect width="90" height="90" stroke="green" stroke-width="3" fill="yellow" filter="url(#f1)" />
</Svg>;
```

### Progress

```tsx
import React from 'react';
import Svg from '@ray-js/svg';
import {useInterval} from 'ahooks'

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
```
