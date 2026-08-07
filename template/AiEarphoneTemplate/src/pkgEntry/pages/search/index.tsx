import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Input, ScrollView } from '@ray-js/components';
import { router, usePageEvent } from '@ray-js/ray';
import { Icon } from '@ray-js/smart-ui';
import { useDebounceFn, useRequest } from 'ahooks';
import searchIcon from '@tuya-miniapp/icons/dist/svg/Search';
import XmarkIcon from '@tuya-miniapp/icons/dist/svg/Xmark';
import DeleteLineIcon from '@tuya-miniapp/icons/dist/svg/DeleteLine';
import TopBar from '@/components/TopBar';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import type { FileListItem } from '@/redux/modules/audioFileSlice';
import { tttSearchRecordTransferResult } from '@/api/ttt';
import { useAppFloatCtrl } from '@/hooks/useAppFloatCtrl';
import {
  addRecentSearchRecordId,
  addSearchHistoryKeyword,
  clearSearchHistoryKeywords,
  getRecentSearchRecordIds,
  getSearchHistoryKeywords,
  MAX_SEARCH_INPUT_CHARS,
  setRecentSearchRecordIds,
} from '@/utils/searchStorage';
import ListItem from '@/pages/home/component/FileRecycleList/ListItem';
import Res from '@/res';

import ThemedImage from '@/components/ThemedImage';
import { EmRichText } from '@/utils/searchEmHighlight';
import styles from './index.module.less';

/** 输入即时搜索防抖（ms），减轻接口压力 */
const SEARCH_INPUT_DEBOUNCE_MS = 400;

const pickKeywordFromRouteQuery = (query: Record<string, unknown> | undefined): string => {
  if (!query) {
    return '';
  }
  const raw = query.keyword ?? '';
  const text = String(raw ?? '');
  try {
    return decodeURIComponent(text);
  } catch {
    return text;
  }
};

const SearchPage: FC = () => {
  useAppFloatCtrl(true);
  const { screenHeight, topBarHeight, safeBottomHeight } = useSelector(selectSystemInfo);
  const fileList = useSelector(state => state.audioFile.fileList) as FileListItem[];
  const isCloudSyncEnabled = useSelector(state => state.uiState.cloudSyncSwitchStatus.enabled);

  const [keyword, setKeyword] = useState('');
  const [historyKeywords, setHistoryKeywords] = useState<string[]>(() =>
    getSearchHistoryKeywords()
  );
  const [recentRecordIds, setRecentRecordIds] = useState<string[]>(() =>
    getRecentSearchRecordIds()
  );
  const [results, setResults] = useState<any[]>([]);
  const [searchError, setSearchError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  /** 搜索框有内容 */
  const showSearchPanel = useMemo(() => {
    return keyword.trim()?.length > 0;
  }, [keyword]);

  const contentHeight =
    (Number(screenHeight) || 667) - (Number(topBarHeight) || 44) - (Number(safeBottomHeight) || 0);

  // 更新历史搜索和最近搜索
  const refreshLocalLists = useCallback(() => {
    setHistoryKeywords(getSearchHistoryKeywords());
    setRecentRecordIds(getRecentSearchRecordIds());
  }, []);

  usePageEvent('onShow', () => {
    refreshLocalLists();
  });

  const unmountedRef = useRef(false);
  useEffect(() => {
    return () => {
      unmountedRef.current = true;
    };
  }, []);

  const {
    run: runSearchRequest,
    loading: searchLoading,
    cancel: cancelSearchRequest,
  } = useRequest(
    async (q: string) => {
      const list = await tttSearchRecordTransferResult({ content: q });
      return Array.isArray(list) ? list : [];
    },
    {
      manual: true,
      onSuccess: data => {
        if (unmountedRef.current) return;
        const newData = data?.map(item => {
          const { title, audioSource, isFromCloud } = item;
          return {
            ...item,
            name: title,
            source: audioSource,
            isCloudFile: isFromCloud,
            visit: 2,
          };
        });
        setResults(newData);
        setSearchError(false);
        setHasSearched(true);
      },
      onError: () => {
        if (unmountedRef.current) return;
        setSearchError(true);
        setResults([]);
        setHasSearched(true);
      },
    }
  );

  /** 输入过程中防抖请求接口（不写历史关键词；历史仅在确认搜索 / 点 chip 时写入） */
  const { run: runDebouncedSearch, cancel: cancelDebouncedSearch } = useDebounceFn(
    (q: string) => {
      const t = q.trim();
      setHasSearched(false);
      if (!t) {
        setSearchError(false);
        setResults([]);
        return;
      }
      setSearchError(false);
      runSearchRequest(t);
    },
    { wait: SEARCH_INPUT_DEBOUNCE_MS }
  );

  const handleSearchChange = useCallback(
    (e: { detail?: string }) => {
      const raw = String(e?.detail ?? '');
      setKeyword(raw);
      if (!raw.trim()) {
        cancelDebouncedSearch();
        setSearchError(false);
        setResults([]);
        setHasSearched(false);
        return;
      }
      runDebouncedSearch(raw);
    },
    [runDebouncedSearch, cancelDebouncedSearch]
  );

  usePageEvent('onLoad', query => {
    const routeKeyword = pickKeywordFromRouteQuery(query as Record<string, unknown>);
    const initialKeyword = routeKeyword.trim().slice(0, MAX_SEARCH_INPUT_CHARS);
    if (!initialKeyword) {
      return;
    }
    setKeyword(initialKeyword);
    runDebouncedSearch(initialKeyword);
  });

  /** 确认搜索或点历史 chip：立即请求并写入历史 */
  const submitSearch = useCallback(
    (raw?: string) => {
      cancelDebouncedSearch();
      const q = (raw ?? keyword).trim();
      if (!q) {
        return;
      }
      setSearchError(false);
      setHasSearched(false);
      setKeyword(q);
      addSearchHistoryKeyword(q);
      refreshLocalLists();
      runSearchRequest(q);
    },
    [keyword, runSearchRequest, refreshLocalLists, cancelDebouncedSearch]
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, []);

  const handleClearHistory = useCallback(() => {
    clearSearchHistoryKeywords();
    refreshLocalLists();
  }, [refreshLocalLists]);

  const handleClearRecent = useCallback(() => {
    setRecentSearchRecordIds([]);
    setRecentRecordIds([]);
  }, []);

  const handleChipClick = useCallback(
    (text: string) => {
      const q = text.trim();
      setKeyword(q);
      submitSearch(q);
    },
    [submitSearch]
  );

  const openDetail = useCallback(
    (recordId: string) => {
      if (!recordId) {
        return;
      }
      addRecentSearchRecordId(recordId);
      refreshLocalLists();
      router.push(`/detail?recordId=${encodeURIComponent(recordId)}`);
    },
    [refreshLocalLists]
  );
  // 最近搜索列表
  const recentVisible = useMemo(() => {
    const valid = new Set(fileList.map(f => f.recordId).filter(Boolean));
    return recentRecordIds
      .filter(rid => valid.has(rid))
      .map(rid => {
        const file = fileList.find(f => f.recordId === rid) as FileListItem;
        return { recordId: rid, file };
      });
  }, [recentRecordIds, fileList]);

  /** fileList 有数据时：本地最近搜索里不在列表中的 recordId 从存储删除 */
  useEffect(() => {
    if (fileList.length === 0) {
      return;
    }
    const ids = getRecentSearchRecordIds();
    const valid = new Set(fileList.map(f => f.recordId).filter(Boolean));
    const next = ids.filter(rid => valid.has(rid));
    if (next.length !== ids.length) {
      // 保存到本地最近搜索的id列表
      setRecentSearchRecordIds(next);
      setRecentRecordIds(next);
    }
  }, [fileList]);
  const handleClickRecent = useCallback(
    (recordId: string) => {
      openDetail(recordId);
      addSearchHistoryKeyword(keyword);
      refreshLocalLists();
    },
    [openDetail, keyword, refreshLocalLists, addSearchHistoryKeyword]
  );

  const onSearchSubmit = useCallback(() => {
    submitSearch();
  }, [submitSearch]);

  const handleInputChange = useCallback(
    (e: { detail?: string | { value?: string } }) => {
      const detail = e?.detail;
      const value =
        typeof detail === 'string' ? detail : typeof detail?.value === 'string' ? detail.value : '';
      handleSearchChange({ detail: value });
    },
    [handleSearchChange]
  );
  const handleClearInput = useCallback(() => {
    setKeyword('');
    setResults([]);
    setHasSearched(false);
    setSearchError(false);
  }, []);

  return (
    <View className={styles.page}>
      <TopBar title={Strings.getLang('title_search')} />
      <View
        style={{
          height: `${contentHeight}px`,
          display: 'flex',
          flexDirection: 'column',
          padding: '0 32rpx',
        }}
      >
        <View className={styles.searchRow}>
          <View className={styles.inputShell}>
            <Icon name={searchIcon} size={18} color="var(--color-text-tertiary)" />
            <Input
              value={keyword}
              className={styles.searchInput}
              placeholder={Strings.getLang('search_placeholder')}
              maxLength={MAX_SEARCH_INPUT_CHARS}
              confirmType="search"
              onInput={handleInputChange}
              onConfirm={onSearchSubmit}
            />
            {keyword?.trim()?.length > 0 && (
              <Icon
                name={XmarkIcon}
                size={18}
                color="var(--color-text-tertiary)"
                onClick={handleClearInput}
              />
            )}
          </View>
          <Text className={styles.cancelBtn} onClick={handleCancel}>
            {Strings.getLang('cancel')}
          </Text>
        </View>

        <ScrollView scrollY className={styles.scroll}>
          {showSearchPanel && (
            <>
              {searchLoading && (
                <View className={styles.loadingHintWrap}>
                  <ThemedImage
                    imageName="loadingImg"
                    src={Res.loadingImg}
                    className={styles.loadingHintImg}
                  />
                  <Text className={styles.loadingHint}>{Strings.getLang('content_loading')}</Text>
                </View>
              )}
              {!searchLoading && searchError && (
                <View className={styles.requestErrorWrap}>
                  <ThemedImage
                    imageName="requestErrorImg"
                    src={Res.requestErrorImg}
                    className={styles.requestErrorImg}
                  />
                  <Text className={styles.requestErrorText}>
                    {Strings.getLang('search_network_error')}
                  </Text>
                </View>
              )}

              {!searchLoading &&
                results.map(item => (
                  <View
                    key={item?.recordId}
                    className={styles.recentCardWrap}
                    onClick={() => handleClickRecent(item?.recordId)}
                  >
                    <ListItem
                      id={`search_result_${item.recordId}`}
                      data={item as any}
                      needEmHighlight
                      isBatchMode={false}
                      isCloudFile={item.isFromCloud}
                      isCloudSyncEnabled={isCloudSyncEnabled}
                    >
                      <View className={styles.content}>
                        <EmRichText
                          content={item?.content}
                          highlightClassName={styles.emHighlight}
                          numberOfLines={4}
                        />
                      </View>
                    </ListItem>
                  </View>
                ))}
              {!searchLoading && hasSearched && !searchError && results.length === 0 && (
                <Text className={styles.emptyHint}>{Strings.getLang('search_no_results')}</Text>
              )}
            </>
          )}

          {!showSearchPanel && (
            <>
              {historyKeywords.length > 0 && (
                <View className={styles.section}>
                  <View className={styles.sectionHeader}>
                    <Text className={styles.sectionTitle}>
                      {Strings.getLang('search_history_title')}
                    </Text>
                    <View onClick={handleClearHistory}>
                      <Icon name={DeleteLineIcon} size={14} color="var(--color-text-tertiary)" />
                    </View>
                  </View>
                  <View className={styles.chipWrap}>
                    {historyKeywords.map(h => (
                      <Text
                        key={h}
                        className={styles.historyChip}
                        onClick={() => handleChipClick(h)}
                      >
                        {h}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {recentVisible.length > 0 && (
                <View className={styles.section}>
                  <View className={styles.sectionHeader}>
                    <Text className={styles.sectionTitle}>
                      {Strings.getLang('search_recent_title')}
                    </Text>
                    <View onClick={handleClearRecent}>
                      <Icon name={DeleteLineIcon} size={14} color="var(--color-text-tertiary)" />
                    </View>
                  </View>
                  {recentVisible.map(({ recordId, file }) => (
                    <View
                      key={recordId}
                      className={styles.recentCardWrap}
                      onClick={() => openDetail(recordId)}
                    >
                      <ListItem
                        id={`search_recent_${file.recordTransferId}`}
                        data={file}
                        isBatchMode={false}
                        isCloudFile={file.isFromCloud}
                        isCloudSyncEnabled={isCloudSyncEnabled}
                      />
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default React.memo(SearchPage);
