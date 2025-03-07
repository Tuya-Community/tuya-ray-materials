import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  getAITimbreCloneSupport,
  hideLoading,
  router,
  ScrollView,
  showLoading,
  showToast,
  Text,
  usePageEvent,
  View,
} from '@ray-js/ray';
import { usePagination } from 'ahooks';
import { editAgentInfo, getAgentInfo, getCloneVoiceList, getStandardVoiceList } from '@/api';
import { NoData, TagBar, TopBar, TouchableOpacity } from '@/components';
import SearchBar from '@/components/SearchBar';
import { themeColor } from '@/constant';
import Strings from '@/i18n';
import { selectAgentInfo, updateAgentInfo } from '@/redux/modules/agentInfoSlice';
import { updateCloneInfo } from '@/redux/modules/cloneInfoSlice';
import { selectSingleAgent } from '@/redux/modules/singleAgentSlice';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { initVoiceList, selectVoiceList, updateVoiceList } from '@/redux/modules/voiceListSlice';
import { AgentInfo, CloudVoiceItem, GetListParams, GetStandardVoice, VoiceRes } from '@/types';
import { emitter } from '@/utils';
import { selectUiState, updateUiState } from '@/redux/modules/uiStateSlice';
import store from '../../redux';
import VoiceItem from './VoiceItem';
import styles from './index.module.less';

const tags = [
  { text: Strings.getLang('dsc_tags_mine'), key: 'mine' },
  { text: Strings.getLang('dsc_tags_recommend'), key: 'recommend' },
  { text: Strings.getLang('dsc_tags_male'), key: 'male' },
  { text: Strings.getLang('dsc_tags_female'), key: 'female' },
  { text: Strings.getLang('dsc_tags_dialect'), key: 'dialect' },
  { text: Strings.getLang('dsc_tags_character'), key: 'character' },
  { text: Strings.getLang('dsc_tags_chinese'), key: 'chinese' },
  { text: Strings.getLang('dsc_tags_english'), key: 'english' },
];

const initCloneNumber = 10;

const VoiceSquare: FC = () => {
  const { dispatch } = store;
  const { language } = useSelector(selectSystemInfo);
  const { cloneDone } = useSelector(selectUiState);
  const { list } = useSelector(selectVoiceList);
  const [resList, setResList] = useState([]);

  const isZh = language.includes('zh');
  const [cloneEnable, setCloneEnable] = useState(true);
  const agentInfo = useSelector(selectAgentInfo);
  const { voiceId: currenVoiceId, endpointAgentId } = agentInfo;
  const { agentId = 0 } = useSelector(selectSingleAgent);
  const [topId, setTopId] = useState('');
  const [tag, setTag] = useState('recommend');
  const [searchText, setSearchText] = useState('');

  const sourceList = useMemo(() => {
    return tag === 'mine' ? resList : list;
  }, [tag, resList, list]);

  useEffect(() => {
    if (cloneDone) {
      setTag('mine');
    }
  }, [cloneDone]);

  const tagsList = useMemo(() => {
    const temTags = [...tags];
    if (!cloneEnable) {
      temTags.shift();
    }
    return temTags;
  }, [cloneEnable]);

  const getVoiceListFunc = (params: GetListParams) => {
    return new Promise((resolve, reject) => {
      getStandardVoiceList({
        pageNo: params.current,
        pageSize: params.pageSize,
        tag,
        agentId,
        keyWord: params.searchText,
      })
        .then((res: VoiceRes) => {
          const { totalPage, list = [] } = res;
          resolve({
            total: totalPage,
            list,
          });
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const { pagination, data, run } = usePagination(
    ({ current, pageSize, searchText }) =>
      getVoiceListFunc({ current, pageSize, searchText }) as Promise<GetStandardVoice>,
    {
      manual: true,
    }
  );

  const initClone = () => {
    getCloneVoiceList()
      .then(res => {
        setResList(res);
      })
      .catch(error => {
        console.log('==error', error);
      });
  };

  useEffect(() => {
    getAITimbreCloneSupport({})
      .then(res => {
        setCloneEnable(!!res);
      })
      .catch(() => {
        setCloneEnable(false);
      });
    emitter.on('refreshVoiceData', () => initClone());
    return () => {
      emitter.off('refreshVoiceData');
    };
  }, []);

  // 响应懒加载
  useEffect(() => {
    if (data?.list) {
      pagination.current > 1
        ? dispatch(updateVoiceList([...data?.list]))
        : dispatch(initVoiceList([...data?.list]));
    }
  }, [data]);

  // 页面数据初始化
  const initData = (searchText: string) => {
    run({
      current: 1,
      pageSize: 10,
      searchText,
    });
  };

  usePageEvent('onShow', () => {
    initClone();
  });

  useEffect(() => {
    if (tag === 'mine') {
      initClone();
    } else {
      initData('');
    }
    setSearchText('');
  }, [tag]);

  const handleScrollToLower = useCallback(
    (searchTextStr: string) => {
      if (pagination.current + 1 <= pagination.total) {
        run({
          current: pagination.current + 1,
          pageSize: 10,
          searchText: searchTextStr,
        });
      }
    },
    [pagination]
  );

  const handleCloneVoice = () => {
    dispatch(updateUiState({ cloneDone: false }));
    router.push(`/cloneSetting?remainTimes=${initCloneNumber}`);
    dispatch(updateCloneInfo({ lang: isZh ? 'zh' : 'en' }));
  };

  const onPressEditVoice = (remainTimesValue: number) => {
    router.push(`/voiceEdit?remainTimes=${tag === 'mine' ? 0 : remainTimesValue}`);
  };

  const handleItemChecked = (idKey: string) => {
    showLoading({
      title: '',
    });
    const editObj = {
      speed: agentInfo?.speed,
      tone: agentInfo?.tone,
      keepChat: agentInfo?.keepChat,
      isMain: agentInfo?.isMain ? 1 : 0,
    };
    editAgentInfo({ ...editObj, endpointAgentId, voiceId: idKey })
      .then(async res => {
        if (res) {
          setTimeout(async () => {
            const agentCloudInfo = (await getAgentInfo(Number(endpointAgentId))) as AgentInfo;
            dispatch(
              updateAgentInfo({ ...agentCloudInfo, endpointAgentId: Number(endpointAgentId) })
            );
            hideLoading();
            showToast({
              title: Strings.getLang('dsc_choose_success'),
              icon: 'success',
            });
          }, 500);
        }
        setTimeout(() => {
          hideLoading();
        }, 3000);
      })
      .catch(() => {
        setTimeout(() => {
          hideLoading();
          showToast({
            title: Strings.getLang('dsc_choose_fail'),
            icon: 'error',
          });
        }, 1000);
      });
  };

  const onPressSearch = (text: string) => {
    setTopId('topView');
    initData(text);
  };

  return (
    <View className={styles.view}>
      <TopBar title={Strings.getLang('dsc_voice')} backgroundColor="#daecf6" />
      <View style={{ display: 'inline-block' }}>
        <SearchBar
          disable={tag === 'mine'}
          outerSearchText={searchText}
          onPressSearch={() => onPressSearch(searchText)}
          editSearchText={setSearchText}
          containerStyle={{ marginTop: '16rpx', opacity: tag === 'mine' ? 0.4 : 1 }}
          defaultText={Strings.getLang('dsc_input_search_content')}
        />
      </View>
      <View
        style={{
          display: 'inline-block',
          height: '104rpx',
        }}
      >
        <TagBar
          tags={tagsList}
          value={tag}
          onChange={(keyStr: string) => {
            setTag(keyStr);
            setTopId('topView');
          }}
          className={styles.tagBar}
        />
      </View>

      {sourceList?.length > 0 ? (
        <ScrollView
          className={styles.recycleView}
          scrollY
          onScrollToLower={() => handleScrollToLower(searchText)}
          onScroll={() => setTopId('')}
          scrollIntoView={topId}
        >
          <View
            style={{ width: '1rpx', height: '1rpx', backgroundColor: 'transparent' }}
            id="topView"
          />
          {sourceList.map((item: CloudVoiceItem) => {
            const { voiceId, descTags, voiceName, createTime, remainTimes } = item;
            return (
              <VoiceItem
                key={voiceId}
                isChecked={currenVoiceId === voiceId}
                voiceName={voiceName}
                descTags={descTags}
                createTime={createTime}
                voiceId={voiceId}
                handleEdit={() => onPressEditVoice(remainTimes)}
                handleChecked={() => handleItemChecked(voiceId)}
              />
            );
          })}
        </ScrollView>
      ) : (
        <NoData tip={Strings.getLang('dsc_no_voice_data')} style={{ marginTop: '40rpx' }} />
      )}

      {cloneEnable && tag === 'mine' && sourceList?.length === 0 && (
        <TouchableOpacity
          className={styles.btn}
          style={{
            backgroundColor: themeColor,
            marginBottom: '60rpx',
          }}
          onClick={handleCloneVoice}
        >
          <Text className={styles.btnText} style={{ color: '#FFFFFF' }}>
            {Strings.getLang('dsc_clone_voice')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VoiceSquare;
