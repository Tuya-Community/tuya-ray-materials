/*
 * @Author: hkc
 * @Date: 2025-09-05 14:57:35
 * @LastEditors: hkc
 * @LastEditTime: 2026-02-09 17:19:51
 * @Description: 翻译弹窗
 */
import React, { useContext } from 'react';
import LanguageSelectPopup from '@/components/LanguageSelectPopup';
import CustomCoverView from '@/components/CustomCoverView';
import Strings from '@/i18n';
import FileDetailContext from '../../context';

const Index: React.FC = () => {
  const { translatePopupShow, setTranslateLang, setTranslatePopupShow, fileDetail } =
    useContext(FileDetailContext);
  const handleLangSave = async (lang: string) => {
    setTranslateLang(lang);
    setTranslatePopupShow(false);
  };

  return (
    <CustomCoverView>
      <LanguageSelectPopup
        show={translatePopupShow}
        onClose={() => {
          setTranslatePopupShow(false);
        }}
        title={Strings.getLang('langSelect_translate_lang')}
        onSave={handleLangSave}
        selectedLang={fileDetail?.targetLanguage}
      />
    </CustomCoverView>
  );
};

export default Index;
