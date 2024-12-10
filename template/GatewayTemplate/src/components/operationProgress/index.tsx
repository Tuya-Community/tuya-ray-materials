import React, { FC } from 'react';
import Progress from '@ray-js/gateway-add-device-progress';
import Strings from '@/i18n';
import { IOperationConfig } from '@/types';
import styles from './index.module.less';

interface IProps {
  show: boolean;
  isEnd: boolean;
  selectedIds: string[];
  currentProgress: number;
  currentOperation: IOperationConfig;
  handleProgressClose: () => void;
}

const OperationProgress: FC<IProps> = ({
  show,
  isEnd,
  selectedIds,
  currentProgress,
  currentOperation,
  handleProgressClose,
}) => {
  const failNum = selectedIds.length - currentProgress;
  const title = isEnd
    ? currentOperation.getProgressResultTitle(currentProgress.toString())
    : currentOperation.progressTitle;
  const prompt = isEnd
    ? failNum > 0
      ? currentOperation.getProgressResultPrompt(failNum.toString())
      : ''
    : currentOperation.progressPrompt;
  const promptClassName = isEnd && failNum > 0 ? styles['center-text'] : '';

  return (
    <Progress
      title={title}
      prompt={prompt}
      className={styles['progress-view']}
      promptClassName={promptClassName}
      show={show}
      percent={selectedIds.length ? (currentProgress / selectedIds.length) * 100 : 0}
      isShowButton={isEnd}
      buttonText={Strings.getLang('finish')}
      onClick={handleProgressClose}
    >
      {`${currentProgress} / ${selectedIds.length}`}
    </Progress>
  );
};

export default OperationProgress;
