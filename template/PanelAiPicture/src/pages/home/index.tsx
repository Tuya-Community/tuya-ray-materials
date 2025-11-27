import React, { useCallback, useEffect, useState } from 'react';
import { View, ai, usePageEvent } from '@ray-js/ray';
import { NavBar, Tab, Tabs, Toast } from '@ray-js/smart-ui';
import { PreviewImage } from '@/components';
import Strings from '@/i18n';
import styles from './index.module.less';
import Enhance from './enhance';
import Correct from './correct';

export function Home() {
  const [previewImage, setPreviewImage] = useState({
    show: false,
    src: '',
    saveEnabled: false,
  });

  const handleClosePreviewImage = useCallback(() => {
    setPreviewImage({
      show: false,
      src: '',
      saveEnabled: false,
    });
  }, []);

  const handlePreviewImage = useCallback((src: string, saveEnabled: boolean) => {
    setPreviewImage({
      show: true,
      src,
      saveEnabled,
    });
  }, []);

  usePageEvent('onUnload', () => {
    // 页面卸载时，关闭 AI 图像增强实例，释放资源
    // When the page is unloaded, close the AI image enhancement instance and release resources
    ai.imageEnhanceDestroy({
      success: () => {
        console.log('AI imageEnhanceDestroy success');
      },
      fail: error => {
        console.error('AI imageEnhanceDestroy fail:', error);
      },
    });
  });

  useEffect(() => {
    // 页面进入时， 开启 AI 图像增强实例
    // When the page is loaded, open the AI image enhancement instance
    ai.imageEnhanceCreate({
      success: () => {
        console.log('AI imageEnhanceCreate success');
      },
      fail: error => {
        console.error('AI imageEnhanceCreate fail:', error);
      },
    });
  }, []);

  return (
    <>
      <NavBar leftText={Strings.getLang('title')} leftTextType="home" border={false} />
      <View className={styles.wrapper}>
        <Tabs sticky className={styles.tabs}>
          <Tab title={Strings.getLang('enhance')}>
            <Enhance onPreview={handlePreviewImage} />
          </Tab>
          <Tab title={Strings.getLang('correct')}>
            <Correct onPreview={handlePreviewImage} />
          </Tab>
        </Tabs>
      </View>
      <PreviewImage
        show={previewImage.show}
        src={previewImage.src}
        saveEnabled={previewImage.saveEnabled}
        onClose={handleClosePreviewImage}
      />
      <Toast id="smart-toast" />
    </>
  );
}

export default Home;
