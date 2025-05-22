[English](./README.md) | 简体中文

# @ray-js/image-area-picker

[![latest](https://img.shields.io/npm/v/@ray-js/image-area-picker/latest.svg)](https://www.npmjs.com/package/@ray-js/image-area-picker) [![download](https://img.shields.io/npm/dt/@ray-js/image-area-picker.svg)](https://www.npmjs.com/package/@ray-js/image-area-picker)

> 框选图片特定区域

## 安装

```sh
$ npm install @ray-js/image-area-picker
// 或者
$ yarn add @ray-js/image-area-picker
```

## 开发

```sh
# 安装依赖
yarn

# 实时编译Demo代码
yarn start:tuya
```

## 代码演示

### 基础使用

- 通过选择相册图片后, 获取图片信息并传入组件, 拖动图片对应位置到框选区域
- 通过 `onTouchEnd` 获取截图所需要的数据, 包括 `topLeftX, topLeftY, bottomRightX, bottomRightY`
- 通过调用截图 API `cropImages`, 并将截取后的图片通过调用 `saveImageToPhotosAlbum` 保存到手机相册

```tsx
import React, { useState } from 'react';
import {
  View,
  chooseImage,
  getImageInfo,
  cropImages,
  saveImageToPhotosAlbum,
  showToast,
} from '@ray-js/ray';
import ImageAreaPicker from '@ray-js/image-area-picker';
import Strings from '../i18n';
import styles from './index.module.less';

type IData = {
  topLeftX: number;
  topLeftY: number;
  bottomRightX: number;
  bottomRightY: number;
};

type TempFileCB = {
  path: string;
  size?: number;
};

type ChooseImageResult = {
  tempFilePaths: string[];
  tempFiles?: TempFileCB[];
};

type ImageInfo = {
  width: number;
  height: number;
  orientation: string;
  type: string;
};

const chooseImageAsync = (options: { count: number }): Promise<ChooseImageResult> => {
  return new Promise((resolve, reject) => {
    chooseImage({
      ...options,
      success: resolve,
      fail: reject,
    });
  });
};

const getImageInfoAsync = (options: { src: string }): Promise<ImageInfo> => {
  return new Promise((resolve, reject) => {
    getImageInfo({
      ...options,
      success: resolve,
      fail: reject,
    });
  });
};

export default function Home() {
  const [imgInfo, setImgInfo] = useState({
    width: 300,
    height: 300,
    filePath: '',
  });

  const [areaInfo, setAreaInfo] = useState({
    topLeftX: 0,
    topLeftY: 0,
    bottomRightX: 0,
    bottomRightY: 0,
  });

  const handeSelectImage = async () => {
    try {
      const res: ChooseImageResult = await chooseImageAsync({ count: 1 });
      const src: string = res.tempFilePaths[0];

      const imageInfo: ImageInfo = await getImageInfoAsync({ src });
      setImgInfo({
        width: imageInfo.width,
        height: imageInfo.height,
        filePath: src,
      });
    } catch (err) {
      console.error('Select Image Error:', err);
    }
  };

  const handleTouchEnd = (data: IData) => {
    setAreaInfo({ ...data });
  };

  const handeSaveImage = () => {
    cropImages({
      cropFileList: [{ ...areaInfo, filePath: imgInfo.filePath }],
      success: res => {
        const { fileList: cropedFileList } = res;
        saveImageToPhotosAlbumAsync(cropedFileList);
      },
      fail: err => {
        console.error('cropImages fail', err);
      },
    });
  };

  const saveImageToPhotosAlbumAsync = croppedFileList => {
    croppedFileList.forEach(item => {
      saveImageToPhotosAlbum({
        filePath: item,
        success: res => {
          showToast({
            title: Strings.getLang('saveSuccess'),
            icon: 'none',
          });
          console.log('saveImageToPhotosAlbum success', res);
        },
        fail: err => {
          console.error('saveImageToPhotosAlbum fail', err);
        },
      });
    });
  };

  const handleError = err => {
    console.error('Image Load Error', err);
  };

  return (
    <View className={styles.pageWrapper}>
      <View className={styles.container}>
        <ImageAreaPicker
          filePath={imgInfo.filePath}
          imgWidth={imgInfo.width}
          imgHeight={imgInfo.height}
          onTouchEnd={handleTouchEnd}
          onError={handleError}
        />
      </View>
      <View className={styles.footer}>
        <View className={`${styles.btn} ${styles.subBtn}`} onClick={handeSelectImage}>
          {Strings.getLang('selectImage')}
        </View>
        <View className={styles.btn} onClick={handeSaveImage}>
          {Strings.getLang('save')}
        </View>
      </View>
    </View>
  );
}
```
