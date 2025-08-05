[English](./README.md) | Simplified Chinese

# @ray-js/image-color-picking

[![latest](https://img.shields.io/npm/v/@ray-js/image-color-picking/latest.svg)](https://www.npmjs.com/package/@ray-js/image-color-picking) [![download](https://img.shields.io/npm/dt/@ray-js/image-color-picking.svg)](https://www.npmjs.com/package/@ray-js/image-color-picking)

> Image color picking
> Internally, the color of image pixels is obtained through canvas, and then an aggregation algorithm is used to calculate the number of colors that appear multiple times and are not very close to each other

## Installation

```sh
$ npm install @ray-js/image-color-picking
// or
$ yarn add @ray-js/image-color-picking
```

## Usage

### Basic usage

1. Import the `ImageColorPicker` component and place it on the page. Since the component uses canvas to get colors, there must be a component on the page as a base for color retrieval. The default id to pass is `image-color-picking`.
2. Import the `imageColorPicking` method and pass in the file path to get the main colors. The `pickNum` attribute can control the number of main colors extracted.

```tsx
import {
  imageColorPicking,
  ImageColorPicker,
  chooseCropImageSync,
} from '@ray-js/image-color-picking';

const Demo = () => {
  const run = async () => {
    // Call app capability to choose an image from the local phone
    const path: string = await chooseCropImageSync();
    // Get the main colors
    const colors = await imageColorPicking({
      path,
      pickNum: 4,
    });
    console.log(colors, '--Colors retrieved');
  };

  return (
    <>
      <View onClick={run}>Click to Execute</View>
      <ImageColorPicker id="image-color-picking" />
    </>
  );
};
```

### Custom id and base64 usage

1. Set a different id like `my-custom` for the component mounted on the page. When calling the `imageColorPicking` method, pass the corresponding `selector` attribute so the method can get this component instance.
2. Use the `readImgSync` method to convert the image path from the phone into base64 format, then send it to the component for processing using the `imageColorPicking` method and return colors.

```tsx
import {
  imageColorPicking,
  ImageColorPicker,
  chooseCropImageSync,
  readImgSync,
} from '@ray-js/image-color-picking';

const Demo = () => {
  const run = async () => {
    // Call app capability to choose an image
    const path: string = await chooseCropImageSync();
    // Convert phone image to base64
    const fileBase64: string = await readImgSync(path);
    // Get the main colors
    const colors = await imageColorPicking({
      base64: fileBase64,
      // Custom id
      selector: '#my-custom',
    });
    console.log(colors, '--Colors retrieved');
  };

  return (
    <>
      <View onClick={run}>Click to Execute</View>
      <ImageColorPicker id="my-custom" />
    </>
  );
};
```

## Methods and Types

| Parameter           | Description                                                                                                                               | Type                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| ImageColorPicker    | Component for fetching colors from image resources, used with `imageColorPicking`                                                         | _ImgCanvasProps & { id: string }_                                 |
| imageColorPicking   | Method for fetching colors from image resources, used with `ImageColorPicker`                                                             | _(currOptions: ImageColorPickingOption = {}): Promise\<string[]>_ |
| chooseCropImageSync | A method to get local images from the phone, implemented based on `chooseCropImage`, wrapped as a promise, and adds some permission logic | _(sourceType?: "album" \| "camera"): Promise\<string>_            |
| readImgSync         | Reads local phone image resources and converts them to base64 format                                                                      | _(path: string): Promise\<string>_                                |

### ImgCanvasProps

| Parameter      | Description                                                                                                                                              | Type                       | Default                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ---------------------------- |
| path           | Local phone file path                                                                                                                                    | _string_                   | `''`                         |
| canvasId       | Custom canvas id                                                                                                                                         | _string_                   | `image-color-picking-canvas` |
| base64         | Image base64 string                                                                                                                                      | _string_                   | -                            |
| pickNum        | Number of colors to extract                                                                                                                              | _number_                   | `5`                          |
| isPrimary      | Whether to maintain the original color, the component will default to brightening the internal color. If it is turned off, it needs to be passed as true | _boolean_                  | -                            |
| onColorsChange | Callback for color change                                                                                                                                | _(colors: string[])=>void_ | -                            |

### ImageColorPickingOption

| Parameter | Description                                                                                                                                              | Type      | Default                      |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------- |
| selector  | The component id needs to be prefixed with `#`                                                                                                           | _string_  | `#image-color-picking`       |
| path      | Local phone file path                                                                                                                                    | _string_  | -                            |
| canvasId  | Custom canvas id, will automatically add `-canvas` suffix based on `selector`                                                                            | _string_  | `image-color-picking-canvas` |
| base64    | Image base64 string                                                                                                                                      | _string_  | -                            |
| pickNum   | Number of colors to extract                                                                                                                              | _number_  | -                            |
| isPrimary | Whether to maintain the original color, the component will default to brightening the internal color. If it is turned off, it needs to be passed as true | _boolean_ | -                            |
| context   | Pass `this` when using the native mini-program method; not needed for ray method                                                                         | _any_     | -                            |
