import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image, router, ScrollView, showToast, Text, View } from '@ray-js/ray';
import { usePagination } from 'ahooks';
import { getAgentInfo, getDialogHistoryList } from '@/api';
import { AICard, NoData, TopBar, TouchableOpacity } from '@/components';
import { COLOR_MAP } from '@/constant';
import Strings from '@/i18n';
import { updateAgentInfo } from '@/redux/modules/agentInfoSlice';
import { selectSingleAgent } from '@/redux/modules/singleAgentSlice';
import { imgAICardArrowIcon, imgTopAiIcon } from '@/res';
import { AgentInfo, DialogHistoryRes, GetDialogHistory, GetListParams, HistoryItem } from '@/types';
import { emitter, getWrapperHeight } from '@/utils';
import DialogSingleContent from './DialogSingleContent';
import styles from './index.module.less';

const DialogHistory: FC = () => {
  const dispatch = useDispatch();
  const {
    name = '',
    introduce = '',
    id = 0,
    wakeWord = '',
    bgColor = '1',
    logoUrl,
    isMain,
    added,
    tagKey,
    endpointAgentId,
  } = useSelector(selectSingleAgent);
  const [historyList, setHistoryList] = useState([]);
  const [emptyIdState, setEmptyIdState] = useState('bottomView');

  const getDialogHistoryListFunc = useCallback((params: GetListParams) => {
    return new Promise((resolve, reject) => {
      getDialogHistoryList({
        pageNo: params.current,
        pageSize: params.pageSize,
        endpointAgentId: tagKey === 'dialog' ? id : endpointAgentId,
      })
        .then((res: DialogHistoryRes) => {
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

  const { pagination, data, run } = usePagination(
    ({ current, pageSize }) =>
      getDialogHistoryListFunc({ current, pageSize }) as Promise<GetDialogHistory>,
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (data?.list && data?.list?.length > 0) {
      const { list } = data;
      const newList = [...list];
      newList.reverse();
      newList.push({ emptyId: `empty_${historyList.length}` });
      setTimeout(() => {
        setEmptyIdState(`empty_${historyList.length}`);
      }, 300);
      const tempList = [...newList, ...historyList];
      setHistoryList(tempList);
    }
  }, [data]);

  const getAgentInfoFunc = useCallback(async () => {
    if (tagKey === 'dialog' || (added && endpointAgentId)) {
      const agentInfo = (await getAgentInfo(
        tagKey === 'dialog' ? id : endpointAgentId
      )) as AgentInfo;

      dispatch(
        updateAgentInfo({
          ...agentInfo,
          endpointAgentId: tagKey === 'dialog' ? id : endpointAgentId,
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
    });
  };

  useEffect(() => {
    if (tagKey === 'dialog' || (added && endpointAgentId)) {
      initData();
    }
    emitter.on('refreshHistoryData', initData);
    return () => {
      emitter.off('refreshHistoryData');
    };
  }, []);

  const handleScrollToUpper = useCallback(() => {
    if (pagination.current + 1 <= pagination.total) {
      run({
        current: pagination.current + 1,
        pageSize: 10,
      });
    }
  }, [pagination]);

  const goToAgentEditPage = () => {
    if (tagKey === 'dialog' || (added && endpointAgentId)) {
      router.push(`/aiAgentEdit`);
    } else {
      showToast({
        title: Strings.getLang('dsc_not_add_tips'),
        icon: 'none',
      });
    }
  };

  return (
    <View className={styles.view}>
      <TopBar title={name} backgroundColor="#daecf6" />
      <View
        style={{
          display: 'inline-block',
          marginBottom: '10rpx',
          opacity: tagKey === 'dialog' || (added && endpointAgentId) ? 1 : 0.5,
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
            circleColor="#1270C4"
            bodyBgColor={
              COLOR_MAP[bgColor === '' ? '1' : bgColor]?.backgroundColor ??
              'linear-gradient(282deg, #2357F6 -8%, #26BBFF 116%)'
            }
            isShowRightArrow
            isShowRightEditor={false}
            onClickCard={goToAgentEditPage}
            logoUrl={logoUrl}
            creator={wakeWord}
          />
        )}
      </View>

      {historyList?.length > 0 ? (
        <ScrollView
          scrollIntoView={emptyIdState}
          scrollY
          style={{
            height: `calc(${getWrapperHeight()}px - 116rpx)`,
          }}
          onScrollToUpper={handleScrollToUpper}
        >
          {historyList.map((element: HistoryItem) => {
            const { question, answer, createTime, docId, emptyId } = element;
            return emptyId ? (
              <View
                id={emptyId}
                style={{ width: '1rpx', height: '1rpx', backgroundColor: 'transparent' }}
              />
            ) : (
              <DialogSingleContent
                key={docId}
                requestId={docId}
                questionList={question}
                answerList={answer}
                createTime={createTime}
              />
            );
          })}
          <View
            id="bottomView"
            style={{ width: '1rpx', height: '1rpx', backgroundColor: 'transparent' }}
          />
        </ScrollView>
      ) : (
        <NoData
          tip={Strings.getLang(
            tagKey === 'dialog' ? 'dsc_no_dialog_history_data' : 'dsc_not_add_history_tips'
          )}
          style={{ marginTop: '80rpx' }}
        />
      )}
    </View>
  );
};

export default DialogHistory;
