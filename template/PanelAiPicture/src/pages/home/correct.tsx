import React from 'react';
import { ScrollView, View, getCdnUrl } from '@ray-js/ray';
import Strings from '@/i18n';
import { enhanceImage } from '@/utils';
import cdnImage from '@cdn/cdnImage.json';
import styles from './index.module.less';
import ImageView from './image';

const images = [
  getCdnUrl('demo7.jpg', cdnImage),
  getCdnUrl('demo8.jpg', cdnImage),
  getCdnUrl('demo4.jpg', cdnImage),
];

/**
 * 添加图像到增强队列
 * Add image to enhancement queue
 * @param src
 * @returns
 */
const addEnhanceImage = (src: string) => {
  return enhanceImage(src, 'correct');
};

function Correct({ onPreview }: { onPreview: (src: string, saveEnabled: boolean) => void }) {
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
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default Correct;
