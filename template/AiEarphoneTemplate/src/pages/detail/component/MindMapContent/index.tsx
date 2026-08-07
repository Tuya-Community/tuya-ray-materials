import React, { FC, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { updateUiState } from '@/redux/modules/uiStateSlice';
import Strings from '@/i18n';
import Res from '@/res';
import { GenerateType, updateFileDetail } from '@/redux/modules/fileDetailSlice';
import { TransferStatus, SummaryStatus } from '@/constant/enums';
import EmptyContent from '../EmptyContent';
import MindMapView from '../../mindMapPage';
import FileDetailContext from '../../context';

interface Props {
  summary: string;
}

const MindMapContent: FC<Props> = ({ summary }) => {
  const dispatch = useDispatch();
  const { fileDetail } = useContext(FileDetailContext);
  const transferStatus = fileDetail?.transfer;
  const summaryStatus = fileDetail?.summary;
  useEffect(() => {
    summary && dispatch(updateUiState({ tempMarkdownText: summary }));
  }, [summary]);

  // const handleJumpToMindMap = () => {
  //   router.push(`/detail/mindMapPage`);
  // };

  // 总结
  const handleTranscribe = () => {
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

  let ContentDom = <></>;

  // 未总结或者老数据文件且没有数据的情况下显示未总结状态
  if (
    summaryStatus === SummaryStatus.Initial ||
    (summaryStatus === SummaryStatus.Old && !summary?.length)
  ) {
    ContentDom = (
      <EmptyContent
        image={Res.fileTranscribe}
        desc={Strings.getLang('file_tip_not_xmind')}
        buttonTitle={Strings.getLang('generate')}
        onClick={handleTranscribe}
      />
    );
  }

  if (summaryStatus === SummaryStatus.Success) {
    ContentDom = (
      <>
        {summary?.length > 0 ? (
          <MindMapView />
        ) : (
          <EmptyContent image={Res.fileFailed} title={Strings.getLang('file_tip_empty')} />
        )}
      </>
    );
  }

  // 正在转写或者正在总结，显示正在总结状态
  if (summaryStatus === SummaryStatus.Process || transferStatus === TransferStatus.Process) {
    ContentDom = (
      <EmptyContent image={Res.fileTranscribe} title={Strings.getLang('file_tip_xminding')} />
    );
  }
  // 总结失败显示失败状态
  if (summaryStatus === SummaryStatus.Fail)
    ContentDom = (
      <EmptyContent
        image={Res.fileFailed}
        title={Strings.getLang('file_tip_xmind_failed')}
        buttonTitle={Strings.getLang('file_re_xmind')}
        onClick={handleTranscribe}
      />
    );
  // 未总结或者老数据文件且没有数据的情况下显示未总结状态
  return <>{ContentDom}</>;
};

export default React.memo(MindMapContent);
