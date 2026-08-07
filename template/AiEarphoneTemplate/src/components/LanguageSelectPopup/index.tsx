import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from '@ray-js/ray';
import { BottomSheet, Search } from '@ray-js/smart-ui';
import clsx from 'clsx';
import debounce from 'lodash/debounce';

import Strings from '@/i18n';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';
import { getStorageRecentlyLangs, setStorageRecentlyLangs } from '@/utils';
import { useSelector } from '@/redux';
import { SYSTEM_LANGS } from '@/constant';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import styles from './index.module.less';

interface IProps {
  show: boolean;
  onClose: () => void;
  /** 保存回调，lang 为选中的语言，空字符串表示选中了置顶的空值选项（自动检测 / 不翻译） */
  onSave?: (lang: string) => void;
  /** 弹窗标题，可自定义（如「输入语言」「翻译语言」「总结语言」），默认「选择语言」 */
  title?: string;
  /** 当前选中的语言 */
  selectedLang?: string;
  /**
   * 置顶空值选项的文案（值为空字符串）。传入则在列表顶部展示该选项，
   * 用于「自动检测语言」「不翻译」等场景；不传则不展示。两者互斥，故合并为同一配置。
   */
  emptyOptionText?: string;
  /**
   * 需要置灰的语言（如对侧已选中的语言）。传入则对应语言项显示为置灰不可选状态；
   * 不传或传空字符串则不置灰任何语言。
   */
  disabledLang?: string;
}

const Index: React.FC<IProps> = props => {
  const {
    show,
    onClose,
    onSave,
    title = Strings.getLang('langSelect_select_lang'),
    selectedLang = '',
    emptyOptionText = '',
    disabledLang = '',
  } = props;

  const supportLangList = useSelector(selectUiStateByKey('supportLangList')) || [];
  const {
    language,
    safeArea: { height },
    statusBarHeight,
  } = useSelector(state => state.systemInfo);
  const systemLang = SYSTEM_LANGS?.[language];
  const storeRecentlyUsedLangs = getStorageRecentlyLangs();
  const [currentLang, setCurrentLang] = useState(selectedLang); // 当前选中语言
  const [filteredLangList, setFilteredLangList] = useState([]); // 搜索结果

  // 计算滚动区域高度
  const scrollHeight = useMemo(() => {
    const headerHeight = 90;
    const searchHight = 70; // 搜索框高度
    const calculatedHeight = (height || 0) - headerHeight - searchHight;
    return `${calculatedHeight}px`;
  }, [height]);

  const recentlyUsedLangs = useMemo(() => {
    const defaultLang = systemLang || 'en';
    const sysL = supportLangList?.find(item => item?.lang === defaultLang);
    const storeRecentlyUsedLangsRest =
      storeRecentlyUsedLangs?.map(item => {
        const found = supportLangList?.find(lang => lang?.lang === item?.lang);
        return {
          ...item,
          display: found?.display ?? item.display,
        };
      }) ?? [];
    if (storeRecentlyUsedLangs?.find(item => item?.lang === sysL?.lang)) {
      return storeRecentlyUsedLangsRest;
    }
    const list = [...(storeRecentlyUsedLangsRest ?? []), sysL];
    return list;
  }, [storeRecentlyUsedLangs, supportLangList, systemLang]);

  // 语言选择：点击直接选中（含置顶空值选项），置灰语言不可选
  const handleLangSelect = useCallback(
    (lang: string) => {
      if (disabledLang && lang === disabledLang) return;
      setCurrentLang(lang);
    },
    [disabledLang]
  );

  // 是否显示选择图标
  const showCheck = useCallback((lang: string) => currentLang === lang, [currentLang]);

  // 是否为置灰语言
  const isDisabled = useCallback(
    (lang: string) => !!disabledLang && lang === disabledLang,
    [disabledLang]
  );

  // 保存
  const handleSave = () => {
    if (currentLang) {
      const cLang = supportLangList?.find(item => item.lang === currentLang);
      setStorageRecentlyLangs(cLang);
    }
    onSave?.(currentLang);
    onClose();
  };

  // 搜索（原始函数）
  const handleSearch = useCallback(
    event => {
      const val = event?.detail?.trim?.() ?? event?.detail ?? '';
      if (!val) {
        setFilteredLangList([]);
        return;
      }
      const lowerVal = val.toLowerCase();
      const filtered = supportLangList.filter(lang => {
        return lang.display && lang.display.toLowerCase().includes(lowerVal);
      });
      setFilteredLangList(filtered);
    },
    [supportLangList]
  );

  // 防抖处理
  const debouncedSearch = useMemo(() => debounce(handleSearch, 300), [handleSearch]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    setCurrentLang(selectedLang);
  }, [selectedLang, show]);

  return (
    <BottomSheet
      className={styles.bottomSheet}
      show={show}
      onClose={onClose}
      maxHeight={`calc(100vh - ${Number(statusBarHeight ?? 0)}px)`}
    >
      <View className={styles.header}>
        <View
          className={styles.cancel}
          onClick={() => {
            onClose();
          }}
        >
          {Strings.getLang('cancel')}
        </View>
        <View className={styles.title}>{title}</View>
        <View className={styles.confirm} onClick={handleSave}>
          {Strings.getLang('save')}
        </View>
      </View>
      <Search
        customClass={styles.searchBox}
        searchText=""
        placeholder={Strings.getLang('lang_search_placeholder')}
        onCancel={() => setFilteredLangList([])}
        onFocus={() => {
        }}
        onChange={debouncedSearch}
      />
      <ScrollView
        id="scroll-popLang"
        className={styles.langList}
        scrollY
        style={{ height: scrollHeight }}
        hideScrollbar
      >
        {/* 置顶空值选项：自动检测语言 / 不翻译 */}
        {filteredLangList.length < 1 && !!emptyOptionText && (
          <View className={styles.autoLang} onClick={() => handleLangSelect('')}>
            <View id="popLang" className={styles.langTitle}>
              {emptyOptionText}
            </View>

            <ThemedImage
              imageName="devCheckIcon"
              src={Res.devCheckIcon}
              className={clsx(styles.checkIcon, {
                [styles.show]: showCheck(''),
              })}
            />
          </View>
        )}

        {/* 最近使用的语言 */}
        {filteredLangList.length < 1 && (
          <>
            <View className={styles.catograyTitle}>{Strings.getLang('recently_used_lang')}</View>
            <View className={styles.langBox}>
              {recentlyUsedLangs?.map(item => (
                <View
                  key={item?.lang}
                  className={clsx(styles.listItem, {
                    [styles.listItemDisabled]: isDisabled(item?.lang),
                  })}
                  onClick={() => handleLangSelect(item?.lang)}
                >
                  <View>
                    <View id="popLang" className={styles.langTitle}>
                      {item?.display}
                    </View>
                    <View className={styles.langText}>{item?.sourceName}</View>
                  </View>

                  <ThemedImage
                    imageName="devCheckIcon"
                    src={Res.devCheckIcon}
                    className={clsx(styles.checkIcon, {
                      [styles.show]: showCheck(item?.lang),
                    })}
                  />
                </View>
              ))}
            </View>
          </>
        )}
        {filteredLangList.length < 1 && (
          <View className={styles.catograyTitle}>{Strings.getLang('all_langs')}</View>
        )}
        {/* 所有语言/搜索的语言 */}
        <View className={styles.langBox}>
          {(filteredLangList.length < 1 ? supportLangList : filteredLangList).map(item => (
            <View
              key={item?.lang}
              className={clsx(styles.listItem, {
                [styles.listItemDisabled]: isDisabled(item?.lang),
              })}
              onClick={() => handleLangSelect(item?.lang)}
            >
              <View>
                <View id="popLang" className={styles.langTitle}>
                  {item?.display}
                </View>
                <View className={styles.langText}>{item?.sourceName}</View>
              </View>

              <ThemedImage
                imageName="devCheckIcon"
                src={Res.devCheckIcon}
                className={clsx(styles.checkIcon, {
                  [styles.show]: showCheck(item?.lang),
                })}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

export default Index;
