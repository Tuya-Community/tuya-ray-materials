/*
 * @Author: mjh
 * @Date: 2025-01-02 18:03:19
 * @LastEditors: mjh
 * @LastEditTime: 2025-01-03 11:26:31
 * @Description:
 */
import React from 'react';
import Canvas from './components';
import { ImgCanvasProps, defaultProps } from './props';

export { chooseCropImageSync } from './utils/chooseCropImageSync';
export { readImgSync } from './utils/readfileSync';

export { imageColorPicking } from './utils/imageColorPicking';
export const ImageColorPicker = (props: ImgCanvasProps & { id: string }) => {
  return <Canvas {...props} bindgetColors={props.onColorsChange} />;
};
ImageColorPicker.defaultProps = defaultProps;
