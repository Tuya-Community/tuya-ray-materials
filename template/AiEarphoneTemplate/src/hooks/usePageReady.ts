import { useEffect, useState, useRef } from 'react';
import { fileListReadyBus } from '@/utils/fileListReadyBus';
import { pageReadyBus } from '@/utils/pageReadyBus';

/**
 * 用于控制延迟加载的应用级别 hooks
 */
export const usePageReady = () => {
  const [isReady, setIsReady] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const handleFileListReady = () => {
      if (!hasLoadedRef.current) {
        setIsReady(true);
        hasLoadedRef.current = true;
        fileListReadyBus.off('file-list-ready', handleFileListReady);
      }
    };

    const handlePageReady = (data: { path?: string }) => {
      if (!hasLoadedRef.current) {
        const path = data?.path;
        if (path === '/recordingMode' || path === '/detail') {
          setIsReady(true);
          hasLoadedRef.current = true;
          // 只监听一次，移除监听器
          pageReadyBus.off('page-ready', handlePageReady);
        }
      }
    };

    fileListReadyBus.on('file-list-ready', handleFileListReady);
    pageReadyBus.on('page-ready', handlePageReady);

    return () => {
      fileListReadyBus.off('file-list-ready', handleFileListReady);
      pageReadyBus.off('page-ready', handlePageReady);
    };
  }, []);

  return isReady;
};
