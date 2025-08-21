[English](./README.md) | 简体中文

# @ray-js/lamp-music-card

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-music-card/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-music-card) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-music-card.svg)](https://www.npmjs.com/package/@ray-js/lamp-music-card)

> 照明音乐律动组件

## 安装

```sh
$ npm install @ray-js/lamp-music-card
// 或者
$ yarn add @ray-js/lamp-music-card
```

## 使用
### 基础用法
```tsx
import LampMusicCard from '@ray-js/lamp-music-card';

const [active, setActive] = useState(false);
const theme = 'dark';
const data = {
  title: '音乐卡片', // 卡片标题
  icon: JazzImage, // 展示的icon图
  colorArr: musicColorArr1, // 可选 自定义颜色动画数据 默认使用musicColorArr1的颜色值
};
const onPlay = (active: boolean) => {
  setActive(active);
  console.log('onPlay', active);
  // 此处可以根据业务逻辑进行dp下发
};

<LampMusicCard
  data={data}
  active={active}
  onPlay={onPlay}
/>
```

### 进阶用法
- 自定义组件内部内容
```tsx
import LampMusicCard from '@ray-js/lamp-music-card';

const [active, setActive] = useState(false);
const theme = 'dark';
const data = {
  title: '音乐卡片', // 卡片标题
  icon: JazzImage, // 展示的icon图
  colorArr: musicColorArr1, // 可选 自定义颜色动画数据 默认使用musicColorArr1的颜色值
};
const onPlay = (active: boolean) => {
  setActive(active);
  console.log('onPlay', active);
  // 此处可以根据业务逻辑进行dp下发
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
        <Text style={{ color: '#fff' }}>这里是自定义内容</Text>
      </View>
    );
  }}
/>
```

### LampMusicBar 用法
```tsx
import { LampMusicBar, musicColorArr2 } from '@ray-js/lamp-music-card';

const colorList = [...musicColorArr2]; // 可自定义颜色效果
<LampMusicBar colorList={colorList} bgColor="#eee" />
```
