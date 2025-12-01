import React, { FC, useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView } from '@ray-js/components';
import { setKeepScreenOn } from '@ray-js/ray';
import { Icon } from '@ray-js/icons';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useInterval } from 'ahooks';
import {
  tttGetRecordTransferRealTimeResult,
  tttPauseRecord,
  tttResumeRecord,
  tttStopRecord,
} from '@/api/ttt';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import {
  RecordStatus,
  selectAudioFileByKey,
  updateRecordTask,
} from '@/redux/modules/audioFileSlice';
import { isJsonString, backToHome } from '@/utils';
import { parseRealTimerResult } from '@/utils/recording';
import Strings from '@/i18n';
// @ts-ignore
import styles from './index.module.less';

const DoingContent: FC<any> = () => {
  const lastTimeRef = useRef(0);
  const dispatch = useDispatch();
  const { devId: deviceId, isOnline } = useSelector(selectDevInfo);
  const { screenHeight, safeBottomHeight, topBarHeight } = useSelector(selectSystemInfo);
  const [duration, setDuration] = useState(0); // 毫秒
  const task = useSelector(selectAudioFileByKey('task'));
  const [scrollTop, setScrollTop] = useState(0);

  const [textList, setTextList] = useState([]);

  const [interval, setInterval] = useState<number | undefined>(undefined);
  const clear = useInterval(
    () => {
      const now = Date.now();
      const elapsed = now - lastTimeRef.current; // 计算实际经过的时间
      lastTimeRef.current = now;
      setDuration(prevDuration => prevDuration + elapsed); // 累加实际经过的时间
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
        lastTimeRef.current = Date.now();
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
        lastTimeRef.current = Date.now();
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
    console.warn('====onRecordFinishEvent===', d);
    if (d.deviceId !== deviceId) return;
    const { code, message } = d;
    if (code === 0) return; // 0为正常结束
    ty.showToast({ title: message, icon: 'error' });
    setInterval(undefined);
    dispatch(updateRecordTask());
    backToHome();
  };

  const currTextListRef = useRef([]);
  const handleRecordTransferRealTimeRecognizeStatusUpdateEvent = d => {
    try {
      console.log('实时录音事件', d);
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
          const newList = currTextListRef.current.map(item =>
            item.id === requestId ? { ...item, text } : item
          );
          currTextListRef.current = newList;
          setTextList(newList);
        } else {
          if (!text) return;
          const newList = [
            ...currTextListRef.current,
            {
              id: requestId,
              text,
              channel,
            },
          ];
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
            // 数字的string类型如111， isJsonString判断为json字符串，会导致.join失败
            resText = isArr ? textArr?.join('\n') : textArr;
          } else {
            resText = text;
          }
        }

        if (!resText) {
          return;
        }

        const newList = currTextListRef.current.map(item =>
          item.id === requestId ? { ...item, text: `${item.text}\n${resText}`, channel } : item
        );
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

  const [controlBtnLoading, setControlBtnLoading] = useState(false);

  // 暂停
  const handlePauseRecord = async () => {
    if (!isOnline || controlBtnLoading) return;
    try {
      setControlBtnLoading(true);
      await tttPauseRecord(deviceId);
      setInterval(undefined);
      setControlBtnLoading(false);
    } catch (error) {
      console.log('fail', error);
      setControlBtnLoading(false);
    }
  };

  // 恢复
  const handleResumeRecord = async () => {
    if (!isOnline || controlBtnLoading) return;
    try {
      setControlBtnLoading(true);
      await tttResumeRecord(deviceId);
      setInterval(1000);
      lastTimeRef.current = Date.now();
      setControlBtnLoading(false);
    } catch (error) {
      setControlBtnLoading(false);
    }
  };

  // 停止
  const handleStopRecord = async () => {
    if (controlBtnLoading) return;
    try {
      ty.showLoading({ title: Strings.getLang('stop1v1Ing') });
      await tttStopRecord(deviceId);
      setDuration(0);
      setInterval(undefined);
      ty.hideLoading();
      backToHome();
    } catch (error) {
      ty.hideLoading();
    }
  };

  return (
    <View className={styles.container}>
      <View className={styles.linearView} />
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
      <View className={styles.controlArea}>
        <>
          {(task?.state === RecordStatus.RECORDING || task?.state === RecordStatus.PAUSE) && (
            <View className={styles.stopBtn} onClick={handleStopRecord}>
              <Icon type="icon-a-stopfill" size={30} color="#231815" />
            </View>
          )}
          {task?.state === RecordStatus.RECORDING && (
            <View className={styles.pauseBtn} onClick={handlePauseRecord}>
              <Icon type="icon-a-pausefill" size={34} color="#231815" />
            </View>
          )}
          {task?.state === RecordStatus.PAUSE && (
            <View className={styles.pauseBtn} onClick={handleResumeRecord}>
              <Icon type="icon-a-playfill" size={34} color="#231815" />
            </View>
          )}
        </>
      </View>
    </View>
  );
};

export default React.memo(DoingContent);
