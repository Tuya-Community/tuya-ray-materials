English | [简体中文](./README-zh_CN.md)

# @ray-js/lamp-bead-strip

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-bead-strip/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-bead-strip) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-bead-strip.svg)](https://www.npmjs.com/package/@ray-js/lamp-bead-strip)

> Animated LED strip

Directly using `canvas` to draw animation effects, and internally preventing duplicate rendering, achieving simultaneous rendering of multiple animations on low-end machine pages without stuttering.

## Installation

```sh
$ npm install @ray-js/lamp-bead-strip
# or
$ yarn add @ray-js/lamp-bead-strip
```

## Develop

```sh
# watch compile component code
yarn watch
# watch compile demo
yarn start:tuya
```

## Usage

### Basic usage

`colors`and `canvasId`are mandatory, otherwise the animation cannot run`canvasId`must ensure page uniqueness. When we input different animation modes`mode`, the component will automatically play the animation.

```tsx
import LampBeadStrip from '@ray-js/lamp-bead-strip';
export default () => (
  <LampBeadStrip
    canvasId="diy-scene"
    speed={80}
    mode={10}
    colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
    contentValue={{ segmented: 1 }}
  />
);
```

### Pauses

`ready`allows you to set whether the animation of the component plays or pauses.

```tsx
import LampBeadStrip from '@ray-js/lamp-bead-strip';
export default () => (
  <LampBeadStrip
    canvasId="diy-scene1"
    mode={2}
    ready={false}
    colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
    contentValue={{ segmented: 1, direction: 1 }}
  />
);
```

### Customize Scaling Size

Since the components are drawn through canvas, the internal dimensions are fixed. The component internally handles screen scaling logic, which is controlled through the`scale`property. If you want to modify the size of a component, you can customize the`scale`property to achieve your goal. The following use case expects the component size to be`1.1`times larger than before.

> It should be noted that the component only sets the scale once during initialization, so if the scale property is changed or set after initialization, it will be invalid

```tsx
import LampBeadStrip from '@ray-js/lamp-bead-strip';
import { getSystemInfoSync } from '@ray-js/ray';

const { windowWidth = 375 } = getSystemInfoSync();
export default () => {
  const scale = (windowWidth / 375) * 1.1;
  return (
    <LampBeadStrip
      containerStyle={`height: ${48 * 1.1}rpx;width:${570 * 1.1}rpx;`}
      mode={16}
      canvasId="template2"
      scale={scale}
      colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
      contentValue={{ expand: 1 }}
    />
  );
};
```

### Set the light off color

`closeColor` can set the color of lights that do not have color in the animation, that is, the color of the light beads that turn off the lights in the device. This way, the light strip component can adapt to multiple background colors, preventing the node color that turns off the lights from being the same as the background color.

```tsx
import LampBeadStrip from '@ray-js/lamp-bead-strip';

export default () => {
  return (
    <LampBeadStrip
      mode={16}
      canvasId="template3"
      closeColor="rgba(255,255,255,.6)"
      colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
    />
  );
};
```

### Custom Animation（v1.1.0）

`customAnimationList`: Attributes can be used to customize animations. They are a list of animation frames, which is a two-dimensional array. Each internal array consists of 20 colors, equivalent to the colors of 20 lights in the animation frame component. The component will automatically loop through this animation list.  
`customAnimationChangeTime`: Switching the time of custom animation, the playback speed is controlled by this attribute, representing how much time to switch one stitch, in milliseconds.

```tsx
import LampBeadStrip from '@ray-js/lamp-bead-strip';
import React, { useMemo } from 'react';

export default () => {
  const customAnimationList = useMemo(() => {
    const colors = ['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)'];
    return colors.map(item => new Array(20).fill(item));
  }, []);

  return (
    <LampBeadStrip
      canvasId="template4"
      customAnimationList={customAnimationList}
      customAnimationChangeTime={500}
    />
  );
};
```

### Animation Mode

> Phase 1: 6, 1. Gradient, 2. Jump, 3. Breath, 4. Blink, 10. Flowing Water, 11. Rainbow  
> Phase 2 10, 5 shooting stars, 6 accumulation, 7 falling, 8 chasing light, 9 drifting, 12 flashing, 13 rebounding, 14 shuttling, 15 chaotic flashing, 16 opening and closing

| Animation mode value | description                    | Contains control types contentValue                                                                    |
| -------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| 1                    | （Phase 1）Gradient            | segmented（intact 0/subsection 1）                                                                     |
| 2                    | （Phase 1）Jump                | segmented（intact 0/subsection 1）                                                                     |
| 3                    | （Phase 1）Breath              | segmented（intact 0/subsection 1）                                                                     |
| 4                    | （Phase 1）Blink               | segmented（intact 0/subsection 1）                                                                     |
| 10                   | （Phase 1）Flowing Water       | direction（Clockwise 0/anti-clockwise 1）                                                              |
| 11                   | （Phase 1）Rainbow             | direction（Clockwise 0/anti-clockwise 1）                                                              |
| 5                    | （Phase 2）shooting stars      | direction（Clockwise 0/anti-clockwise 1） expand（shooting-stars 0/meteor-shower 1/Colorful-meteor 2） |
| 6                    | （Phase 2）accumulation        | direction（Clockwise 0/anti-clockwise 1） segmented（intact 0/subsection 1）                           |
| 7                    | （Phase 2）falling             | direction（Clockwise 0/anti-clockwise 1） segmented（intact 0/subsection 1）                           |
| 8                    | （Phase 2）chasing light       | direction（Clockwise 0/anti-clockwise 1）                                                              |
| 9                    | （Phase 2）drifting            | direction（Clockwise 0/anti-clockwise 1）                                                              |
| 12                   | （Phase 2）flashing            | segmented（intact 0/subsection 1）                                                                     |
| 13                   | （Phase 2）rebounding          | expand（rebound 0/Colorful rebound 1）                                                                 |
| 14                   | （Phase 2）shuttling           | -                                                                                                      |
| 15                   | （Phase 2）chaotic flashing    | -                                                                                                      |
| 16                   | （Phase 2）opening and closing | expand（Same Time 0/staggered 1）                                                                      |
