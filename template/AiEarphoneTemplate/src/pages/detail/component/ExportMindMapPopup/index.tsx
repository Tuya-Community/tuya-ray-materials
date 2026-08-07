import React, { useEffect, useRef, useCallback, useState } from 'react';
import { View, WebView } from '@ray-js/ray';
import { Button } from '@ray-js/smart-ui';

import Strings from '@/i18n';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import BottomSheetWithCustomTitle from '@/components/BottomSheetWithCustomTitle';
import CustomCoverView from '@/components/CustomCoverView';
import { tttShareLocalFile } from '@/api/ttt';
import { realtimeLog } from '@/utils';
import styles from './index.module.less';

interface IProps {
  show: boolean;
  summary: string;
  onClose?: () => void;
}

const Index: React.FC<IProps> = props => {
  const { show, onClose, summary: markdownText } = props;
  const [exportingMindMap, setExportingMindMap] = useState(false);
  const webviewContextRef = useRef<any>(null);

  const finishExport = useCallback(() => {
    setExportingMindMap(false);
    webviewContextRef.current = null;
    onClose?.();
  }, [onClose]);

  /** WebView onLoad：创建 WebviewContext，发送 markdown 让 WebView 开始渲染 */
  const handleLoad = useCallback(() => {
    // @ts-ignore
    if (!ty.createWebviewContext) {
      ty.showToast({ title: Strings.getLang('feature_not_supported'), icon: 'none' });
      finishExport();
      return;
    }
    // @ts-ignore
    webviewContextRef.current = ty.createWebviewContext('mindMapExporter');
    setTimeout(() => {
      realtimeLog.info('ExportMindMapPopup: send markdown_text');
      webviewContextRef.current?.postMessage({
        data: {
          action: 'markdown_text',
          text: markdownText,
          t: Date.now(),
        },
      });
    }, 300);
  }, [markdownText, finishExport]);

  /** 拿到 base64 → 写临时文件 → 系统分享 */
  const handleShareResult = useCallback(
    (base64: string) => {
      const pureBase64 = base64.replace(/^data:image\/\w+;base64,/, '');
      const tempFilePath = `thingfile://tmp/mindmap_${Date.now()}.png`;
      ty.getFileSystemManager().writeFile({
        filePath: tempFilePath,
        data: pureBase64,
        encoding: 'base64',
        success: async () => {
          try {
            await tttShareLocalFile(decodeURI(tempFilePath));
          } catch (error) {
            realtimeLog.info({
              title: 'ExportMindMapPopup: tttShareLocalFile failed',
              extra: { error: error?.message },
            });
          } finally {
            finishExport();
          }
        },
        fail: (error: any) => {
          realtimeLog.info({
            title: 'ExportMindMapPopup: getFileSystemManager failed',
            extra: { error: error?.message },
          });
          ty.showToast({ title: Strings.getLang('export_failed'), icon: 'none' });
          finishExport();
        },
      });
    },
    [finishExport]
  );

  /** WebView onMessage：处理 WebView 回传的各种消息 */
  const handleMessage = useCallback(
    async (event: any) => {
      const messageData = event.detail;
      switch (messageData.action) {
        case 'render_complete':
          realtimeLog.info('ExportMindMapPopup: render_complete success');
          webviewContextRef.current?.postMessage({
            data: {
              action: 'export_with_branding',
              t: Date.now(),
            },
          });
          break;

        case 'export_image_result':
          realtimeLog.info('ExportMindMapPopup: export_image_result');
          handleShareResult(messageData.base64);
          break;

        case 'export_image_error':
          realtimeLog.info({
            title: 'ExportMindMapPopup: export_image_error',
            extra: { error: messageData.msg },
          });
          ty.showToast({ title: Strings.getLang('export_failed'), icon: 'none' });
          finishExport();
          break;

        default:
          break;
      }
    },
    [handleShareResult, finishExport]
  );

  // 当 show 变为 true 时，触发导出流程
  useEffect(() => {
    if (show && markdownText && !exportingMindMap) {
      setExportingMindMap(true);
    }
  }, [show, markdownText, exportingMindMap]);

  return (
    <>
      <CustomCoverView>
        <BottomSheetWithCustomTitle
          customClass={styles.bottomSheet}
          show={show}
          onClose={finishExport}
          title={Strings.getLang('share_modal_export_mind_map')}
        >
          <View className={styles.content}>
            <ThemedImage
              imageName="downloadMindImg"
              src={Res.downloadMindImg}
              className={styles.downloadMindImg}
            />
            <Button
              type="info"
              customClass={styles.button}
              loadingText={Strings.getLang('export_ing')}
              loading
            />
          </View>
        </BottomSheetWithCustomTitle>
      </CustomCoverView>
      {/* 隐藏 WebView：仅在导出时按需挂载，导出完成后自动销毁。
          position fixed + top -100vh 保证 WebView 正常渲染（getBBox 需要元素在 DOM 中），
          同时对用户完全不可见。 */}
      {exportingMindMap && (
        <View className={styles.hiddenIframeContainer}>
          <WebView
            // @ts-ignore
            id="mindMapExporter"
            src="webview://webview/index.html"
            onLoad={handleLoad}
            onMessage={handleMessage}
          />
        </View>
      )}
    </>
  );
};

export default React.memo(Index);
