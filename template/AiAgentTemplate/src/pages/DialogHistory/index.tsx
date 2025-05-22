import React, { FC, useCallback, useEffect, useState, useRef, useMemo } from 'react';
import {
  router,
  View,
  Image,
  Text,
  ScrollView,
  CheckboxGroup,
  Checkbox,
  showToast,
  showModal,
  showLoading,
  hideLoading,
  navigateBack,
} from '@ray-js/ray';
import { Button } from '@ray-js/smart-ui';
import { AICard, NoData, TopBar, TouchableOpacity } from '@/components';
import Strings from '@/i18n';
import { usePagination } from 'ahooks';
import { useDispatch, useSelector } from 'react-redux';
import { selectSingleAgent } from '@/redux/modules/singleAgentSlice';
import { imgAICardArrowIcon, imgTopAiIcon } from '@/res';
import {
  emitter,
  getWrapperHeight,
  generateAdjacentGradients,
  getTheme,
  iOSExtractErrorMessage,
} from '@/utils';
import { AgentInfo, GetDialogHistory, GetListParams, HistoryItem } from '@/types';
import {
  clearAgentHistoryMessage,
  getDialogHistoryList,
  getAgentInfo,
  clearingHistoryRecord,
} from '@/api/index_highway';
import { updateAgentInfo } from '@/redux/modules/agentInfoSlice';
import _ from 'lodash';
import dayjs from 'dayjs';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';

import DialogSingleContent from './DialogSingleContent';
import styles from './index.module.less';

const DialogHistory: FC = () => {
  const dispatch = useDispatch();
  const {
    roleName: name = '',
    introduce = '',
    roleId: id = 0,
    wakeWord = '',
    roleImgUrl: logoUrl,
    isMain,
    added,
    endpointAgentId,
    roleId,
  } = useSelector(selectSingleAgent);
  const tagKey = 'conversation';
  const inConversation = true;
  const [historyList, setHistoryList] = useState([]);
  const [emptyIdState, setEmptyIdState] = useState('');
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [topicDividers, setTopicDividers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUpper, setLoadingUpper] = useState(false);
  const [loadingLower, setLoadingLower] = useState(false);
  const isInit = useRef(true);
  const [refresherTriggeredState, setRefresherTriggeredState] = useState(false);
  const { platform } = useSelector(selectSystemInfo);
  const [themeColor, setThemeColor] = useState(getTheme());
  const [generateThemeColor, setGenerateThemeColor] = useState(
    generateAdjacentGradients(themeColor)
  );

  const isCanEdit = useMemo(() => {
    return roleId || inConversation || ['conversation', 'customize'].indexOf(tagKey) !== -1;
  }, [roleId, inConversation, tagKey]);

  const getDialogHistoryListFunc = useCallback((params: GetListParams) => {
    return new Promise((resolve, reject) => {
      if (loading) return;
      setLoading(true);
      getDialogHistoryList({
        pageNo: params.current,
        pageSize: params.pageSize,
        roleId,
        startTime: params.startTime,
        endTime: params.endTime,
      })
        .then((res: any) => {
          setRefresherTriggeredState(false);
          const { totalPage, list } = res;
          setLoadingUpper(false);
          setLoading(false);
          setTimeout(() => {
            setLoadingLower(false);
          }, 2000);
          resolve({
            total: totalPage,
            list,
          });
        })
        .catch(error => {
          setRefresherTriggeredState(false);
          setLoadingUpper(false);
          setLoading(false);
          setTimeout(() => {
            setLoadingLower(false);
          }, 2000);
          if (platform === 'android') {
            showToast({
              title: error?.innerError?.errorMsg || error?.errorMsg,
              icon: 'error',
            });
          } else if (platform === 'ios') {
            showToast({
              title: error?.innerError?.errorMsg
                ? iOSExtractErrorMessage(error?.innerError?.errorMsg)
                : error?.errorMsg,
              icon: 'error',
            });
          }
          reject(error);
        });
    });
  }, []);

  const { pagination, data, run } = usePagination(
    ({ current, pageSize, startTime, endTime }) =>
      getDialogHistoryListFunc({
        current,
        pageSize,
        startTime,
        endTime,
      }) as Promise<GetDialogHistory>,
    {
      manual: true,
    }
  );

  const normalizeDate = dateStr => {
    if (!dateStr) return null;
    const parsedDate = new Date(dateStr.replace(/-/g, '/'));
    return isNaN(parsedDate) ? null : parsedDate;
  };

  useEffect(() => {
    if (data?.list && data?.list?.length > 0) {
      const { list } = data;
      const newList = [...list];
      const uniqList = _.uniqBy([...newList, ...historyList], 'requestId')
        .map(item => ({
          ...item,
          parsedTime: normalizeDate(item.createTime),
        }))
        .filter(item => item.parsedTime !== null); // 过滤掉解析失败的时间

      const sortedList = uniqList.sort((a, b) => a.parsedTime - b.parsedTime);

      setHistoryList(sortedList);
    }
  }, [data?.list]);

  const getAgentInfoFunc = useCallback(async () => {
    if (tagKey === 'conversation' || (added && endpointAgentId)) {
      const agentInfo = (await getAgentInfo(
        tagKey === 'conversation' ? id : endpointAgentId
      )) as AgentInfo;

      dispatch(
        updateAgentInfo({
          ...agentInfo,
          endpointAgentId: tagKey === 'conversation' ? id : endpointAgentId,
        })
      );
    }
  }, [id, added, endpointAgentId]);

  useEffect(() => {
    getAgentInfoFunc();
  }, [id, added, endpointAgentId]);

  const initData = () => {
    run({
      current: 1,
      pageSize: 10,
      startTime: dayjs().subtract(3, 'months').format('YYYY-MM-DD HH:mm:ss'),
      endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
  };

  useEffect(() => {
    // 首次
    if (inConversation) {
      initData();
    }
    // 清除后监听
    const handleRefresh = (data: { isContextCleared?: boolean; timestamp?: number }) => {
      if (data?.isContextCleared && data?.timestamp) {
        // 添加新的分割线时间戳
        setTopicDividers(prev => [...prev, data.timestamp]);
      }
      setHistoryList([]);
      initData();
    };

    emitter.on('refreshHistoryData', handleRefresh);
    return () => {
      console.log(' emitter.off refreshHistoryData', 777);
      emitter.off('refreshHistoryData', handleRefresh);
    };
  }, []);

  const handleScrollToUpper = useCallback(() => {
    console.log('handleScrollToUpper::pagination.current:::', pagination.current);
    console.log('handleScrollToUpper::pagination.total:::', pagination.total);
    if (loadingUpper) return;
    if (pagination.current + 1 <= pagination.total) {
      setLoadingUpper(true);
      run({
        current: pagination.current + 1,
        pageSize: 10,
        startTime: dayjs().subtract(3, 'months').format('YYYY-MM-DD HH:mm:ss'),
        endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
    }
  }, [pagination, loadingUpper]);

  // 上拉加载最新的数据
  const handleScrollToLower = useCallback(() => {
    console.log('handleScrollToLower:::');
    // fix: 首次iOS异常闪现刷新
    if (isInit.current) {
      // fix: 安卓被isInit.curren拦住的问题
      setTimeout(() => {
        isInit.current = false;
      }, 1000);
      return;
    }
    if (loadingLower) return;
    setLoadingLower(true);
    initData();
    isInit.current = false;
  }, [loadingLower]);

  const goToAgentEditPage = () => {
    if (isCanEdit) {
      router.push(`/customAgentEdit?roleId=${roleId}`);
    } else {
      showToast({
        title: Strings.getLang('dsc_not_add_tips'),
        icon: 'none',
      });
    }
  };

  const handleLongPress = useCallback(e => {
    setIsMultiSelectMode(true);
  }, []);

  const handleCheckboxChange = useCallback((requestId: string, checked: boolean) => {
    console.log(requestId, checked);
    setSelectedItems(prev => {
      if (checked) {
        return [...prev, requestId];
      }
      return prev.filter(id => id !== requestId);
    });
  }, []);

  const handleDeleteMessage = async () => {
    try {
      showLoading({ title: '' });
      await clearAgentHistoryMessage({
        roleId,
        requestIds: selectedItems?.join(','), // requestId就是docId吧
      });

      const newList = historyList.filter(item => !selectedItems.includes(item.requestId));
      setHistoryList(newList);

      hideLoading();
      showToast({
        title: Strings.getLang('dsc_delete_chat_history_tip_new'),
        icon: 'success',
      });
    } catch (err) {
      hideLoading();
      showToast({
        title: Strings.getLang('dsc_delete_chat_history_failed'),
        icon: 'error',
      });
    }
  };

  const handleClearingHistoryRecord = () => {
    showModal({
      title: '',
      content: Strings.getLang('dsc_delete_chat_history'),
      confirmText: Strings.getLang('delete'),
      cancelText: Strings.getLang('dsc_cancel'),
      success: ({ confirm }) => {
        if (confirm) {
          showLoading({
            title: '',
          });
          clearingHistoryRecord(roleId)
            .then(() => {
              console.log('删除成功::');
              hideLoading();
              showToast({
                title: Strings.getLang('dsc_delete_chat_history_tip'),
                icon: 'success',
              });
              navigateBack({});
              setTimeout(() => {
                emitter.emit('refreshHistoryData', '');
              }, 2000);
            })
            .catch(() => {
              hideLoading();
              showToast({
                title: Strings.getLang('dsc_delete_chat_history_failed'),
                icon: 'error',
              });
            });
        }
      },
    });
  };

  useEffect(() => {
    if (platform === 'ios') {
      setTimeout(() => {
        setEmptyIdState('bottomView');
      }, 500);
    } else {
      setTimeout(() => {
        setEmptyIdState('bottomView');
      }, 100);
    }
  }, [platform]);

  return (
    <View className={styles.view}>
      <TopBar title={name} backgroundColor="#daecf6" />
      <View
        style={{
          display: 'inline-block',
          marginBottom: '10rpx',
          opacity: isCanEdit ? 1 : 0.5,
        }}
      >
        {isMain === 1 ? (
          <TouchableOpacity className={styles.topItem} onClick={goToAgentEditPage}>
            <Image src={logoUrl === '' ? imgTopAiIcon : logoUrl} className={styles.logo} />
            <View className={styles.textBox}>
              <Text className={styles.itemName}>{name}</Text>
              <Text className={styles.itemIntroduce}>{introduce}</Text>
            </View>
            <Image src={imgAICardArrowIcon} className={styles.rightArrow} />
          </TouchableOpacity>
        ) : (
          // @ts-ignore
          <AICard
            name={name}
            introduce={introduce}
            circleColor={themeColor}
            bodyBgColor={`linear-gradient(282deg, ${generateThemeColor.left} -8%, ${generateThemeColor.right} 116%)`}
            isShowRightArrow
            isShowRightEditor={false}
            onClickCard={goToAgentEditPage}
            logoUrl={logoUrl}
            creator={wakeWord}
          />
        )}
      </View>

      <ScrollView
        scrollIntoView={emptyIdState}
        scrollY
        style={{
          height: `calc(${getWrapperHeight()}px - 116rpx)`,
          display: historyList?.length === 0 ? 'none' : 'block',
        }}
        upperThreshold={200}
        onScrollToUpper={handleScrollToUpper}
        onScrollToLower={handleScrollToLower}
        lowerThreshold={300}
        scrollWithAnimation
        refresherEnabled
        refresherTriggered={refresherTriggeredState}
        refresherBackground="transparent"
        onRefresherrefresh={e => {
          setRefresherTriggeredState(true);
          initData();
        }}
      >
        {historyList.map((message: HistoryItem, index: number) => {
          return (
            <View
              key={message.requestId}
              className={styles.historyItem}
              onLongPress={handleLongPress}
            >
              {isMultiSelectMode && (
                <CheckboxGroup
                  onChange={e => {
                    handleCheckboxChange(message.requestId, e.detail.value.length > 0);
                  }}
                >
                  <Checkbox value={message.requestId} className={styles.checkbox} />
                </CheckboxGroup>
              )}
              <DialogSingleContent
                requestId={message.requestId}
                questionList={message.question}
                answerList={message.answer}
                createTime={message.createTime}
              />
            </View>
          );
        })}
        <View
          id="bottomView"
          style={{ width: '1rpx', height: '1rpx', backgroundColor: 'transparent' }}
        />
      </ScrollView>

      {historyList.length === 0 && (
        <NoData
          tip={Strings.getLang(
            tagKey === 'conversation'
              ? 'dsc_no_dialog_history_data_new'
              : 'dsc_not_add_history_tips_new'
          )}
          style={{ marginTop: '80rpx' }}
        />
      )}

      {isMultiSelectMode && (
        <View className={styles.bottomDeleteContainer}>
          <Button
            customClass={styles.bottomDelete}
            customStyle={{
              opacity: selectedItems.length ? 1 : 0.2,
            }}
            onClick={() => {
              if (selectedItems.length !== 0) {
                showModal({
                  title: '',
                  content: Strings.getLang('dsc_delete_chat_history'),
                  confirmText: Strings.getLang('delete'),
                  cancelText: Strings.getLang('dsc_cancel'),
                  success: ({ confirm }) => {
                    if (confirm) {
                      handleDeleteMessage();
                      setIsMultiSelectMode(false);
                      setSelectedItems([]);
                    }
                  },
                });
              }
            }}
            type="danger"
          >
            {Strings.getLang('delete')}
          </Button>

          <Button
            customClass={styles.bottomCancel}
            onClick={() => {
              setIsMultiSelectMode(false);
              setSelectedItems([]);
            }}
          >
            {Strings.getLang('cancel')}
          </Button>
        </View>
      )}

      {!isMultiSelectMode && historyList?.length > 0 && (
        <Button customClass={styles.bottomBtn} onClick={handleClearingHistoryRecord} type="danger">
          {Strings.getLang('dsc_delete_chat_history')}
        </Button>
      )}
    </View>
  );
};

export default DialogHistory;
