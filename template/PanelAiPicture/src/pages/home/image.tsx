import React, { FC, useCallback, useEffect, useState } from 'react';
import { downloadFile, Image, ScrollView, Text, View } from '@ray-js/ray';
import { Loading } from '@ray-js/smart-ui';
import Strings from '@/i18n';
import styles from './index.module.less';

interface Props {
  onPreview: (src: string, saveEnabled: boolean) => void;
  src: string;
  enhance: (src: string) => Promise<string>;
}

const ImageView: FC<Props> = ({ onPreview, src, enhance }) => {
  const [enhanceSrc, setEnhanceSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handlePreview = useCallback(() => {
    onPreview(src, false);
  }, [src]);

  const handlePreviewEnhance = useCallback(() => {
    if (enhanceSrc) {
      onPreview(enhanceSrc, true);
    } else {
      setLoading(true);
      // 如果是远程图片，则需要先下载到本地
      // If it is a remote image, it needs to be downloaded to the local first
      if (src.indexOf('http') === 0) {
        downloadFile({
          url: src,
          success: res => {
            console.log('downloadFile success', res);
            enhance(res.tempFilePath)
              .then(path => {
                console.log('enhance success', path, src);
                setEnhanceSrc(path);
                setLoading(false);
              })
              .catch(err => {
                setError(true);
                setLoading(false);
              });
          },
          fail: err => {
            console.log('downloadFile fail', err);
            setError(true);
            setLoading(false);
          },
        });
      } else {
        enhance(src)
          .then(res => {
            setEnhanceSrc(res);
            setLoading(false);
          })
          .catch(err => {
            setError(true);
            setLoading(false);
          });
      }
    }
  }, [enhanceSrc]);

  useEffect(() => {
    setError(false);
    setEnhanceSrc('');
  }, [src]);

  return (
    <View className={styles.image}>
      <View className={styles.imageItem} onClick={handlePreview}>
        <Image src={src} className={styles.source} mode="aspectFit" />
      </View>
      <View className={styles.imageItem} onClick={handlePreviewEnhance}>
        <Image src={enhanceSrc} className={styles.target} mode="aspectFit" />
        {loading && (
          <View className={styles.loading}>
            <Loading />
          </View>
        )}
        {error && (
          <View className={styles.error}>
            <Text>{Strings.getLang('enhanceError')}</Text>
          </View>
        )}
        {!enhanceSrc && !error && !loading && (
          <View className={styles.error}>
            <Text>{Strings.getLang('doEnhance')}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ImageView;
