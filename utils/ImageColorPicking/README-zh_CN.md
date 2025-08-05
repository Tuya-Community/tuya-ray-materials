[English](./README.md) | 简体中文

# @ray-js/image-color-picking

[![latest](https://img.shields.io/npm/v/@ray-js/image-color-picking/latest.svg)](https://www.npmjs.com/package/@ray-js/image-color-picking) [![download](https://img.shields.io/npm/dt/@ray-js/image-color-picking.svg)](https://www.npmjs.com/package/@ray-js/image-color-picking)

> 识图取色
> 内部通过 canvas 获取图片像素颜色，然后通过聚合算法计算出出现较多次且相互之间不是非常接近的若干数量的颜色

## 安装

```sh
$ npm install @ray-js/image-color-picking
// 或者
$ yarn add @ray-js/image-color-picking
```

## 使用

### 基本使用

1. 引入 `ImageColorPicker` 组件，放置在页面上，因为组件内部是通过 canvas 获取颜色的，所以需要页面上有一个组件作为获取颜色的基础， id 默认需要传 `image-color-picking`。
2. 引入 `imageColorPicking` 方法，传入文件路径获取主要颜色, `pickNum` 属性可以控制提取的主要颜色数量。

```tsx
import {
  imageColorPicking,
  ImageColorPicker,
  chooseCropImageSync,
} from '@ray-js/image-color-picking';

const Demo = () => {
  const run = async () => {
    // 调用app能力选择本地手机图片路径
    const path: string = await chooseCropImageSync();
    // 获取主要颜色
    const colors = await imageColorPicking({
      path,
      pickNum: 4,
    });
    console.log(colors, '--获取到的颜色');
  };

  return (
    <>
      <View onClick={run}>点击执行</View>
      <ImageColorPicker id="image-color-picking" />
    </>
  );
};
```

### 自定义 id 和传入 base64 用法

1. 通过挂载在页面上的组件设置不同的 id 如：`my-custom`, 则在调用 `imageColorPicking` 方法时也需要传对应的 `selector` 属性 使方法可以获取到此组件实例
2. 通过 `readImgSync` 方法将手机内的图片路径转换成 base64 格式，然后使用 `imageColorPicking` 方法发送给组件内部运行并返回颜色。

```tsx
import {
  imageColorPicking,
  ImageColorPicker,
  chooseCropImageSync,
  readImgSync,
} from '@ray-js/image-color-picking';

const Demo = () => {
  const run = async () => {
    // 调用app能力选择图片
    const path: string = await chooseCropImageSync();
    // 将手机内图片转化成base64
    const fileBase64: string = await readImgSync(path);
    // 获取主要颜色
    const colors = await imageColorPicking({
      base64: fileBase64,
      // 自定义的id
      selector: '#my-custom',
    });
    console.log(colors, '--获取到的颜色');
  };

  return (
    <>
      <View onClick={run}>点击执行</View>
      <ImageColorPicker id="my-custom" />
    </>
  );
};
```

## 方法和类型

| 参数                | 说明                                                                                        | 类型                                                              |
| ------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| ImageColorPicker    | 获取图片资源颜色的配套组件，需要和`imageColorPicking`结合使用                               | _ImgCanvasProps & { id: string }_                                 |
| imageColorPicking   | 获取图片资源颜色的配套方法，需要和`ImageColorPicker`结合使用                                | _(currOptions: ImageColorPickingOption = {}): Promise\<string[]>_ |
| chooseCropImageSync | 获取手机内本地图片的方法，基于`chooseCropImage`实现，封装成 promise，并增加部分权限申请逻辑 | _(sourceType?: "album" \| "camera"): Promise\<string>_            |
| readImgSync         | 读取本地手机图片资源转化成 base64 格式                                                      | _(path: string): Promise\<string>_                                |

### ImgCanvasProps

| 参数           | 说明                                                          | 类型                       | 默认值                       |
| -------------- | ------------------------------------------------------------- | -------------------------- | ---------------------------- |
| path           | 本地手机文件路径                                              | _string_                   | `''`                         |
| canvasId       | 自定义 canvas id                                              | _string_                   | `image-color-picking-canvas` |
| base64         | 图片 base64 字符串                                            | _string_                   | -                            |
| pickNum        | 提取的颜色数量                                                | _number_                   | `5`                          |
| isPrimary      | 是否保持原色，组件会默认调亮内部的颜色，关闭的话需要传入 true | _boolean_                  | -                            |
| onColorsChange | 颜色改变的回调                                                | _(colors: string[])=>void_ | -                            |

### ImageColorPickingOption

| 参数      | 说明                                                            | 类型      | 默认值                       |
| --------- | --------------------------------------------------------------- | --------- | ---------------------------- |
| selector  | 组件的 id 需要加上`#`开头                                       | _string_  | `#image-color-picking`       |
| path      | 本地手机文件路径                                                | _string_  | -                            |
| canvasId  | 自定义 canvas id，会自动根据 `selector` 属性加上 `-canvas` 后缀 | _string_  | `image-color-picking-canvas` |
| base64    | 图片 base64 字符串                                              | _string_  | -                            |
| pickNum   | 提取的颜色数量                                                  | _number_  | -                            |
| isPrimary | 是否保持原色，组件会默认调亮内部的颜色，关闭的话需要传入 true   | _boolean_ | -                            |
| context   | 原生小程序方式使用时 传 this；ray 方式使用时 不需要传           | _any_     | -                            |
