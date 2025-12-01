import React, { FC } from 'react';
import { View, Text, ScrollView } from '@ray-js/components';
import CustomPopup from '@/components/CustomPopup';
import Strings from '@/i18n';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';
import { useSelector } from 'react-redux';
// @ts-ignore
import styles from './index.module.less';

interface Props {
  currLang: string;
  show: boolean;
  onClickOverlay: () => void;
  onClickLang: (lang: string) => void;
  type: 'origin_' | '';
}

const ChooseLanguage: FC<Props> = ({ currLang, show, onClickOverlay, onClickLang, type }) => {
  const supportLangList = useSelector(selectUiStateByKey('supportLangList'));
  const handleClickItem = lang => {
    onClickLang(lang);
  };
  return (
    <CustomPopup
      title={Strings.getLang(`realtime_recording_translation_${type}select`)}
      bottomBtnText={Strings.getLang('confirm')}
      show={show}
      onClickOverlay={onClickOverlay}
      onBottomBtnClick={() => { }}
      hideBottomBtn
    >
      <View className={styles.chooseLanguageContainer}>
        <ScrollView className={styles.scroll} scrollY refresherTriggered={false}>
          {supportLangList.map(({ lang, display }) => (
            <View key={lang} className={styles.item} onClick={() => handleClickItem(lang)}>
              <Text
                className={styles.text}
                style={{
                  color: currLang === lang ? '#000' : '#aaa',
                }}
              >
                {display}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </CustomPopup>
  );
};

export default React.memo(ChooseLanguage);
