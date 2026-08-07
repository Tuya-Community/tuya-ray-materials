import React, { FC, useCallback, useContext, useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { View, ScrollView } from '@ray-js/components';
import rightIcon from '@tuya-miniapp/icons/dist/svg/Right';
import { BottomSheet, Button, Icon, Switch } from '@ray-js/smart-ui';
import clsx from 'clsx';
import { useSelector } from '@/redux';
import { useRequest } from 'ahooks';
import { getTemplateIcon } from '@/utils/image';
import Strings from '@/i18n';
import LanguageSelectPopup from '@/components/LanguageSelectPopup';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';
import { GenerateType, updateFileDetail } from '@/redux/modules/fileDetailSlice';
import { atopGetSummaryTemplateRecommendList } from '@/api/common';

import CustomCoverView from '@/components/CustomCoverView';
import { router, setStorageSync, Text } from '@ray-js/ray';
import ThemedImage from '@/components/ThemedImage';
import FileDetailContext from '../../context';

// @ts-ignore
import styles from './index.module.less';

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
  | 'interview'
  | 'soap'
  | 'requirement'
  | 'auto';

interface Props {
  show: boolean;
  onClose: () => void;
  onBottomBtnClick: () => void;
  enableSpeaker: boolean; // 是否区分说话人
  onSpeakerChange: (value: boolean) => void;
}

const ChooseTransferTemplate: FC<Props> = ({
  show,
  onClose,
  onBottomBtnClick,
  enableSpeaker,
  onSpeakerChange,
}) => {
  const { selectedTemplate, generateType, selectedTemplateInfo } = useSelector(
    state => state.fileDetail
  );
  const [template, setTemplate] = useState<string | null>(selectedTemplate);
  const supportLangList = useSelector(selectUiStateByKey('supportLangList')) || [];
  const [langShow, setLangShow] = useState(false);
  const toggleLangShow = useCallback(() => setLangShow(!langShow), [langShow]);
  const dispatch = useDispatch();
  const { summaryLang, setSummaryLang } = useContext(FileDetailContext);
  // 获取模板列表
  const { data: templateList, run } = useRequest(atopGetSummaryTemplateRecommendList, {
    manual: true,
  });
  // 弹窗弹出就调模板总结接口请求
  useEffect(() => {
    if (show) {
      run();
    }
  }, [show, run]);

  // 获取推荐分类的模板列表
  const recommendTemplates = useMemo(() => {
    if (!templateList) return [];
    const recommendCategory = templateList.find(category => category.nodeCode === 'recommend');
    const templates = recommendCategory?.templates || [];
    dispatch(
      updateFileDetail({
        selectedTemplate: template || templates[0]?.id,
      })
    );
    // 判断 selectedTemplateInfo 是否在模板列表中
    if (selectedTemplateInfo && templates.length > 0) {
      const isIncluded = templates.some(template => template.id === selectedTemplateInfo.id);

      // 如果不包含，则将其放置在第二个位置
      if (!isIncluded) {
        const newTemplates = [...templates];
        newTemplates.splice(1, 0, selectedTemplateInfo);

        return newTemplates;
      }
    }

    return templates;
  }, [templateList, template]);

  //

  useEffect(() => {
    setTemplate(selectedTemplate);
  }, [selectedTemplate]);

  // 选择模板
  const handleTemplateClick = (templateId: string) => {
    setTemplate(templateId);
    dispatch(
      updateFileDetail({
        selectedTemplate: templateId,
      })
    );
  };

  // 选择语言
  const handleLangSave = (lang: string) => {
    setSummaryLang(lang);
    setStorageSync({ key: 'lastSummaryLang', data: lang || '' });
  };

  // 获取语言显示
  const getLangDisplay = lang => {
    if (!lang) return Strings.getLang('auto_lang');
    return supportLangList?.find(item => item.lang === lang)?.display || '';
  };

  return (
    <CustomCoverView needCover={show || langShow}>
      {langShow && (
        <LanguageSelectPopup
          emptyOptionText={Strings.getLang('auto_lang')}
          show={langShow}
          onClose={toggleLangShow}
          title={Strings.getLang('template_summary_lang')}
          onSave={handleLangSave}
          selectedLang={summaryLang}
        />
      )}
      <BottomSheet
        show={show}
        title={Strings.getLang('template_title')}
        onClose={() => {
          setTemplate(null);
          dispatch(
            updateFileDetail({
              selectedTemplate: null,
              selectedTemplateInfo: null,
            })
          );
          onClose();
        }}
        iconColor="var(--color-text-tertiary)"
        className={styles.bottomSheet}
      >
        <View className={styles.content}>
          <View>
            <View className={styles.header}>
              <View className={styles.title}>{Strings.getLang('template')}</View>
              <View
                className={styles.more}
                onClick={() => {
                  router.push('/detail/moreTemplate', { subpackage: 'pkgTemplate' });
                }}
              >
                <View>{Strings.getLang('more')}</View>
                <Icon name={rightIcon} size={16} color="var(--color-text-tertiary)" />
              </View>
            </View>
            <ScrollView
              scrollX
              style={{ height: 'auto' }}
              // @ts-ignore
              hideScrollbar
            >
              <View className={styles.list}>
                {recommendTemplates.slice(0, 6).map(templateItem => (
                  <View
                    className={clsx(styles.listItem, template === templateItem.id && styles.active)}
                    onClick={() => handleTemplateClick(templateItem.id)}
                    key={templateItem.id}
                  >
                    {templateItem.customize === true && (
                      <Text className={styles.customizeBadge}>
                        {Strings.getLang('custom_template_customize_badge')}
                      </Text>
                    )}
                    <ThemedImage
                      src={getTemplateIcon(templateItem.icon)}
                      className={`${styles.img} ${
                        templateItem.needColorAdapt ? 'img-theme-bw' : ''
                      }`}
                    />
                    <View className={styles.name}>{templateItem.templateName}</View>
                    <View className={styles.desc}>{templateItem.templateDesc}</View>
                  </View>
                ))}
              </View>
            </ScrollView>
            <View
              className={styles.langCard}
              onClick={() => {
                toggleLangShow();
              }}
            >
              <View className={styles.header}>
                <View className={styles.title}>{Strings.getLang('template_summary_lang')}</View>
                <View className={styles.lang}>
                  <View>{getLangDisplay(summaryLang)}</View>
                  <Icon name={rightIcon} size={16} color="var(--color-arrow)" />
                </View>
              </View>
              <View className={styles.desc}>{Strings.getLang('template_summary_lang_tip')}</View>
            </View>
            {generateType === GenerateType.Transcribe && (
              <View className={styles.distinguish}>
                <View className={styles.title}>
                  {Strings.getLang('template_distinguish_speaker')}
                </View>
                <Switch
                  checked={enableSpeaker}
                  onChange={event => {
                    onSpeakerChange(event.detail);
                  }}
                />
              </View>
            )}
          </View>
          {/* smart-ui打标无效，所以套了一层 */}
          <View
            onClick={() => {
              onBottomBtnClick();
            }}
          >
            <Button id="popGenerateBtn" customClass={styles.button} disabled={!template}>
              {Strings.getLang('generate')}
            </Button>
          </View>
        </View>
      </BottomSheet>
    </CustomCoverView>
  );
};

export default React.memo(ChooseTransferTemplate);
