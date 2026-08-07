import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Button } from '@ray-js/ray';
import { BottomSheet } from '@ray-js/smart-ui';
import { useSelector } from '@/redux';
import dayjs from 'dayjs';
import { atopGetShareLinkDetail } from '@/api/share';
import { ShareStatus, SingleCloudSyncStatus } from '@/constant/enums';
import { tttOperateRecordShareLink } from '@/api/ttt';
import { TranscriptSegment } from '@/types/file';
import Strings from '@/i18n';
import CustomCoverView from '@/components/CustomCoverView';
import { ContentType } from '../../types';
import { CONTENT_TYPE } from '../../constants';
import RandomPwd from '../RandomPwd';
import ExpireTimeSetting from '../ExpireTimeSetting';
import CheckBoxOptionGroup from '../CheckBoxOptionGroup';
import ConfigSection from '../ConfigSection';

import styles from './index.module.less';

const defaultExpireTime = dayjs().add(7, 'day').endOf('day').valueOf();

const TRANS_TYPE_ORDER = [
  CONTENT_TYPE.TRANSCRIPT_PARAGRAPH_TIME,
  CONTENT_TYPE.TRANSCRIPT_SPEAKER,
  CONTENT_TYPE.ORIGINAL_AND_TRANSLATION,
  CONTENT_TYPE.ORIGINAL,
  CONTENT_TYPE.TRANSLATION,
];

const TRANS_TYPE_LANG_KEY = {
  [CONTENT_TYPE.TRANSCRIPT_PARAGRAPH_TIME]: 'copyTranscriptionConfigPopup_paragraphTime',
  [CONTENT_TYPE.TRANSCRIPT_SPEAKER]: 'copyTranscriptionConfigPopup_speakerLabel',
  [CONTENT_TYPE.ORIGINAL]: 'copyTranscriptionConfigPopup_original',
  [CONTENT_TYPE.TRANSLATION]: 'copyTranscriptionConfigPopup_translation',
  [CONTENT_TYPE.ORIGINAL_AND_TRANSLATION]: 'copyTranscriptionConfigPopup_originalAndTranslation',
};

interface Props {
  show: boolean;
  onClose: () => void;
  recordId: string;
  isSpeakerLabelAvailable: boolean;
  isTranslateAvailable: boolean;
  summary?: string;
  transferList: TranscriptSegment[];
  cloudSyncStatus?: SingleCloudSyncStatus;
  isFromCloud?: boolean;
}

const ShareLinkModal = ({
  show,
  onClose,
  recordId,
  isSpeakerLabelAvailable,
  isTranslateAvailable,
  summary,
  transferList,
  cloudSyncStatus,
  isFromCloud,
}: Props) => {
  const [shareType, setShareType] = useState<string[]>([]);
  const [expireTime, setExpireTime] = useState<number>(defaultExpireTime);
  const [password, setPassword] = useState<string>('');
  const [shareStatus, setShareStatus] = useState<ShareStatus>(ShareStatus.UnShare);
  const [closeLoading, setCloseLoading] = useState<boolean>(false);
  const [shareLoading, setShareLoading] = useState<boolean>(false);
  const [, setShareContent] = useState<string>('');
  const isInitializingRef = useRef<boolean>(false); // 标记是否正在初始化
  const {
    statusBarHeight,
    safeArea: { height },
  } = useSelector(state => state.systemInfo);
  const { cloudSyncSwitchStatus } = useSelector(state => state.uiState);

  const audioNotUploaded = cloudSyncStatus !== SingleCloudSyncStatus.UploadSuccess && !isFromCloud;

  const audioDisabledTip = useMemo(() => {
    if (!audioNotUploaded) return '';
    if (cloudSyncSwitchStatus?.enabled && cloudSyncSwitchStatus?.syncType === 1) {
      return Strings.getLang('share_audio_wifi_uploading_tip');
    }
    if (cloudSyncSwitchStatus?.enabled) {
      return Strings.getLang('share_audio_uploading_tip');
    }
    return Strings.getLang('action_not_transfer_tip');
  }, [audioNotUploaded, cloudSyncSwitchStatus]);

  const getTransMsg = (shareType: string[]) =>
    TRANS_TYPE_ORDER.filter(type => shareType.includes(type))
      .map(type => Strings.getLang(TRANS_TYPE_LANG_KEY[type] as any))
      .join(' | ');

  const shareTypeList = useMemo(() => {
    const transContent = getTransMsg(shareType);
    return [
      {
        name: CONTENT_TYPE.AUDIO,
        label: Strings.getLang('share_link_modal_audio'),
        disabled: !transferList || transferList?.length === 0 || audioNotUploaded,
        disabledTip: audioNotUploaded
          ? audioDisabledTip
          : Strings.getLang('action_not_transfer_tip'),
      },
      {
        name: 'trans',
        label: Strings.getLang('share_link_modal_trans'),
        component: transContent && (
          <View className={styles.shareTransTypeItem}>{transContent}</View>
        ),
        disabled: !transferList || transferList?.length === 0,
        disabledTip: Strings.getLang('action_not_transfer_tip'),
      },
      {
        name: CONTENT_TYPE.SUMMARY,
        label: Strings.getLang('share_link_modal_summary'),
        disabled: !summary || summary?.length === 0,
        disabledTip: Strings.getLang('action_not_summarize_tip'),
      },
      {
        name: CONTENT_TYPE.MINDMAP,
        label: Strings.getLang('share_link_modal_mindmap'),
        disabled: !summary || summary?.length === 0,
        disabledTip: Strings.getLang('action_not_summarize_tip'),
      },
    ];
  }, [shareType]);

  // 分享类型变化
  const handleShareTypeChange = e => {
    const val = e?.detail;
    setShareType(val);
  };

  // 保存/关闭分享
  const handleShare = async (close?: boolean, showSharePopup?: boolean) => {
    try {
      // if (showSharePopup && !close) { // 如果只是更新动作。不需要弹窗，关闭的场景就不设置loading
      //   setShareLoading(true);
      // }
      if (!close) {
        setShareLoading(true);
      }

      if (close) {
        setCloseLoading(true);
      }

      const shareTypeReset = shareType.filter(item => item !== 'trans');
      const baseParam = {
        recordId,
        shareType: shareTypeReset,
        expireTime,
        // fileId,
        shareStatus: close ? ShareStatus.Closed : ShareStatus.ShareIng,
      };
      const param = password ? { ...baseParam, password } : baseParam;
      const res = await tttOperateRecordShareLink(param);
      getShareLinkDetail();
      if (close) {
        setCloseLoading(false);
        return;
      }
      if (shareStatus === ShareStatus.ShareIng && !showSharePopup && !close) {
        ty.showToast({
          title: Strings.getLang('share_link_modal_share_update_success'),
          icon: 'success',
        });
        return; // 已经分享了，只做更新成功的提示
      }
      const conent = res?.link || '';
      setShareContent(conent || '');

      // @ts-ignore
      ty.share({
        type: 'More',
        // title: conent,
        message: conent,
        contentType: 'text',
        success: () => {},
        fail: e => {
          console.error('分享失败', e);
        },
      });
    } catch (error) {
      console.error('分享操作失败', error);
    } finally {
      setShareLoading(false);
      setCloseLoading(false);
    }
  };

  const onDisableShareClick = () => {
    if (shareType?.length === 0) {
      ty.showToast({
        title: Strings.getLang('share_link_save_warn_tip'),
        icon: 'none',
      });
    }
  };

  // 获取分享链接详情
  const getShareLinkDetail = useCallback(async () => {
    isInitializingRef.current = true; // 标记开始初始化
    const res = await atopGetShareLinkDetail(recordId);
    if (!res.expireTime) {
      // 没有分享的过期时间，说明没有数据
      isInitializingRef.current = false;
      return;
    }
    const nextShareType = Array.isArray(res?.shareType) ? [...res?.shareType] : [];
    // 如果有任何trans相关内容，补充加上'trans'
    if (nextShareType.some(type => TRANS_TYPE_ORDER.includes(type as ContentType))) {
      if (!nextShareType.includes('trans')) {
        nextShareType.push('trans');
      }
    }
    setPassword(res?.password);
    setShareType(nextShareType);
    setShareStatus(res?.shareStatus as ShareStatus);
    setExpireTime(Number(res?.expireTime));

    // 延迟重置初始化标记，确保所有状态更新完成后再允许触发 handleShare
    setTimeout(() => {
      isInitializingRef.current = false;
    }, 100);
  }, [recordId]);

  useEffect(() => {
    if (show && recordId) {
      getShareLinkDetail();
    }
  }, [show, recordId, getShareLinkDetail]);

  // 分享按钮组件
  const ShareButtonComponent = useMemo(() => {
    const ShareButton = (
      <View className={styles.shareButtonBox} onClick={onDisableShareClick}>
        <Button
          disabled={shareType?.length === 0}
          loading={shareLoading}
          type="primary"
          onClick={() => handleShare(false, true)}
          className={styles.shareButton}
        >
          {Strings.getLang('share_link_modal_share_button')}
        </Button>
      </View>
    );
    const ShareCloseButton = (
      <View className={styles.shareButtonBox}>
        <Button
          type="default"
          onClick={() => handleShare(true)}
          loading={closeLoading}
          className={`${styles.shareButton} ${styles.closeButton}`}
        >
          {Strings.getLang('share_link_modal_share_close_button')}
        </Button>
      </View>
    );
    switch (shareStatus) {
      case ShareStatus.UnShare:
        return ShareButton;
      case ShareStatus.ShareIng:
        return (
          <View className={styles.shareButtonWrapper}>
            {ShareCloseButton}
            {ShareButton}
          </View>
        );
      case ShareStatus.Closed:
        return ShareButton;
      default:
        return ShareButton;
    }
  }, [shareStatus, shareLoading, closeLoading, shareType, password, expireTime]);

  // 监听分享配置变化，自动更新分享（仅在用户操作时触发，初始化时不触发）
  useEffect(() => {
    // 如果正在初始化，不触发 handleShare
    if (isInitializingRef.current) {
      return;
    }

    // 只有在已经分享的状态下，且有分享内容时，才自动更新
    if (shareStatus === ShareStatus.ShareIng && shareType?.length > 0) {
      handleShare();
    }
  }, [shareStatus, shareType, password, expireTime]);

  return (
    <CustomCoverView>
      <BottomSheet
        contentHeight={`${height - statusBarHeight - 40}px`}
        customClass={styles.bottomSheet}
        show={show}
        title={Strings.getLang('share_config_popup_title')}
        onClose={onClose}
      >
        <ConfigSection title={Strings.getLang('share_link_modal_share_content')}>
          <CheckBoxOptionGroup
            options={shareTypeList}
            shareType={shareType}
            onChange={handleShareTypeChange}
            setShareType={setShareType}
            isSpeakerLabelAvailable={isSpeakerLabelAvailable}
            isTranslateAvailable={isTranslateAvailable}
          />
        </ConfigSection>
        <ConfigSection
          title={Strings.getLang('share_link_modal_expire_time')}
          customClass={styles.mgtb20}
        >
          <ExpireTimeSetting expireTime={expireTime} setExpireTime={setExpireTime} />
        </ConfigSection>
        <ConfigSection title={Strings.getLang('share_link_modal_password')}>
          <RandomPwd password={password} setPassword={setPassword} />
        </ConfigSection>
        {ShareButtonComponent}
      </BottomSheet>
    </CustomCoverView>
  );
};

export default React.memo(ShareLinkModal);
