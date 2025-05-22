import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  useLayoutEffect,
} from 'react';
import {
  View,
  Text,
  router,
  registerMQTTProtocolListener,
  onMqttMessageReceived,
  offMqttMessageReceived,
  createInnerAudioContext,
  usePageEvent,
  getAITimbreCloneSupport,
  ScrollView,
  hideLoading,
  showLoading,
  showToast,
  location,
  navigateBack,
  Image,
  onWindowResize,
  offWindowResize,
  getBoundingClientRect,
  getElementById,
  getDevInfo,
} from '@ray-js/ray';
import { NoData, TagBar, TopBar, TouchableOpacity } from '@/components';
import Strings from '@/i18n';
import {
  AgentInfo,
  CloudVoiceItem,
  GetListParams,
  GetStandardVoice,
  VoiceRes,
} from '@/typings/api';
import {
  getAgentInfo,
  checkClonePermission,
  getStandardVoiceList,
  getCloneVoiceList,
  updateRole,
  localGetCloneRadioSource,
} from '@/api/index_highway';
import { usePagination } from 'ahooks';
import { useSelector } from 'react-redux';
import { selectAgentInfo, updateAgentInfo } from '@/redux/modules/agentInfoSlice';
import { updateCloneInfo } from '@/redux/modules/cloneInfoSlice';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { selectSingleAgent } from '@/redux/modules/singleAgentSlice';
import { selectUiState, updateUiState } from '@/redux/modules/uiStateSlice';
import { selectRoleInfo, updateRoleInfo } from '@/redux/modules/roleInfoSlice';
import usePanelConfigs from '@/hooks/usePanelConfig';

import { initVoiceList, selectVoiceList, updateVoiceList } from '@/redux/modules/voiceListSlice';
import { emitter, getTheme, iOSExtractErrorMessage, getHighPower } from '@/utils';
import SearchBar from '@/components/SearchBar';
import { imgFree } from '@/res';
import _ from 'lodash';
import { Skeleton } from '@ray-js/smart-ui';
import styles from './index.module.less';
import store from '../../redux';
import VoiceItem from './VoiceItem';

const initCloneNumber = 10;

const VoiceSquare: FC = () => {
  const routerParams = location.query as any;
  const selectedLang = routerParams.lang || 'zh';
  const { squareEntry, selectedVoiceId } = routerParams;

  const [isCloneSupport, setIsCloneSupport] = useState(true);
  const { cloneDone } = useSelector(selectUiState);
  const [themeColor, setThemeColor] = useState(getTheme());
  const currentAudioContext = useRef(null);
  const isTagAutoSelected = useRef<boolean>(false);
  const [resList, setResList] = useState([]);
  const [selectVoiceIdState, setSelectVoiceId] = useState(selectedVoiceId);
  const { agentId = 0, roleId } = useSelector(selectSingleAgent);
  const { screenHeight } = useSelector(selectSystemInfo);
  const [windowHeight, setWindowHeight] = useState(screenHeight);
  const [scrollTop, setScrollTop] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tagName, setTagName] = useState('');
  const cloneHighAbility = usePanelConfigs();

  useLayoutEffect(() => {
    const handleWindowResize = res => {
      setWindowHeight(res.size.windowHeight);
    };

    onWindowResize && onWindowResize(handleWindowResize);

    return () => {
      offWindowResize && offWindowResize(handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (cloneDone) {
      setTag('mine');
    }
  }, [cloneDone]);

  const tags = useMemo(() => {
    const permissions = [{ text: Strings.getLang('dsc_tags_recommend'), key: 'recommend' }];
    if (isCloneSupport && cloneHighAbility) {
      permissions.unshift({ text: Strings.getLang('dsc_tags_mine_new'), key: 'mine' });
    }
    return permissions;
  }, [isCloneSupport, cloneHighAbility]);
  const { dispatch } = store;
  const { list } = useSelector(selectVoiceList);
  const agentInfo = useSelector(selectAgentInfo);
  const roleInfo = useSelector(selectRoleInfo);
  const { platform } = useSelector(selectSystemInfo);
  const [tag, setTag] = useState('recommend');
  const [searchText, setSearchText] = useState('');

  const { language } = useSelector(selectSystemInfo);

  const tagsList = useMemo(() => {
    const temTags = [...tags];
    return temTags;
  }, [tags]);

  const sourceList = useMemo(() => {
    return tag === 'mine' ? resList : list;
  }, [tag, resList, list]);

  const getVoiceListFunc = (params: GetListParams) => {
    return new Promise((resolve, reject) => {
      getStandardVoiceList({
        pageNo: params.current,
        pageSize: params.pageSize,
        tag,
        agentId,
        keyWord: params.searchText,
        lang: selectedLang,
      })
        .then((res: VoiceRes) => {
          const { totalPage, list = [] } = res;
          hideLoading();
          setLoading(false);
          resolve({
            total: totalPage,
            list,
          });
        })
        .catch(error => {
          hideLoading();
          setLoading(false);
          reject(error);
        });
    });
  };
  const initClone = () => {
    getCloneVoiceList({ lang: selectedLang })
      .then(res => {
        hideLoading();
        setResList(res);
        setLoading(false);
      })
      .catch(error => {
        hideLoading();
        setLoading(false);
      });
  };

  const [cloneEnable, setCloneEnable] = useState(true);

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
  const { pagination, data, run } = usePagination(
    ({ current, pageSize, searchText }) =>
      getVoiceListFunc({ current, pageSize, searchText }) as Promise<GetStandardVoice>,
    {
      manual: true,
    }
  );

  const handleMqttDataChange = (res: ty.device.MqttResponse) => {
    try {
      const { protocol, messageData } = res;
      if (protocol === 501 && messageData.type === 'agentConfig') {
        hideLoading();

        const { operation } = messageData.data as any;
        if (operation === 'complete') {
          showToast({
            title: Strings.getLang('dsc_choose_success'),
            icon: 'success',
          });
        } else {
          showToast({
            title: Strings.getLang('dsc_choose_fail'),
            icon: 'error',
          });
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    registerMQTTProtocolListener({
      protocol: 501,
      success: () => {
        onMqttMessageReceived(handleMqttDataChange);
      },
      fail: err => console.warn(err),
    });
    return () => {
      offMqttMessageReceived(handleMqttDataChange);
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
      pageSize: 200,
      searchText,
    });
  };

  usePageEvent('onShow', () => {
    initClone();
  });
  usePageEvent('onHide', () => {
    isTagAutoSelected.current = false;
  });

  useEffect(() => {
    if (tag === 'mine') {
      initClone();
    } else {
      initData('');
    }
    setSearchText('');
  }, [tag, selectedLang]);

  const handleScrollToLower = useCallback(
    (searchTextStr: string) => {
      if (pagination.current + 1 <= pagination.total) {
        run({
          current: pagination.current + 1,
          pageSize: 200,
          searchText: searchTextStr,
        });
      }
    },
    [pagination]
  );

  const handleCloneVoice = useCallback(() => {
    if (sourceList?.length >= 1) {
      showToast({
        title: Strings.getLang('dsc_fail_limit'),
        icon: 'error',
      });
      return;
    }
    dispatch(updateUiState({ cloneDone: false }));
    router.push(
      `/cloneVoice?remainTimes=${initCloneNumber}&cloneEntry=create&lang=${selectedLang}`
    );
    dispatch(updateCloneInfo({ lang: selectedLang }));
  }, [sourceList, initCloneNumber, selectedLang]);

  const onPressEditVoice = (remainTimesValue: number, voiceId, voiceName) => {
    router.push(
      `/voiceSetting?voiceId=${voiceId}&voiceName=${encodeURIComponent(
        voiceName
      )}&lang=${selectedLang}&remainTimes=${tag === 'mine' ? 0 : remainTimesValue}`
    );
  };

  const playVoiceAudio = (voiceId: string) => {
    // Stop any currently playing audio
    if (currentAudioContext.current) {
      currentAudioContext.current.stop({
        success: () => {
          console.log('Previous audio stopped successfully');
        },
        fail: err => console.warn('Failed to stop previous audio', err),
      });
      currentAudioContext.current.pause({
        success: () => {
          console.log('Previous audio stopped successfully');
        },
        fail: err => console.warn('Failed to stop previous audio', err),
      });
      currentAudioContext.current.destroyPlayer();
      currentAudioContext.current = null;
    }

    // Create new audio context
    const audioContext = createInnerAudioContext({
      success: () => {
        console.log('createInnerAudioContext success');
      },
      fail: err => console.warn('createInnerAudioContext fail', err),
    });

    // Store the new audio context
    currentAudioContext.current = audioContext;

    currentAudioContext.current.play({
      src: voiceId,
      autoplay: true,
      startTime: 0,
      loop: false,
      volume: 1,
      playbackRate: 1,
      success: () => {
        console.log('Audio playing successfully');
      },
      fail: () => {
        showToast({
          title: Strings.getLang('dsc_play_fail'),
          icon: 'error',
        });
      },
    });

    currentAudioContext.current.onTimeUpdate(res => {
      if (res.time === 1 && currentAudioContext.current) {
        currentAudioContext.current.destroyPlayer();
        currentAudioContext.current = null;
      }
    });
  };

  // Clean up audio context when component unmounts
  useEffect(() => {
    if (currentAudioContext.current) {
      currentAudioContext.current.stop({});
      currentAudioContext.current.destroyPlayer();
      currentAudioContext.current = null;
    }
    return () => {
      if (currentAudioContext.current) {
        currentAudioContext.current.stop({});
        currentAudioContext.current.destroyPlayer();
        currentAudioContext.current = null;
      }
    };
  }, []);

  const handleItemChecked = async (idKey: string, item: any) => {
    try {
      if (tag === 'mine') {
        showLoading({ title: Strings.getLang('clone_voice_generating') });
        const cloneMp3 = await localGetCloneRadioSource({
          objectKey: item?.demoUrl || undefined,
          voiceId: idKey,
          lang: selectedLang,
          // lang: finalLanguage,
        }).catch(err => {
          hideLoading();
        });
        setTimeout(() => {
          hideLoading();
        }, 500);
        if (cloneMp3) {
          playVoiceAudio(cloneMp3);
        }
      } else {
        playVoiceAudio(item?.demoUrl);
      }
      if (squareEntry === 'role') {
        dispatch(
          updateRoleInfo({
            voiceId: idKey,
            voiceName: item?.voiceName,
            supportLangs: item?.supportLangs,
          })
        );

        return;
      }
      if (tag !== 'mine') {
        showLoading({
          title: '',
        });
      }
      const params = { ...roleInfo, useTimbreId: idKey, roleId };
      if (squareEntry === 'role') {
        delete params.roleId;
      }
      updateRole(params)
        .then(async res => {
          if (res) {
            dispatch(updateRoleInfo({ voiceId: idKey, voiceName: item?.voiceName }));

            setTimeout(async () => {
              const agentCloudInfo = (await getAgentInfo(roleId)) as AgentInfo;
              dispatch(updateAgentInfo({ ...agentCloudInfo, roleId }));
              hideLoading();
            }, 500);
          }
          hideLoading();
        })
        .catch(error => {
          if (platform === 'android' && error?.innerError?.errorCode === '13890100') {
            showToast({
              title: error?.innerError?.errorMsg,
              icon: 'error',
            });
          } else if (platform === 'ios') {
            showToast({
              title: iOSExtractErrorMessage(error?.innerError?.errorMsg),
              icon: 'error',
            });
          } else {
            showToast({
              title: Strings.getLang('dsc_choose_fail'),
              icon: 'error',
            });
          }
          hideLoading();
        });
    } catch (err) {
      console.log('handleItemChecked:::err', err);
      hideLoading();
    }
  };

  const onPressSearch = (text: string) => {
    initData(text);
  };
  const [topId, setTopId] = useState('');

  // 标签选中的逻辑
  // 1.我的：如果有会默认选中
  // 2.角色tag：如果有会默认选中
  // 3.推荐

  // fix: 如果克隆开头，跳到我的
  useEffect(() => {
    if (cloneEnable) {
      if (roleInfo?.voiceId?.includes?.('clone') || selectVoiceIdState?.includes?.('clone')) {
        setTag('mine');
        setSelectVoiceId('');
      }
    }
  }, [cloneEnable, roleInfo?.voiceId, selectVoiceIdState]);

  // fix: 如果getAIAgentRoleDetail中返回useTimbreTags":["Male","Youth","Chinese"]，取命中的那个
  useEffect(() => {
    if (agentInfo?.useTimbreTags?.length > 0 && !isTagAutoSelected?.current) {
      const tagNames = tags?.map(item => item?.key);
      const useTimbreTagsLower = agentInfo?.useTimbreTags?.map(item => item?.toLowerCase());
      const index = useTimbreTagsLower?.findIndex(item => tagNames?.includes(item));
      if (index !== -1) {
        setTag(useTimbreTagsLower?.[index]);
        isTagAutoSelected.current = true;
      }
    }
  }, [agentInfo?.useTimbreTags]);

  const getSize = useCallback(async () => {
    try {
      const element = await getElementById('isCheckedVoice');
      if (element) {
        const rect = await getBoundingClientRect(element);
        // console.log('Rect:::', rect);
        if (rect) {
          setScrollTop(rect?.top - windowHeight / 2);
        }
      }
    } catch (error) {
      console.error('Error getting size:', error);
    }
  }, [windowHeight]);

  // 挂载后就置为true，避免选择后跳到其他tag
  useEffect(() => {
    isTagAutoSelected.current = true;
    return () => {
      isTagAutoSelected.current = false;
    };
  }, []);

  useEffect(() => {
    if (tag) {
      setScrollTop(0);
      setTimeout(() => {
        getSize();
      }, 300);
    }
  }, [tag]);

  return (
    <View className={styles.view}>
      <TopBar
        title={Strings.getLang('dsc_voice')}
        backgroundColor="#daecf6"
        onBack={() => {
          if (squareEntry === 'role') {
            navigateBack({ delta: 1 });
          } else {
            navigateBack({});
          }
        }}
      />
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

      <TagBar
        tags={tagsList}
        value={tag}
        onChange={(name, text) => {
          showLoading({ title: '' });
          setTag(name);
          setTagName(text);
          setLoading(true);
        }}
        className={styles.tagBar}
        activeStyle={{ backgroundColor: themeColor }}
        activeUnderlineColor={themeColor}
      />

      {!loading && sourceList?.length > 0 ? (
        <ScrollView
          className={styles.recycleView}
          scrollY
          onScrollToLower={() => handleScrollToLower(searchText)}
          onScroll={() => setTopId('')}
          scrollIntoView={topId}
          scrollTop={scrollTop}
          scrollWithAnimation
        >
          <View
            style={{ width: '1rpx', height: '1rpx', backgroundColor: 'transparent' }}
            id="topView"
          />

          {sourceList.map((item: CloudVoiceItem) => {
            const { voiceId, descTags, voiceName, createTime, remainTimes } = item;
            return (
              <View
                key={voiceId}
                id={(roleInfo?.voiceId || selectedVoiceId) === voiceId ? 'isCheckedVoice' : ''}
              >
                <VoiceItem
                  key={voiceId}
                  isChecked={(roleInfo?.voiceId || selectedVoiceId) === voiceId}
                  voiceName={voiceName}
                  descTags={descTags}
                  createTime={createTime}
                  voiceId={voiceId}
                  handleEdit={() => onPressEditVoice(remainTimes, voiceId, voiceName)}
                  handleChecked={() => handleItemChecked(voiceId, item)}
                  isCanEdit={
                    (!!roleId && (roleInfo?.voiceId || selectedVoiceId) === voiceId) ||
                    (!!roleId && tag === 'mine')
                  }
                />
              </View>
            );
          })}
        </ScrollView>
      ) : loading ? (
        <View style={{ width: '100%', position: 'absolute', top: '400rpx' }}>
          <Skeleton title row={3} rowWidth={['100%', '100%', '80%']} />
        </View>
      ) : (
        <NoData
          tip={Strings.getLang('dsc_no_voice_data')}
          style={{ marginTop: '80rpx', flex: 1, display: loading ? 'none' : 'flex' }}
        />
      )}

      {isCloneSupport && tag === 'mine' && (
        <View className={styles.btnContainer}>
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
            <Text className={styles.freeTip}>{Strings.getLang('dsc_clone_voice_free_new')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default VoiceSquare;
