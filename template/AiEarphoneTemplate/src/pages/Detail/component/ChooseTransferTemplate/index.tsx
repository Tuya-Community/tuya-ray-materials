import React, { FC, useState } from 'react';
import { View, Text } from '@ray-js/components';
import CustomPopup from '@/components/CustomPopup';
import Strings from '@/i18n';
import clsx from 'clsx';
// @ts-ignore
import styles from './index.module.less';

const transTemps = [
  'default', // 默认
  'phone', // 电话
  'speaking', // 演讲
  'interview', // 面试
  'dictation', // 口述
  'consultation', // 咨询
  'discussion', // 讨论
  'report', // 汇报
  'classNotes', // 课堂笔记
  'training', // 培训
  'newsInterview', // 采访
  'soap', // 问诊（SOAP）
  'requirement', // 需求
];

export type TRANSFER_TEMPLATE =
  | 'default'
  | 'phone'
  | 'speaking'
  | 'interview'
  | 'dictation'
  | 'consultation'
  | 'discussion'
  | 'report'
  | 'classNotes'
  | 'training'
  | 'cinterview'
  | 'soap'
  | 'requirement';

interface Props {
  template: TRANSFER_TEMPLATE;
  show: boolean;
  onClickOverlay: () => void;
  onBottomBtnClick: (template: TRANSFER_TEMPLATE) => void;
}

const ChooseTransferTemplate: FC<Props> = ({
  template,
  show,
  onClickOverlay,
  onBottomBtnClick,
}) => {
  const [selectTemplate, setSelectTemplate] = useState(template);
  const handleSelect = code => {
    setSelectTemplate(code);
  };

  return (
    <CustomPopup
      show={show}
      title={Strings.getLang('transfer_template_select_title')}
      bottomBtnText={Strings.getLang('confirm')}
      onBottomBtnClick={() => {
        onBottomBtnClick(selectTemplate);
      }}
      onClickOverlay={onClickOverlay}
      style={{
        minHeight: '55%',
        overflow: 'hidden',
      }}
    >
      <View className={styles.chooseTransferTemplateContainer}>
        {transTemps.map((code: TRANSFER_TEMPLATE) => (
          <View
            key={code}
            className={code === selectTemplate ? clsx(styles.selectItem, styles.item) : styles.item}
            onClick={() => {
              handleSelect(code);
            }}
          >
            <Text
              className={
                code === selectTemplate ? clsx(styles.selectText, styles.text) : styles.text
              }
            >
              {Strings.getLang(`transfer_template_${code}`)}
            </Text>
          </View>
        ))}
      </View>
    </CustomPopup>
  );
};

export default React.memo(ChooseTransferTemplate);
