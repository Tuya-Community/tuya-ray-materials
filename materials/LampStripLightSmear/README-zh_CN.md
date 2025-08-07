[English](./README.md) | 简体中文

# @ray-js/lamp-strip-light-smear

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-strip-light-smear/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-strip-light-smear) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-strip-light-smear.svg)](https://www.npmjs.com/package/@ray-js/lamp-strip-light-smear)

> 灯带涂抹组件

## 安装

```sh
$ npm install @ray-js/lamp-strip-light-smear
// 或者
$ yarn add @ray-js/lamp-strip-light-smear
```

## 开发

```sh
# 实时编译组件代码
yarn watch
# 实时编译Demo代码
yarn start:tuya
```

## 使用

- [!注意 ⚠️：当前组件默认支持 20 个灯段，由于不同灯段展示的效果不一致，如果需要展示其他数量的灯段，可自行参照代码开发]
- [安装本组件后，在 node_module/@ray-js/lamp-strip-light-smear/src 文件夹下可以看到源码]
- [在 node_module/@ray-js/lamp-strip-light-smear/src/README.md 中描述了具体实现的逻辑]

```tsx
import DimmerStrip, { hsv2rgbString } from '@ray-js/lamp-strip-light-smear';
export default () => {
  const [smearedColor, setSmearedColor] = useState<HSV>({ h: 0, s: 1000, v: 1000 });
  const [lightColorMaps, setLightColorMaps] = useState({});
  const [smearMode, setSmearMode] = useState(SmearMode.all);

  useEffect(() => {
    // 模拟修改当前涂抹的颜色
    setTimeout(() => {
      setSmearedColor({ h: 120, s: 1000, v: 1000 });
    }, 1000);
  }, []);

  useEffect(() => {
    const _lightColorMaps = {};
    const { h, s, v } = smearedColor;
    new Array(20).fill(0).forEach((_, index) => {
      _lightColorMaps[index] = hsv2rgbString(h, s / 10, v / 10, 1);
    });
    setLightColorMaps(_lightColorMaps);
  }, []);

  const onChange = data => {
    const newCheckedMapColor = {};
    [...data].forEach(item => {
      newCheckedMapColor[item] = hsv2rgbString(
        smearedColor.h,
        smearedColor.s / 10,
        smearedColor.v / 10,
        1
      );
    });
    const _lightColorMaps = {
      ...lightColorMaps,
      ...newCheckedMapColor,
    };
    setLightColorMaps(_lightColorMaps);
  };

  const onEnd = data => {
    const newCheckedMapColor = {};
    [...data].forEach(item => {
      newCheckedMapColor[item] = hsv2rgbString(
        smearedColor.h,
        smearedColor.s / 10,
        smearedColor.v / 10,
        1
      );
    });
    const _lightColorMaps = {
      ...lightColorMaps,
      ...newCheckedMapColor,
    };
    setLightColorMaps(_lightColorMaps);
  };

  return (
    <DimmerStrip
      className="aaa"
      disabled={false}
      type={smearMode}
      gradient
      smearedColor={smearedColor}
      lightColorMaps={lightColorMaps}
      onLightChange={onChange}
      onLightEnd={onEnd}
    />
  );
};
```
