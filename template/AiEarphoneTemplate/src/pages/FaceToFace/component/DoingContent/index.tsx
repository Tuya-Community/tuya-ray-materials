import React, { FC, useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView } from '@ray-js/components';
import { router, setKeepScreenOn } from '@ray-js/ray';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useInterval } from 'ahooks';
import { tttGetRecordTransferRealTimeResult } from '@/api/ttt';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import {
  RecordStatus,
  selectAudioFileByKey,
  updateRecordTask,
} from '@/redux/modules/audioFileSlice';
import { isJsonString } from '@/utils';
import { parseRealTimerResult } from '@/utils/recording';
import Strings from '@/i18n';
// @ts-ignore
import styles from './index.module.less';

const DoingContent: FC<any> = ({ activeType, textList, setTextList }) => {
  const dispatch = useDispatch();
  const { devId: deviceId } = useSelector(selectDevInfo);
  const { screenHeight, safeBottomHeight, topBarHeight } = useSelector(selectSystemInfo);
  const [duration, setDuration] = useState(0); // 毫秒
  const task = useSelector(selectAudioFileByKey('task'));
  const [scrollTop, setScrollTop] = useState(0);

  const [interval, setInterval] = useState<number | undefined>(undefined);
  const clear = useInterval(
    () => {
      setDuration(duration + 1000);
    },
    interval,
    {
      immediate: false,
    }
  );

  useEffect(() => {
    if (!task) return;
    switch (task.state) {
      case RecordStatus.FINISH: {
        setInterval(undefined);
        break;
      }
      case RecordStatus.PAUSE:
        setInterval(undefined);
        break;
      case RecordStatus.RECORDING:
        setInterval(1000);
        break;
      default:
        break;
    }
  }, [task]);

  const checkRecordTask = async () => {
    // 当前存在任务
    if (task) {
      const { userRecordDuration } = task;
      setDuration(userRecordDuration);
      if (task.state === RecordStatus.RECORDING) {
        setInterval(1000);
      }
      try {
        const realTimeResult: any = await tttGetRecordTransferRealTimeResult({
          recordId: task.recordId,
        });
        const resList = parseRealTimerResult(realTimeResult);
        if (resList.length) {
          currTextListRef.current = resList;
          setTextList(resList);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setDuration(0);
    }
  };

  const handleRecordFinishEvent = d => {
    if (d.deviceId !== deviceId) return;
    const { code, message } = d;
    if (code === 0) return; // 0为正常结束
    ty.showToast({ title: message, icon: 'error' });
    setInterval(undefined);
    dispatch(updateRecordTask());
    router.back();
  };

  const currTextListRef = useRef([]);
  const handleRecordTransferRealTimeRecognizeStatusUpdateEvent = d => {
    try {
      const {
        // 阶段  0.任务 4.asr 5.text 6.skill 7.tts
        phase,
        // 阶段状态 0. 未开启 1.进行中 2.结束 3.取消
        status,
        requestId,
        text,
        errorCode,
        channel, // 0 左耳 1 右耳
      } = d;

      if (errorCode === 10081) {
        // 欠费
        ty.showToast({ title: Strings.getLang('error_10081'), icon: 'error' });
        return;
      }

      // asr阶段 接收并实时更新对应requestId文本
      if (phase === 4) {
        const currTextItemIdx = currTextListRef.current.findIndex(item => item.id === requestId);
        if (currTextItemIdx > -1) {
          const newList = currTextListRef.current.map(item => {
            const currentItem = { ...item, text };
            if (activeType === 'left' || activeType === 'right') {
              currentItem.channel = activeType === 'left' ? 0 : 1;
            }
            return item.id === requestId ? currentItem : item;
          });
          currTextListRef.current = newList;
          setTextList(newList);
        } else {
          if (!text) return;
          const currentItem = { id: requestId, text, channel };
          if (activeType === 'left' || activeType === 'right') {
            currentItem.channel = activeType === 'left' ? 0 : 1;
          }
          const newList = [...currTextListRef.current, currentItem];
          currTextListRef.current = newList;
          setTextList(newList);
        }
        // text阶段 接收并展示status=2即已结束的requestId文本内容
      } else if (phase === 5 && status === 2) {
        let resText = '';
        if (text && text !== 'null') {
          if (isJsonString(text)) {
            const textArr = JSON.parse(text);
            const isArr = Array.isArray(textArr);
            if (isArr) {
              resText = textArr?.join('\n');
            } else {
              resText = textArr;
              console.log('===phase 5  status 2  text', textArr);
            }
          } else {
            resText = text;
          }
        }

        if (!resText) {
          return;
        }

        const newList = currTextListRef.current.map(item => {
          const currentItem = { ...item, text: `${item.text}\n${resText}`, channel };
          if (activeType === 'left' || activeType === 'right') {
            currentItem.channel = activeType === 'left' ? 0 : 1;
          }
          return item.id === requestId ? currentItem : item;
        });
        currTextListRef.current = newList;
        setTextList(newList);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    // 粗略计算内容高度去滚动scrollView
    let height = 0;
    textList?.forEach(item => {
      height += (item?.text?.length / 50) * 30 + 20 * 2 + 50;
    });
    setScrollTop(height);
  }, [textList]);

  const destroyEvent = () => {
    clear();
    setKeepScreenOn({ keepScreenOn: false });
    ty.wear.offRecordTransferFinishEvent(handleRecordFinishEvent);
    ty.wear.offRecordTransferRealTimeRecognizeStatusUpdateEvent(
      handleRecordTransferRealTimeRecognizeStatusUpdateEvent
    );
    ty.hideLoading();
  };

  useEffect(() => {
    ty.hideMenuButton();
    setKeepScreenOn({ keepScreenOn: true });
    checkRecordTask();
    ty.wear.onRecordTransferFinishEvent(handleRecordFinishEvent);
    ty.wear.onRecordTransferRealTimeRecognizeStatusUpdateEvent(
      handleRecordTransferRealTimeRecognizeStatusUpdateEvent
    );
    return () => {
      destroyEvent();
    };
  }, []);

  return textList?.length > 0 ? (
    <View className={styles.container}>
      <View className={styles.content}>
        <ScrollView
          className={styles.scroll}
          style={{
            height: `${screenHeight - topBarHeight - safeBottomHeight - 96}px`,
          }}
          refresherTriggered={false}
          scrollY
          scrollTop={scrollTop}
        >
          {textList.map(({ channel, text, id }) => {
            if (!text) return null;
            if (channel === 0) {
              return (
                <View key={id} className={styles.leftTextBox}>
                  <Text className={styles.originText}>{text}</Text>
                </View>
              );
            }
            return (
              <View key={id} className={styles.rightTextBox}>
                <Text className={styles.originText}>{text}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  ) : (
    <></>
  );
};

export default React.memo(DoingContent);
