# @ray-js/lamp-color-collection

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-color-collection/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-color-collection) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-color-collection.svg)](https://www.npmjs.com/package/@ray-js/lamp-color-collection)

> 照明色彩收藏组件

## 安装

```sh
$ npm install @ray-js/components-ty-lamp
// 或者
$ yarn add @ray-js/components-ty-lamp
```

## 使用

### 基础用法

```tsx
import { LampColorCollection } from '@ray-js/components-ty-lamp';

const defaultColorList = [
  { h: 200, s: 1000, v: 1000 },
  { b: 1000, t: 670 },
];

const [colorList, setColorList] = useState(defaultColorList);
const [activeIndex, setActiveIndex] = useState(0);
const handleAdd = () => {
  setColorList([
    ...colorList,
    {
      b: Math.round(Math.random() * 1000),
      t: Math.round(Math.random() * 1000),
    },
  ]);
};

const handleDelete = (_colorList, _activeIndex) => {
  setColorList([..._colorList]);
  setActiveIndex(_activeIndex);
};

const handleChecked = (colorItem, _activeIndex: number) => {
  setActiveIndex(_activeIndex);
};

<LampColorCollection
  disableDelete={colorList.length > 2}
  theme="dark"
  activeIndex={activeIndex}
  colorList={colorList}
  onAdd={handleAdd}
  onDelete={handleDelete}
  onChecked={handleChecked}
/>;
```

### 高级用法：超过 2 个后 点击可删除，最多 10 个(默认 6 个) 注意 ⚠️：V1.2.0 版本新增

```tsx
import { LampColorCollection } from '@ray-js/components-ty-lamp';

const { ColorCollectInnerDelete } = LampColorCollection;
const defaultColorList = [
  { h: 200, s: 1000, v: 1000 },
  { b: 1000, t: 670 },
];

const [colorList, setColorList] = useState(defaultColorList);
const [activeIndex, setActiveIndex] = useState(0);
const handleAdd = () => {
  setColorList([
    ...colorList,
    {
      b: Math.round(Math.random() * 1000),
      t: Math.round(Math.random() * 1000),
    },
  ]);
};

const handleDelete = (_colorList, _activeIndex) => {
  setColorList([..._colorList]);
  setActiveIndex(_activeIndex);
};

const handleChecked = (colorItem, _activeIndex: number) => {
  setActiveIndex(_activeIndex);
};

<ColorCollectInnerDelete
  disableDelete={colorList.length > 2}
  theme="light"
  activeIndex={activeIndex}
  colorList={colorList}
  onAdd={handleAdd}
  onDelete={handleDelete}
  onChecked={handleChecked}
/>;
```

### 高级用法：自定义删除按钮样式 注意 ⚠️：V1.2.0 版本新增

```tsx
import { LampColorCollection } from '@ray-js/components-ty-lamp';
const { ColorCollectInnerDelete } = LampColorCollection;

const defaultColorList = [
  { h: 200, s: 1000, v: 1000 },
  { b: 1000, t: 670 },
];

const [colorList, setColorList] = useState(defaultColorList);
const [activeIndex, setActiveIndex] = useState(0);
const handleAdd = () => {
  setColorList([
    ...colorList,
    {
      b: Math.round(Math.random() * 1000),
      t: Math.round(Math.random() * 1000),
    },
  ]);
};

const handleDelete = (_colorList, _activeIndex) => {
  setColorList([..._colorList]);
  setActiveIndex(_activeIndex);
};

const handleChecked = (colorItem, _activeIndex: number) => {
  setActiveIndex(_activeIndex);
};
<ColorCollectInnerDelete
  disableDelete={colorList.length > 2}
  theme="dark"
  addButtonPos="tail"
  activeIndex={activeIndex}
  colorList={colorList}
  onAdd={handleAdd}
  onDelete={handleDelete}
  onChecked={handleChecked}
  renderDeleteElement={() => (
    <View
      style={{
        position: 'absolute',
        top: '50%',
        right: '50%',
        transform: 'translateY(-50%) translateX(50%)',
        width: 40,
        height: 4,
        borderRadius: 10,
        backgroundColor: 'red',
        zIndex: 10,
      }}
    />
  )}
/>;
```
