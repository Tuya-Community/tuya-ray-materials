import React, { FC, useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from '@ray-js/components';
import { Icon } from '@ray-js/icons';
import clsx from 'clsx';
import CustomPopup from '@/components/CustomPopup';
import Strings from '@/i18n';
import Res from '@/res';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';
import { useSelector } from 'react-redux';
// @ts-ignore
import styles from './index.module.less';

interface Props {
  leftLanguage: string;
  rightLanguage: string;
  show: boolean;
  onClickOverlay: () => void;
  onBottomBtnClick: (leftLang: string, rightLang: string) => void;
}

enum CurrSelectMode {
  LEFT,
  RIGHT,
}

const ChooseLanguage: FC<Props> = ({
  leftLanguage,
  rightLanguage,
  show,
  onClickOverlay,
  onBottomBtnClick,
}) => {
  const [currSelectMode, setCurrSelectMode] = useState(CurrSelectMode.LEFT);
  const supportLangList = useSelector(selectUiStateByKey('supportLangList'));
  const [selectLeftLanguage, setSelectLeftLanguage] = useState(leftLanguage);
  const [selectRightLanguage, setSelectRightLanguage] = useState(rightLanguage);
  useEffect(() => {
    setSelectLeftLanguage(leftLanguage);
  }, [leftLanguage]);
  useEffect(() => {
    setSelectRightLanguage(rightLanguage);
  }, [rightLanguage]);

  const renderSelectBtn = currMode => {
    return (
      <View
        className={
          currSelectMode === currMode
            ? clsx(styles.selectBtn, styles.selectBtnOn)
            : styles.selectBtn
        }
        onClick={() => {
          setCurrSelectMode(currMode);
        }}
      >
        <Text
          className={
            currSelectMode === currMode
              ? clsx(styles.selectText, styles.selectTextOn)
              : styles.selectText
          }
        >
          {currMode === CurrSelectMode.LEFT
            ? supportLangList.find(i => i.lang === selectLeftLanguage)?.display
            : supportLangList.find(i => i.lang === selectRightLanguage)?.display}
        </Text>
        <View
          className={
            currSelectMode === currMode
              ? clsx(styles.triangleDown, styles.triangleDownOn)
              : styles.triangleDown
          }
        />
      </View>
    );
  };

  const handleClickItem = useCallback(
    lang => {
      console.log('handleClickItem', lang);
      if (currSelectMode === CurrSelectMode.LEFT) {
        if (lang === selectRightLanguage) return;
        setSelectLeftLanguage(lang);
      }
      if (currSelectMode === CurrSelectMode.RIGHT) {
        if (lang === selectLeftLanguage) return;
        setSelectRightLanguage(lang);
      }
    },
    [currSelectMode, selectLeftLanguage, selectRightLanguage]
  );

  const handleConfirm = useCallback(() => {
    onBottomBtnClick(selectLeftLanguage, selectRightLanguage);
  }, [selectLeftLanguage, selectRightLanguage]);

  return (
    <CustomPopup
      title={Strings.getLang('realtime_recording_translation_select')}
      bottomBtnText={Strings.getLang('confirm')}
      show={show}
      onClickOverlay={onClickOverlay}
      onBottomBtnClick={handleConfirm}
    >
      <View className={styles.chooseLanguageContainer}>
        <View className={styles.selectBox}>
          {renderSelectBtn(CurrSelectMode.LEFT)}
          <Image className={styles.langTransIcon} src={Res.imgTransIcon} />
          {renderSelectBtn(CurrSelectMode.RIGHT)}
        </View>
        <ScrollView className={styles.scroll} scrollY refresherTriggered={false}>
          {supportLangList.map(({ lang, display }) => (
            <View key={lang} className={styles.item} onClick={() => handleClickItem(lang)}>
              <Text
                className={styles.text}
                style={{
                  color:
                    (currSelectMode === CurrSelectMode.LEFT
                      ? selectLeftLanguage
                      : selectRightLanguage) === lang
                      ? '#000'
                      : '#aaa',
                }}
              >
                {display}
              </Text>
              {(currSelectMode === CurrSelectMode.LEFT
                ? selectLeftLanguage
                : selectRightLanguage) === lang ? (
                <Icon type="icon-checkmark-2" size={30} color="#3678E3" />
              ) : (
                <View />
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </CustomPopup>
  );
};

export default React.memo(ChooseLanguage);
