English | [简体中文](./README-zh_CN.md)

# @ray-js/circle-progress

[![latest](https://img.shields.io/npm/v/@ray-js/circle-progress/latest.svg)](https://www.npmjs.com/package/@ray-js/circle-progress) [![download](https://img.shields.io/npm/dt/@ray-js/circle-progress.svg)](https://www.npmjs.com/package/@ray-js/circle-progress)

> Universal Ring

## Installation

```sh
$ npm install @ray-js/circle-progress
# or
$ yarn add @ray-js/circle-progress
```

## Usage

### Note: If the model does not support the ctx.createConicGradient property, the rendering will be degraded, i.e. there will be no rounded corners at both ends

### Basic Usage

```tsx
import RayCircleProgress from '@ray-js/circle-progress';

const [value, setValue] = useState(0);

const handleMove = (v: number) => {
  console.warn('handleMove', v);
  setValue(v);
};

const handleEnd = (v: number) => {
  console.warn('handleEnd', v);
  setValue(v);
};

<RayCircleProgress
  value={value}
  startDegree={125}
  offsetDegree={290}
  onTouchMove={handleMove}
  onTouchEnd={handleEnd}
/>;
```

### Advanced capability 1: Customize color Customize ring radius

```tsx
import RayCircleProgress from '@ray-js/circle-progress';

const [value, setValue] = useState(0);

const handleMove = (v: number) => {
  console.warn('handleMove', v);
  setValue(v);
};

const handleEnd = (v: number) => {
  console.warn('handleEnd', v);
  setValue(v);
};

<RayCircleProgress
  value={value}
  ringRadius={100}
  innerRingRadius={84}
  colorList={[
    { offset: 0, color: '#fbebaf' },
    { offset: 0.25, color: '#efb4a3' },
    { offset: 0.5, color: '#ee7a79' },
    { offset: 1, color: '#ec80a7' },
  ]}
  startDegree={180}
  offsetDegree={180}
  onTouchMove={handleMove}
  onTouchEnd={handleEnd}
/>;
```

### Advanced Ability 2: Custom Color Down Ring

```tsx
import RayCircleProgress from '@ray-js/circle-progress';

const [value, setValue] = useState(0);

const handleMove = (v: number) => {
  console.warn('handleMove', v);
  setValue(v);
};

const handleEnd = (v: number) => {
  console.warn('handleEnd', v);
  setValue(v);
};

<RayCircleProgress
  value={value}
  innerRingRadius={84}
  ringRadius={100}
  startDegree={300}
  offsetDegree={300}
  colorList={[
    { offset: 0, color: '#eced77' },
    { offset: 0.5, color: '#ef865b' },
    { offset: 1, color: '#7be0f8' },
  ]}
  onTouchMove={handleMove}
  onTouchEnd={handleEnd}
/>;
```

### Advanced Ability 3: Custom Color Downward Horizontal Ring

```tsx
import RayCircleProgress from '@ray-js/circle-progress';

const [value, setValue] = useState(0);

const handleMove = (v: number) => {
  console.warn('handleMove', v);
  setValue(v);
};

const handleEnd = (v: number) => {
  console.warn('handleEnd', v);
  setValue(v);
};
<RayCircleProgress
  value={value3}
  innerRingRadius={84}
  ringRadius={100}
  startDegree={0}
  colorList={[
    { offset: 0, color: '#e8a989' },
    { offset: 0.5, color: '#efce85' },
    { offset: 1, color: '#d66e6b' },
  ]}
  offsetDegree={180}
  onTouchMove={handleMove3}
  onTouchEnd={handleEnd3}
/>;
```

### Advanced ability 4: Custom color full circle

```tsx
import RayCircleProgress from '@ray-js/circle-progress';

const [value, setValue] = useState(0);

const handleMove = (v: number) => {
  console.warn('handleMove', v);
  setValue(v);
};

const handleEnd = (v: number) => {
  console.warn('handleEnd', v);
  setValue(v);
};

<RayCircleProgress
  value={value}
  startDegree={90}
  offsetDegree={360}
  colorList={[
    { offset: 0, color: '#e8a989' },
    { offset: 0.5, color: '#efce85' },
    { offset: 1, color: '#d66e6b' },
  ]}
  onTouchMove={handleMove}
  onTouchEnd={handleEnd}
/>;
```

### Advanced Capability 5: Customizing Internal Elements

```tsx
import RayCircleProgress from '@ray-js/circle-progress';

const [value, setValue] = useState(0);

const handleMove = (v: number) => {
  console.warn('handleMove', v);
  setValue(v);
};

const handleEnd = (v: number) => {
  console.warn('handleEnd', v);
  setValue(v);
};

<RayCircleProgress
  value={value4}
  startDegree={45}
  offsetDegree={315}
  colorList={[
    { offset: 0, color: '#e8a989' },
    { offset: 0.5, color: '#efce85' },
    { offset: 1, color: '#d66e6b' },
  ]}
  renderInnerCircle={() => (
    <View
      style={{
        width: 160,
        height: 160,
        backgroundColor: '#d66e6b',
        borderRadius: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Custom content: */}
      <Text>Custom:{value}</Text>
    </View>
  )}
  onTouchMove={handleMove}
  onTouchEnd={handleEnd}
/>;
```

### Advanced Usage 6: Supports custom thumb radius and thumb border

```tsx
<RayCircleProgress
  value={value}
  ringRadius={135}
  innerRingRadius={130}
  colorList={[
    { offset: 0, color: '#295bdd' },
    { offset: 0.5, color: '#6A53D1' },
    { offset: 1, color: '#f65028' },
  ]}
  thumbRadius={30}
  thumbOffset={20}
  thumbBorderWidth={0}
  startDegree={135}
  offsetDegree={270}
  touchCircleStrokeStyle="rgba(0, 0, 0, 0.4)"
  onTouchStart={handleTouchStart}
  onTouchMove={handleMove}
  onTouchEnd={handleEnd}
/>
```

### Advanced Usage 7: Supports the background color function of the sliding area

```tsx
<RayCircleProgress
  value={value}
  trackColor="#ef7e85"
  colorList={[
    { offset: 0, color: '#e8a989' },
    { offset: 1, color: '#e8a989' },
  ]}
  startDegree={135}
  offsetDegree={270}
  touchCircleStrokeStyle="rgba(0, 0, 0, 0.4)"
  thumbBorderWidth={0}
  onTouchStart={handleTouchStart}
  onTouchMove={handleMove}
  onTouchEnd={handleEnd}
/>
```
