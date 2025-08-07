English | [简体中文](./README-zh_CN.md)

# @ray-js/lamp-strip-light-smear

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-strip-light-smear/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-strip-light-smear) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-strip-light-smear.svg)](https://www.npmjs.com/package/@ray-js/lamp-strip-light-smear)

> lamp-strip-light-smear

## Installation

```sh
$ npm install @ray-js/lamp-strip-light-smear
# or
$ yarn add @ray-js/lamp-strip-light-smear
```

## Develop

```sh
# watch compile component code
yarn watch
# watch compile demo
yarn start:tuya
```

## Usage

- [! Note ⚠️ : The current component supports 20 light segments by default, because different light segments display effect is not consistent, if you need to display other number of light segments, you can refer to the code development]
- [After installing this component, you can see the source code in the node_module/@ray-js/lamp-strip-light-smear/src folder]
- [The implementation logic is described in node_module/@ray-js/lamp-strip-light-smear/src/README.md]

```tsx
import DimmerStrip, { hsv2rgbString } from '@ray-js/lamp-strip-light-smear';
export default () => {
  const [smearedColor, setSmearedColor] = useState<HSV>({ h: 0, s: 1000, v: 1000 });
  const [lightColorMaps, setLightColorMaps] = useState({});
  const [smearMode, setSmearMode] = useState(SmearMode.all);

  useEffect(() => {
    // Simulation modifies the color of the current smear
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
