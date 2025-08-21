English | [简体中文](./README-zh_CN.md)

# @ray-js/lamp-music-card

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-music-card/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-music-card) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-music-card.svg)](https://www.npmjs.com/package/@ray-js/lamp-music-card)

> music rhythmic components

## Installation

```sh
$ npm install @ray-js/lamp-music-card
# or
$ yarn add @ray-js/lamp-music-card
```

## Usage

### Basic usage
```tsx
import LampMusicCard from '@ray-js/lamp-music-card';

const [active, setActive] = useState(false);
const theme = 'dark';
const data = {
  title: 'Music Card', // Card title
  icon: JazzImage, // icon
  colorArr: musicColorArr1, // optional  Custom color animation data uses the color value of musicColorArr1 by default
};
const onPlay = (active: boolean) => {
  setActive(active);
  console.log('onPlay', active);
  // Here, dp can be issued according to business logic.
};

<LampMusicCard
  data={data}
  active={active}
  onPlay={onPlay}
/>
```

### Advanced usage
- Customize the internal content of the component
```tsx
import LampMusicCard from '@ray-js/lamp-music-card';

const [active, setActive] = useState(false);
const theme = 'dark';
const data = {
  title: 'Music Card', // Card title
  icon: JazzImage, // icon
  colorArr: musicColorArr1, // optional  Custom color animation data uses the color value of musicColorArr1 by default
};
const onPlay = (active: boolean) => {
  setActive(active);
  console.log('onPlay', active);
  // Here, dp can be issued according to business logic.
};

<LampMusicCard
  data={data}
  style={{
    border: '1px solid rgba(255, 255, 255, 0.1)',
  }}
  iconColor="#ffffff"
  active={active}
  onPlay={onPlay}
  renderCustom={() => {
    return (
      <View
        style={{
          width: '100%',
          height: '50px',
          borderRadius: '4px',
          background: '#333',
          display: 'flex',
          paddingLeft: '20px',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff' }}>Custom Text</Text>
      </View>
    );
  }}
/>
```

### LampMusicBar usage
```tsx
import { LampMusicBar, musicColorArr2 } from '@ray-js/lamp-music-card';

const colorList = [...musicColorArr2]; // Customizable color effects
<LampMusicBar colorList={colorList} bgColor="#eee" />
```
