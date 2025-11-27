import React, { useCallback } from 'react';
import { ScrollView, View, ai, chooseImage, env, getCdnUrl } from '@ray-js/ray';
import { Button } from '@ray-js/smart-ui';
import { enhanceImage } from '@/utils';
import cdnImage from '@cdn/cdnImage.json';
import Strings from '@/i18n';
import ImageView from './image';
import styles from './index.module.less';

const images = [
  getCdnUrl('demo5.png', cdnImage),
  getCdnUrl('demo6.png', cdnImage),
  getCdnUrl('demo3.png', cdnImage),
];

/**
 * 添加图像到增强队列
 * Add image to enhancement queue
 * @param src
 * @returns
 */
const addEnhanceImage = (src: string) => {
  return enhanceImage(src, 'enhance');
};

function Enhance({ onPreview }: { onPreview: (src: string, saveEnabled: boolean) => void }) {
  const [list, setList] = React.useState<string[]>([]);
  const handleSelectImage = useCallback(() => {
    // 选择图片
    // Select image
    chooseImage({
      success: res => {
        console.log('chooseCropImage success', res);
        setList(prev => [...prev, ...res.tempFilePaths]);
      },
      fail: error => {
        console.error('chooseCropImage fail', error);
      },
    });
  }, []);

  return (
    <View className={styles.enhance}>
      <View className={styles.titles}>
        <View>{Strings.getLang('source')}</View>
        <View>{Strings.getLang('target')}</View>
      </View>
      <ScrollView scrollY className={styles.scroll}>
        <View className={styles.content}>
          <View className={styles.imgList}>
            {images.map((item, index) => (
              <ImageView key={index} src={item} onPreview={onPreview} enhance={addEnhanceImage} />
            ))}
            {list.map((item, index) => (
              <ImageView
                key={`custom_${index}`}
                src={item}
                onPreview={onPreview}
                enhance={addEnhanceImage}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <View className={styles.tools}>
        <Button className={styles.btn} type="primary" onClick={handleSelectImage}>
          {Strings.getLang('selectImg')}
        </Button>
      </View>
    </View>
  );
}

export default Enhance;
