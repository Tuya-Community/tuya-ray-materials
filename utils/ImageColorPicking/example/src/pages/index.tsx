import React, { useState } from 'react';
import { View, Text } from '@ray-js/ray';
import {
  imageColorPicking,
  ImageColorPicker,
  chooseCropImageSync,
  readImgSync,
} from '@ray-js/image-color-picking';
import styles from './index.module.less';

const DemoBlock = ({ title, children }) => (
  <View className={styles.demoBlock}>
    <View className={styles.demoBlockTitle}>
      <Text className={styles.demoBlockTitleText}>{title}</Text>
    </View>
    {children}
  </View>
);

export default function Home() {
  const [showColors1, setShowColors1] = useState<string[]>([]);
  const [showColors2, setShowColors2] = useState<string[]>([]);
  // 执行utils
  const run = async () => {
    const path: string = await chooseCropImageSync();
    const colors = await imageColorPicking({
      path,
      pickNum: 5,
      isPrimary: true,
    });
    setShowColors1(colors);
    console.log(colors, '--获取到的颜色');
  };

  const runBase64 = async () => {
    const path: string = await chooseCropImageSync();
    const fileBase64: string = await readImgSync(path);
    const colors = await imageColorPicking({
      base64: fileBase64,
      selector: '#my-custom',
    });
    setShowColors2(colors);
    console.log(colors, '--获取到的颜色');
  };

  return (
    <View className={styles.view}>
      <DemoBlock title="基础用法">
        <View onClick={run}>点击执行</View>
        <ImageColorPicker id="image-color-picking" />
        <View style={{ display: 'flex' }}>
          {showColors1.map(item => (
            <View
              style={{
                background: item,
                height: 50,
                flex: 1,
              }}
            />
          ))}
        </View>
      </DemoBlock>
      <DemoBlock title="传入base64用法和自定义id">
        <View onClick={runBase64}>点击执行</View>
        <ImageColorPicker id="my-custom" />
        <View style={{ display: 'flex' }}>
          {showColors2.map(item => (
            <View
              style={{
                background: item,
                height: 50,
                flex: 1,
              }}
            />
          ))}
        </View>
      </DemoBlock>
    </View>
  );
}
