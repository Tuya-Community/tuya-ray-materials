import React, { useCallback, FC, useContext, useMemo } from 'react';
import { View } from '@ray-js/ray';
import { Icon } from '@ray-js/smart-ui';
import clsx from 'clsx';
import rightIcon from '@tuya-miniapp/icons/dist/svg/Right';

import CustomCoverView from '@/components/CustomCoverView';
import BottomSheetWithCustomTitle from '@/components/BottomSheetWithCustomTitle';
import res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import Strings from '@/i18n';
import { TransferStatus, SummaryStatus, SingleCloudSyncStatus } from '@/constant/enums';
import { useSelector } from '@/redux';
import FileDetailContext from '../../context';

import styles from './index.module.less';

type MenuCategory = 'edit' | 'process' | 'translate' | 'copy' | 'export' | 'share' | 'manage';

interface MoreMenuItem {
  title: string;
  icon: string;
  iconName: string;
  disabled?: boolean;
  onClick?: () => void;
  category?: MenuCategory; // 菜单项类别，用于分组
}

interface Props {
  show: boolean;
  onClose: () => void;
  moreListData?: MoreMenuItem[]; // 更多菜单项数据
  // 弹窗控制回调函数
  onOpenCopyConfigPopup: () => void;
  onOpenExportTranscriptionConfigPopup: () => void;
  onOpenExportSummaryConfigPopup: () => void;
  onOpenShareConfigPopup: () => void;
  onOpenCloudSyncPopup: () => void;
  onExportAudio: () => void;
  onCopySummary: () => void;
  onExportMindMap: () => void;
  checkTransferStatus: () => boolean;
  checkSummaryAvailable: () => boolean;
  checkMindAvailable: () => boolean;
}

enum ExportContentType {
  Summary = 'summary',
  Transfer = 'transfer',
  Translate = 'translate',
}

const MoreModal: FC<Props> = ({
  show,
  onClose,
  moreListData = [],
  onOpenCopyConfigPopup,
  onOpenExportTranscriptionConfigPopup,
  onOpenExportSummaryConfigPopup,
  onOpenShareConfigPopup,
  onOpenCloudSyncPopup,
  onExportAudio,
  onCopySummary,
  onExportMindMap,
  checkTransferStatus,
  checkSummaryAvailable,
  checkMindAvailable,
}) => {
  const { cloudSyncSwitchStatus } = useSelector(state => state.uiState);
  const { fileDetail } = useContext(FileDetailContext);
  const transferStatus = fileDetail?.transfer;
  const summaryStatus = fileDetail?.summary;
  // 复制转写（打开配置弹窗）
  const copyTranscription = useCallback(() => {
    if (checkTransferStatus()) {
      onOpenCopyConfigPopup();
    }
  }, [checkTransferStatus, onOpenCopyConfigPopup]);

  // 检查转写是否成功
  const isTransferSuccess = transferStatus === TransferStatus.Success;

  // 检查总结是否可用
  const isSummaryAvailable = useMemo(() => {
    return isTransferSuccess && summaryStatus === SummaryStatus.Success;
  }, [isTransferSuccess, summaryStatus]);

  // 处理导出操作
  const handleExportAction = useCallback(
    (contentType: ExportContentType) => {
      if (contentType === ExportContentType.Transfer) {
        // 转写导出显示配置弹窗
        onOpenExportTranscriptionConfigPopup();
      } else if (contentType === ExportContentType.Summary) {
        // 转写总结显示配置弹窗
        onOpenExportSummaryConfigPopup();
      }
    },
    [onOpenExportTranscriptionConfigPopup, onOpenExportSummaryConfigPopup]
  );

  // 分享列表
  const listData = useMemo(() => {
    const shareList = [
      {
        title: Strings.getLang('share_modal_copy_transcription'),
        icon: res.imgCopyTranscription,
        iconName: 'imgCopyTranscription',
        category: 'copy' as MenuCategory,
        disabled: !isTransferSuccess,
        onClick: () => {
          copyTranscription();
        },
      },
      {
        title: Strings.getLang('share_modal_copy_summary'),
        icon: res.imgCopySummary,
        iconName: 'imgCopySummary',
        category: 'copy' as MenuCategory,
        disabled: !isSummaryAvailable,
        onClick: () => {
          if (checkSummaryAvailable()) {
            onCopySummary();
          }
        },
      },
      {
        title: Strings.getLang('share_modal_export_transcribe'),
        icon: res.imgTranscribeExport,
        iconName: 'imgTranscribeExport',
        category: 'export' as MenuCategory,
        disabled: !isTransferSuccess,
        onClick: () => {
          if (checkTransferStatus()) {
            handleExportAction(ExportContentType.Transfer);
          }
        },
      },
      {
        title: Strings.getLang('share_modal_export_summary'),
        icon: res.imgSummaryExport,
        iconName: 'imgSummaryExport',
        category: 'export' as MenuCategory,
        disabled: !isSummaryAvailable,
        onClick: () => {
          if (checkSummaryAvailable()) {
            handleExportAction(ExportContentType.Summary);
          }
        },
      },
      {
        title: Strings.getLang('share_modal_export_mind_map'),
        icon: res.imgMindExport,
        iconName: 'imgMindExport',
        category: 'export' as MenuCategory,
        disabled: !isSummaryAvailable,
        onClick: () => {
          if (checkMindAvailable()) {
            onClose();
            onExportMindMap();
          }
        },
      },
      {
        title: Strings.getLang('share_modal_export_audio'),
        icon: res.imgAudioExport,
        iconName: 'imgAudioExport',
        category: 'export' as MenuCategory,
        onClick: onExportAudio,
      },
      {
        title: Strings.getLang('privilege_title_share'),
        icon: res.shareSvg,
        iconName: 'shareSvg',
        category: 'share' as MenuCategory,
        onClick: () => {
          // 开启云同步、文件已经在云端、文件同步成功
          if (
            cloudSyncSwitchStatus.enabled ||
            fileDetail?.isFromCloud ||
            fileDetail?.cloudSyncStatus === SingleCloudSyncStatus.UploadSuccess
          ) {
            onOpenShareConfigPopup();
            return;
          }
          onOpenCloudSyncPopup();
        },
      },
    ];

    // 合并所有菜单项
    const allItems = [...shareList, ...moreListData];

    // 按类别分组，类别顺序：edit -> process -> translate -> copy -> export -> share
    const categoryOrder: MenuCategory[] = [
      'edit',
      'process',
      'translate',
      'copy',
      'export',
      'share',
      'manage',
    ];
    const groupedItems: Array<{ category: MenuCategory; items: typeof allItems }> = [];

    categoryOrder.forEach(category => {
      const items = allItems.filter(item => item.category === category);
      if (items.length > 0) {
        groupedItems.push({ category, items });
      }
    });

    return groupedItems;
  }, [
    isTransferSuccess,
    isSummaryAvailable,
    copyTranscription,
    onCopySummary,
    handleExportAction,
    onExportAudio,
    onExportMindMap,
    moreListData,
    fileDetail?.isFromCloud,
    fileDetail?.cloudSyncStatus,
    cloudSyncSwitchStatus.enabled,
    onOpenShareConfigPopup,
    onOpenCloudSyncPopup,
    onClose,
    checkSummaryAvailable,
  ]);

  return (
    <CustomCoverView needCover={show}>
      <BottomSheetWithCustomTitle
        customClass={styles.bottomSheet}
        show={show}
        onClose={onClose}
        title={Strings.getLang('more')}
      >
        {listData.map(group => (
          <View key={group.category} className={styles.group}>
            {group.items.map(item => (
              <View
                key={item.title}
                className={clsx(styles.listItem, {
                  [styles.disabled]: item.disabled,
                })}
                onClick={item.onClick}
              >
                <View className={styles.label}>
                  <ThemedImage src={item.icon} className={styles.icon} imageName={item.iconName} />
                  <View>{item.title}</View>
                </View>
                <Icon name={rightIcon} color="var(--color-arrow)" className={styles.rightIcon} />
              </View>
            ))}
          </View>
        ))}
      </BottomSheetWithCustomTitle>
    </CustomCoverView>
  );
};

export default React.memo(MoreModal);
