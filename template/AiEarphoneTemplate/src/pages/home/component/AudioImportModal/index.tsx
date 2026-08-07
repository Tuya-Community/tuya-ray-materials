import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Button } from '@ray-js/ray';
import { Circle, Transition } from '@ray-js/smart-ui';
import { useRequest } from 'ahooks';
import clsx from 'clsx';

import EllipsisText from '@/components/EllipsisText';
import { tttCancelImport, tttRetryImport } from '@/api/ttt';
import { FileImportStatus } from '@/constant/enums';
import Strings from '@/i18n';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import { FileImportStatusResult } from '@/api/ttt.interface';

import styles from './index.module.less';

interface IProps {
  show: boolean;
  importInfo: FileImportStatusResult;
  onClose: () => void;
  handleCancelRetry: () => void;
}

// 错误码到错误类型的映射表
const ERROR_CODE_MAP: Record<number, string> = {
  20103: 'audio_import_format_error',
  20110: 'audio_import_format_error',
  20111: 'audio_import_interrupt_error',
  20112: 'audio_import_interrupt_error',
  20106: 'audio_import_other_error',
  20108: 'audio_import_other_error',
  20109: 'audio_import_other_error',
  20113: 'audio_import_other_error',
};

const Index: React.FC<IProps> = ({ show, importInfo, onClose, handleCancelRetry }) => {
  const [showCircle, setShowCircle] = useState(false);

  // 延迟渲染 Circle 组件，避免 canvas 节点未准备好
  useEffect(() => {
    if (show) {
      // Dialog 打开后延迟渲染 Circle 组件
      const timer = setTimeout(() => {
        setShowCircle(true);
      }, 50);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [show]);

  // 计算进度百分比
  const percent = useMemo(() => {
    if (!importInfo?.totalFileCount) return 0;
    return (importInfo?.successCount / importInfo?.totalFileCount) * 100;
  }, [importInfo]);

  // 格式化失败文件列表
  const failedFileMap = useMemo<Record<string, string[]>>(() => {
    const failedFiles = importInfo?.failedFiles;
    if (!failedFiles || failedFiles.length === 0) return {};

    // 根据失败原因归类
    return (failedFiles as Array<{ fileName: string; code: string }>).reduce(
      (acc: Record<string, string[]>, { fileName, code }) => {
        const codeNum = Number(code);
        // 获取错误类型 key，如果没有映射则使用原始 code
        const errorKey = ERROR_CODE_MAP[codeNum] || code;

        // 初始化数组（如果不存在）并添加文件名
        (acc[errorKey] ??= []).push(fileName);

        return acc;
      },
      {} as Record<string, string[]>
    );
  }, [importInfo?.failedFiles]);

  // 取消导入
  const { run: handleCancelImport } = useRequest(tttCancelImport, {
    manual: true,
    onSuccess: () => {
      onClose();
    },
  });

  // 重试
  const { run: handleRetryImport } = useRequest(tttRetryImport, {
    manual: true,
  });

  return (
    <Transition
      show={show}
      name="fade"
      customClass={clsx(styles.container, {
        [styles.importingContainer]: importInfo?.status === FileImportStatus.Importing,
        [styles.failedContainer]:
          importInfo?.status === FileImportStatus.Imported && importInfo?.failedFiles?.length > 0,
      })}
    >
      {importInfo?.status === FileImportStatus.Imported && importInfo?.failedFiles?.length > 0 && (
        <>
          <View className={styles.header}>
            <ThemedImage imageName="warnIcon" src={Res.warnIcon} className={styles.icon} />
            <View className={styles.title}>
              {Strings.formatValue('audio_import_failed_tip', importInfo?.failedFiles?.length || 0)}
            </View>
          </View>
          <ScrollView className={styles.scrollView}>
            {Object.keys(failedFileMap).map(key => {
              return (
                <View className={styles.item}>
                  <View>{Strings.getLang(key as any)}：</View>
                  {failedFileMap[key].map(fileName => {
                    return (
                      <EllipsisText
                        key={`${key}-${fileName}`}
                        className={styles.fileName}
                        text={fileName}
                      />
                    );
                  })}
                </View>
              );
            })}
          </ScrollView>
          <View className={styles.action}>
            <Button className={styles.cancel} onClick={handleCancelRetry}>
              {Strings.getLang('cancel')}
            </Button>
            <Button className={styles.retry} onClick={handleRetryImport}>
              {Strings.getLang('retry')}
            </Button>
          </View>
        </>
      )}

      {importInfo?.status === FileImportStatus.Importing && (
        <>
          <View className={styles.left}>
            {showCircle && (
              <Circle
                percent={percent}
                size={18}
                trackWidth={3}
                trackColor="rgba(255,255,255,.2)"
                fillColor="#ffffff"
                maskColor="transparent"
                className={styles.circle}
              />
            )}
            <View>
              {Strings.formatValue('audio_importing_tip', importInfo?.totalFileCount || 0)}
            </View>
          </View>
          <Button className={styles.cancelBtn} onClick={handleCancelImport}>
            {Strings.getLang('cancel')}
          </Button>
        </>
      )}
    </Transition>
  );
};

export default Index;
