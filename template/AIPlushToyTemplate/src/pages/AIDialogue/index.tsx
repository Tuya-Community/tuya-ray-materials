/* eslint-disable prettier/prettier */
import React, { FC, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PercentSlider from '@ray-js/lamp-percent-slider';
import { useActions, useProps } from '@ray-js/panel-sdk';
import { hideLoading, Image, offWindowResize, onWindowResize, router, ScrollView, showLoading, showToast, Text, View } from '@ray-js/ray';
import { usePagination } from 'ahooks';
import { addAgentEndpoint, editAgentInfo, getAgentInfo, getAIAgentList, getBoundAgents, getUnboundAgent, unbindingAgent } from '@/api';
import { Battery, NoData, TagBar, TouchableOpacity } from '@/components';
import AICard from '@/components/AICard';
import DialogConfirm from '@/components/DialogConfirm';
import { TopBarProps } from '@/components/TopBar';
import { COLOR_MAP, themeColor } from '@/constant';
import { volumeSetCode } from '@/constant/dpCodes';
import { devices } from '@/devices';
import useAgentTags from '@/hooks/useAgentTags';
import Strings from '@/i18n';
import { updateAgentInfo } from '@/redux/modules/agentInfoSlice';
import { initAgentList, refreshAgentList, selectAgentList, updateAgentList, updateBoundAgentList, updateNewNumber, updateTagState } from '@/redux/modules/agentListSlice';
import { updateSingleAgent } from '@/redux/modules/singleAgentSlice';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { imgLoadingIcon, imgTopAiIcon, imgVolumeIcon } from '@/res';
import { AgentInfo, AgentListItem, AgentListRes, GetAgentListRes, GetListParams } from '@/types';
import { emitter, getDevId } from '@/utils';
import store from '../../redux';
import styles from './index.module.less';

interface Props {
  setTopBarProps: (props: TopBarProps) => void;
}

const AIDialogue: FC<Props> = ({ setTopBarProps }) => {
  const { dispatch } = store;
  const actions = useActions();
  const { screenHeight } = useSelector(selectSystemInfo);
  const dpVolumeSet = useProps(props => props[volumeSetCode]);
  const [windowHeight, setWindowHeight] = useState(screenHeight);
  const [sliderValue] = useState(dpVolumeSet);
  const { list } = useSelector(selectAgentList);
  const [AIAgentPageList, setAIAgentPageList] = useState([] as Array<AgentListItem>);
  const [tag, setTag] = useState('dialog');
  const [isRefresh, setIsRefresh] = useState(false);
  const [isBackToTop, setIsBackToTop] = useState(false);
  const [isShowUnbindConfirm, setIsShowUnbindConfirm] = useState(false);
  const [unbindId, setUnbindId] = useState(-1);
  const [topId, setTopId] = useState('');
  const [sourceList, setSourceList] = useState([]);
  const { tags } = useAgentTags();

  const {
    property: { min = 0, max = 0 },
  } = useMemo(() => devices.common.getDpSchema()?.[volumeSetCode] ?? { property: {} }, []);

  const topAICardData = useMemo(() => {
    if (list?.length > 0) {
      return list[0];
    }
    return null;
  }, [list]);

  useEffect(() => {
    setSourceList(tag === 'dialog' ? list : AIAgentPageList);
  }, [list, AIAgentPageList, tag]);

  // 生成适配usePagination的 接口请求函数，用于获取未绑定智能体会话列表
  const getAgentListFunc = useCallback((params: GetListParams) => {
    return new Promise((resolve, reject) => {
      getUnboundAgent({ pageNo: params.current, pageSize: params.pageSize })
        .then(res => {
          const { totalPage, list } = res;
          resolve({
            total: totalPage,
            list,
          });
        })
        .catch(error => {
          reject(error);
        });
    });
  }, []);

  const getAIAgentListFunc = useCallback((params: GetListParams) => {
    return new Promise((resolve, reject) => {
      getAIAgentList({
        devId: getDevId(),
        tag: params.tag,
        keyWord: '',
        pageNo: params.current,
        pageSize: params.pageSize,
      })
        .then(res => {
          const { totalPage, list } = res;
          resolve({
            total: totalPage,
            list,
          });
        })
        .catch(error => {
          reject(error);
        });
    });
  }, []);

  const getBoundAgentsFunc = async () => {
    getBoundAgents().then((res: AgentListRes) => {
      const { list: boundAgentList = [] } = res;
      dispatch(updateBoundAgentList([...boundAgentList]));
    });
  };

  const { pagination, data, run } = usePagination(
    ({ current, pageSize, tag }) =>
      getAgentListFunc({ current, pageSize, tag }) as Promise<GetAgentListRes>,
    {
      manual: true,
    }
  );

  const {
    pagination: paginationSquare,
    data: dataSquare,
    run: runSquare,
  } = usePagination(
    ({ current, pageSize, tag }) =>
      getAIAgentListFunc({ current, pageSize, tag }) as Promise<GetAgentListRes>,
    {
      manual: true,
    }
  );

  // topBar样式修改
  useLayoutEffect(() => {
    setTopBarProps({ backgroundColor: '#daecf6' });
    initData('dialog');
    emitter.on('refreshDialogData', () => initData('dialog'));

    const handleWindowResize = res => {
      setWindowHeight(res.size.windowHeight);
    };

    onWindowResize && onWindowResize(handleWindowResize);

    return () => {
      setTopBarProps({ backgroundColor: '#fff' });
      emitter.off('refreshDialogData');
      offWindowResize && offWindowResize(handleWindowResize);
    };
  }, []);

  const initData = (tagKey: string) => {
    if (tagKey === 'dialog') {
      run({
        current: 1,
        pageSize: 10,
      });
    } else {
      runSquare({
        current: 1,
        pageSize: 10,
        tag: tagKey,
      });
    }

    getBoundAgentsFunc();
  };

  // 页面数据初始化
  useEffect(() => {
    initData(tag);
  }, [tag]);

  // 响应会话懒加载
  useEffect(() => {
    if (data?.list && pagination.current > 1) {
      dispatch(updateAgentList([...data?.list]));
    } else if (data?.list && pagination.current <= 1) {
      isRefresh
        ? dispatch(refreshAgentList([...data?.list]))
        : dispatch(initAgentList([...data?.list]));
    }
  }, [data, tag]);

  // 响应智能体广场懒加载
  useEffect(() => {
    if (dataSquare?.list && paginationSquare.current > 1) {
      setAIAgentPageList([...AIAgentPageList, ...dataSquare?.list]);
    } else if (dataSquare?.list && paginationSquare.current <= 1) {
      setAIAgentPageList([...dataSquare?.list]);
    }
  }, [dataSquare, tag]);

  // 下拉刷新，懒加载
  const handleScrollToLower = useCallback(() => {
    if (pagination.current + 1 <= pagination.total && tag === 'dialog') {
      run({
        current: pagination.current + 1,
        pageSize: 10,
      });
    }
    if (paginationSquare.current + 1 <= paginationSquare.total && tag !== 'dialog') {
      runSquare({
        current: paginationSquare.current + 1,
        pageSize: 10,
        tag,
      });
    }
  }, [pagination, paginationSquare, tag]);

  const goToDialogHistory = (item: AgentListItem, tagKey: string) => {
    dispatch(updateSingleAgent({ ...item, tagKey }));
    setTimeout(() => {
      router.push(`/dialogHistory`);
    }, 300);
  };

  const handleEditSingleCard = async (item: AgentListItem, tagKey: string, isBound: boolean) => {
    if (tagKey === 'dialog') {
      const agentInfo = (await getAgentInfo(item.id)) as AgentInfo;
      const { voiceId = '', speed = 1.2, tone = 1.1, keepChat = true } = agentInfo ?? {};
      editAgentInfo({
        voiceId,
        speed,
        tone,
        keepChat,
        isMain: !isBound ? 1 : 0,
        endpointAgentId: item.id,
      })
        .then(async () => {
          setTimeout(async () => {
            dispatch(updateAgentInfo({ ...agentInfo, endpointAgentId: item.id }));
          }, 1000);
          emitter.emit('refreshDialogData', '');
          hideLoading();
          showToast({
            title: Strings.getLang('dsc_edit_success'),
            icon: 'success',
          });
        })
        .catch(() => {
          hideLoading();
          showToast({
            title: Strings.getLang('dsc_edit_fail'),
            icon: 'error',
          });
        });
    } else {
      setIsRefresh(true);
      addAgentEndpoint({ devId: getDevId(), agentId: item.id })
        .then(() => {
          showToast({
            title: Strings.getLang(`AICardMenu_0_success`),
          });
          // 找到目标 agent，修改 added 为 true
          const newAIAgentPageList = AIAgentPageList.map(element => {
            if (item.id === element.id) {
              return {
                ...element,
                added: true,
              };
            }
            return element;
          });
          setAIAgentPageList(newAIAgentPageList);
          emitter.emit('refreshDialogData', '');
          setTimeout(() => {
            setIsBackToTop(true);
          }, 600);
        })
        .catch(err => {
          console.warn(err);
        });
    }
  };

  const handleChangeTag = (tagKey: string) => {
    setIsRefresh(tagKey !== 'dialog');
    setIsBackToTop(false);
    dispatch(updateTagState(tagKey));
    setTag(tagKey);
    setTopId('1');
    tagKey === 'dialog' && dispatch(updateNewNumber(0));
  };

  const handleAfterChange = (value: number) => {
    actions[volumeSetCode].set(value, { debounce: 400 });
  };

  const unbindingAIAgent = (idKey: number) => {
    showLoading({
      title: '',
    });
    unbindingAgent(idKey)
      .then(() => {
        hideLoading();
        showToast({
          title: Strings.getLang('dsc_unbinding_success'),
          icon: 'success',
        });
        emitter.emit('refreshDialogData', '');
        setTimeout(() => {
          router.back();
        }, 600);
      })
      .catch(() => {
        hideLoading();
        showToast({
          title: Strings.getLang('dsc_unbinding_fail'),
          icon: 'error',
        });
      });
    setUnbindId(-1);
    setIsShowUnbindConfirm(false);
  };

  const handleUnbindingAIAgent = (idKey: number) => {
    if (idKey === topAICardData?.id) {
      showToast({
        title: Strings.getLang('dsc_disable_remove_dialog'),
        icon: 'none',
      });
    } else {
      setUnbindId(idKey);
      setIsShowUnbindConfirm(true);
    }
  };

  return (
    <View className={styles.view}>
      <View className={styles.topAIBox}>
        <Battery />
        {topAICardData && (
          <TouchableOpacity
            className={styles.topAiIconBox}
            onClick={() => goToDialogHistory(topAICardData, 'dialog')}
          >
            <Image
              src={topAICardData ? topAICardData.logoUrl : imgTopAiIcon}
              className={styles.topAiIcon}
            />
          </TouchableOpacity>
        )}
        {topAICardData && (
          <View className={styles.topTextBox}>
            <Text className={styles.topTextTitle}>
              {topAICardData ? topAICardData.name : Strings.getLang('dsc_no_agent_yet')}
            </Text>
            <Text className={styles.topTextSubTitle}>
              {topAICardData ? topAICardData.introduce : Strings.getLang('dsc_no_agent_yet_tips')}
            </Text>
          </View>
        )}
        {!topAICardData && (
          <View className={styles.loadingBox}>
            <Image src={imgLoadingIcon} className={styles.loadingImage} />
            <Text className={styles.topTextTitle}>{Strings.getLang('dsc_loading_tips')}</Text>
          </View>
        )}
      </View>
      <View className={styles.agentContainer}>
        <View className={styles.bg} />
        <View className={styles.agentTop}>
          <View className={styles.volumeBox}>
            <Image src={imgVolumeIcon} className={styles.volumeIcon} />
            <View className={styles.verticalLine} />
            {max > 0 && (
              <PercentSlider
                style={{ width: '550rpx' }}
                value={sliderValue}
                onTouchEnd={handleAfterChange}
                min={min}
                max={max}
                showIcon={false}
                showText={false}
                instanceId={volumeSetCode}
                trackStyle={{
                  width: '550rpx',
                  height: '16rpx',
                  borderRadius: '8rpx',
                  backgroundColor: 'rgba(43, 139, 247, 0.2)',
                }}
                barStyle={{
                  width: '550rpx',
                  height: '16rpx',
                  borderRadius: '8rpx',
                  backgroundColor: themeColor,
                }}
              />
            )}
          </View>
          <View className={styles.grayLineBox}>
            <View className={styles.grayLine} />
          </View>
          <View className={styles.titleBox}>
            <Text className={styles.agentTitle}>{Strings.getLang('agentTitle')}</Text>
            <Text className={styles.agentTips}>{Strings.getLang('agentTips')}</Text>
          </View>
          <View
            style={{
              display: 'inline-block',
              height: '104rpx',
            }}
          >
            <TagBar
              tags={tags}
              value={tag}
              onChange={(key: string) => {
                handleChangeTag(key);
              }}
              className={styles.tagBar}
              activeStyle={
                tag !== 'dialog'
                  ? {}
                  : {
                      background: 'linear-gradient(114deg, #408CFF 3%, #0ED3D8 90%)',
                    }
              }
              scrollToIdKey={isBackToTop ? 'topView' : ''}
            />
          </View>
        </View>
      </View>
      {sourceList?.length > 0 ? (
        <ScrollView
          className={styles.agentBox}
          scrollY
          onScrollToLower={handleScrollToLower}
          onScroll={() => {
            setTopId('');
          }}
          scrollIntoView={topId}
          style={{ height: `${(windowHeight - 420) * 2}rpx` }}
        >
          <View style={{ width: '1rpx', height: '1rpx', backgroundColor: 'transparent' }} id="1" />
          {sourceList.map((item, index) => {
            const { name, introduce, bgColor, id, logoUrl, added, wakeWord } = item;
            return (
              <View key={id} className={styles.singleItem}>
                <AICard
                  key={id}
                  name={name}
                  introduce={introduce}
                  circleColor="#1270C4"
                  bodyBgColor={
                    COLOR_MAP[bgColor === '' ? '1' : bgColor]?.backgroundColor ??
                    'linear-gradient(282deg, #2357F6 -8%, #26BBFF 116%)'
                  }
                  onClickCard={() => goToDialogHistory(item, tag)}
                  handleEdit={() =>
                    handleEditSingleCard(item, tag, tag === 'dialog' && id === topAICardData?.id)
                  }
                  logoUrl={logoUrl}
                  style={{
                    marginBottom: index === sourceList.length - 1 ? '1rem' : '0.25rem',
                    marginTop: index === 0 ? '0.34rem' : '0',
                  }}
                  editText={Strings.getLang(
                    tag !== 'dialog'
                      ? added
                        ? 'AICardMenu_0_disabled'
                        : 'dsc_add_dialog'
                      : id === topAICardData?.id
                      ? 'dsc_bind_device_success'
                      : 'dsc_bind_device'
                  )}
                  added={added || (tag === 'dialog' && id === topAICardData?.id)}
                  creator={wakeWord}
                  enableLongPress={tag === 'dialog'}
                  handleLongPress={() => handleUnbindingAIAgent(id)}
                  {...item}
                />
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View className={styles.noDataBox}>
          <NoData
            tip={Strings.getLang('dsc_no_dialog_agent')}
            style={{ marginTop: '40rpx', marginBottom: '350rpx' }}
          />
        </View>
      )}
      <DialogConfirm
        visible={isShowUnbindConfirm}
        title={Strings.getLang('dsc_unbind_notice')}
        subTitle={Strings.getLang('dsc_unbind_tips')}
        onConfirm={() => unbindingAIAgent(unbindId)}
        onClose={() => setIsShowUnbindConfirm(false)}
      />
    </View>
  );
};

export default AIDialogue;
