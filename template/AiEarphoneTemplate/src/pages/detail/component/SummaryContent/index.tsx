/*
 * @Author: hkc
 * @Date: 2025-07-09 16:55:50
 * @LastEditors: hkc
 * @LastEditTime: 2026-05-29 14:41:24
 * @Description:
 */
import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { ScrollView, View } from '@ray-js/components';
import { showToast } from '@ray-js/ray';
import Markdown from '@/components/MarkdownParser/parser';

import Res from '@/res';
import { useDispatch } from 'react-redux';
import Strings from '@/i18n';
import { GenerateType, updateFileDetail } from '@/redux/modules/fileDetailSlice';
import { TransferStatus, SummaryStatus, SummaryImageStatus } from '@/constant/enums';
import { getDomRectTop } from '@/utils/dom';
import { useSelector } from '@/redux';
import FileDetailContext from '../../context';
import EmptyContent from '../EmptyContent';
import FileInfo from '../FileInfo';
import SummaryImageSection from '../SummaryImageSection';

import styles from './index.module.less';

interface IProps {
  summary: string;
  updateSummary: (params: { title: string; summary?: string }) => Promise<void>;
  footer?: React.ReactNode;
  summaryImageUrl?: string;
}

const SummaryContent: FC<IProps> = props => {
  const { summary, updateSummary, footer, summaryImageUrl } = props;
  const { fileDetail } = useContext(FileDetailContext);
  const summaryStatus = fileDetail?.summary;
  const transferStatus = fileDetail?.transfer;
  const summaryImageStatus = fileDetail?.summaryImageStatus;
  const { useWindowHeight } = useSelector(state => state.systemInfo);
  const [scrollHeight, setScrollHeight] = useState(useWindowHeight);
  const dispatch = useDispatch();
  // 总结
  const handleSummary = () => {
    if (summaryImageStatus === SummaryImageStatus.Generating) {
      showToast({
        title: Strings.getLang('action_summarizing_tip'),
        icon: 'none',
      });
      return;
    }
    // 部分转写（transcriptionStatus === 2）时即使已转写成功，也需要先补充转写再总结
    const isPartialTranscription = fileDetail?.transcriptionStatus === 2;
    dispatch(
      updateFileDetail({
        generateType:
          fileDetail?.transfer === TransferStatus.Success && !isPartialTranscription
            ? GenerateType.Summarize
            : GenerateType.Transcribe,
        selectTemplateShow: true,
      })
    );
  };

  // 获取滚动高度
  const getScrollHeight = async () => {
    const rectTop = await getDomRectTop('summary-content');
    setScrollHeight(useWindowHeight - rectTop);
  };

  useEffect(() => {
    getScrollHeight();
  }, []);

  // 渲染内容
  const renderContent = useCallback(() => {
    // 未总结或者老数据文件且没有数据的情况下显示未总结状态
    if (
      summaryStatus === SummaryStatus.Initial ||
      (summaryStatus === SummaryStatus.Old && !summary?.length)
    ) {
      return (
        <EmptyContent
          image={Res.fileTranscribe}
          desc={Strings.getLang('file_tip_not_summarize')}
          buttonTitle={Strings.getLang('generate')}
          onClick={handleSummary}
        />
      );
    }
    // 正在转写或者正在总结，显示正在总结状态
    if (summaryStatus === SummaryStatus.Process || transferStatus === TransferStatus.Process) {
      return (
        <EmptyContent image={Res.fileTranscribe} title={Strings.getLang('file_tip_summarizing')} />
      );
    }
    // 总结失败显示失败状态
    if (summaryStatus === SummaryStatus.Fail) {
      return (
        <EmptyContent
          image={Res.fileFailed}
          title={Strings.getLang('file_tip_summarize_failed')}
          buttonTitle={Strings.getLang('file_re_summarize')}
          onClick={handleSummary}
        />
      );
    }
    // 总结成功下显示总结内容
    if (summaryStatus === SummaryStatus.Success) {
      return (
        <>
          {summary?.length > 0 ? (
            <View className={styles.content}>
              <SummaryImageSection
                imageUrl={summaryImageUrl || ''}
                summaryImageStatus={summaryImageStatus}
                onRetry={handleSummary}
              />
              <Markdown>{summary}</Markdown>
            </View>
          ) : (
            <EmptyContent image={Res.fileFailed} title={Strings.getLang('file_tip_empty')} />
          )}
        </>
      );
    }
    return null;
  }, [summaryStatus, transferStatus, summary, summaryImageUrl, summaryImageStatus]);

  return (
    <ScrollView id="summary-content" style={{ height: `${scrollHeight}px` }} scrollY>
      <FileInfo updateSummary={updateSummary} />
      {renderContent()}
      {footer}
    </ScrollView>
  );
};

export default React.memo(SummaryContent);
