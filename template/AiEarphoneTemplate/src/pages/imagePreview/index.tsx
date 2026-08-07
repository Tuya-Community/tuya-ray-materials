import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from '@ray-js/components';
import { router, authorize, showToast, usePageEvent } from '@ray-js/ray';
import { downloadFile, saveImageToPhotosAlbum } from '@ray-js/api';
import debounce from 'lodash/debounce';
import ThemedImage from '@/components/ThemedImage';
import CanvasImagePreview from '@/components/CanvasImagePreview';
import Strings from '@/i18n';
import Res from '@/res';
import { consumePendingImagePreviewUrl } from './store';
import styles from './index.module.less';

const ImagePreviewPage = () => {
  const previewImageUrlRef = useRef(consumePendingImagePreviewUrl());
  const previewImageUrl = previewImageUrlRef.current;
  const [canvasEnabled, setCanvasEnabled] = useState(false);

  usePageEvent('onReady', () => {
    setCanvasEnabled(true);
  });

  // 设备面板：可能错过宿主 onReady，挂载后兜底开启 canvas
  useEffect(() => {
    setCanvasEnabled(true);
  }, []);

  const handleClose = useCallback(() => {
    router.back();
  }, []);

  const handleDownload = useMemo(
    () =>
      debounce(
        () => {
          if (!previewImageUrl) return;
          authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              downloadFile({
                url: previewImageUrl,
                success: ({ tempFilePath }) => {
                  saveImageToPhotosAlbum({
                    filePath: tempFilePath,
                    success: () => {
                      showToast({
                        title: Strings.getLang('summary_image_save_success'),
                        icon: 'success',
                      });
                    },
                    fail: () => {
                      showToast({ title: Strings.getLang('save_failed'), icon: 'error' });
                    },
                  });
                },
                fail: () => {
                  showToast({ title: Strings.getLang('save_failed'), icon: 'error' });
                },
              });
            },
            fail: () => {
              showToast({ title: Strings.getLang('save_failed'), icon: 'error' });
            },
          });
        },
        500,
        { leading: true, trailing: false }
      ),
    [previewImageUrl]
  );

  return (
    <View className={styles.container}>
      <CanvasImagePreview
        visible
        src={previewImageUrl || ''}
        canvasEnabled={canvasEnabled}
        bindclose={handleClose}
      />
      <View className={styles.downloadBtn} onClick={handleDownload}>
        <ThemedImage src={Res.summaryImageDownloadIcon} className={styles.downloadIcon} />
      </View>
    </View>
  );
};

export default React.memo(ImagePreviewPage);
