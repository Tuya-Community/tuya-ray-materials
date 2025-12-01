import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Image, Button, ScrollView } from '@ray-js/components';
import Res from '@/res';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { useSelector, useDispatch } from 'react-redux';
import { TopBar, Player } from '@/components';
import { router, showModal, usePageEvent, setKeepScreenOn } from '@ray-js/ray';
import {
  tttGetFilesDetail,
  tttRemoveFiles,
  tttTransfer,
  tttUpdateFile,
  tttGetRecordTransferRecognizeResult,
  tttGetRecordTransferSummaryResult,
  tttSaveRecordTransferRecognizeResult,
  tttSaveRecordTransferSummaryResult,
  tttGetRecordTransferRealTimeResult,
  tttSaveRecordTransferRealTimeRecognizeResult,
} from '@/api/ttt';
import { TransferType, updateRecordTransferResultList } from '@/redux/modules/audioFileSlice';
import useUpdateSingleTransferStatus from '@/hooks/useUpdateSingleTransferStatus';
import Tabs from '@ray-js/components-ty-tabs';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import Strings from '@/i18n';
import _ from 'lodash-es';
import SttContent, { SttDataItem } from './component/SttContent';
import SummaryContent from './component/SummaryContent';
import MindMapContent from './component/MindMapContent';
import EmptyContent from './component/EmptyContent';
import ChooseTransferTemplate, { TRANSFER_TEMPLATE } from './component/ChooseTransferTemplate';
// @ts-ignore
import styles from './index.module.less';

export enum EMPTY_TYPE {
  NO_RESULT, // 无数据
  TRANSCRIBING, // 转录中
  NO_TRANSCRIPTION, // 未转录
}

// 播放状态
export enum PLAY_STATUS {
  Initial, // 未开始
  Playing, // 正在播放
  Pause, // 暂停中
}
// 转录状态
export enum TRANSFER_STATUS {
  Initial, // 未转录
  Processing, // 转录中
  Finish, // 转录完成
  Failed, // 转录失败
}

const Detail: FC<any> = props => {
  const dispatch = useDispatch();
  const currRecordTransferId = useRef<number>(null);
  const [recordFile, setRecordFile] = useState(null);
  const { screenHeight, topBarHeight, safeBottomHeight, language } = useSelector(selectSystemInfo);

  // 0未开始 1正在播放 2暂停
  const [playerStatus, setPlayerStatus] = useState(PLAY_STATUS.Initial);
  // 转录状态 0未转录 1转录中 2转录完成 3转录失败
  const [transferStatus, setTransferStatus] = useState(TRANSFER_STATUS.Initial);
  // 总结
  const [summary, setSummary] = useState('');
  // 分段文本
  const [sttData, setSttData] = useState<SttDataItem[]>([]);
  const originSttList = useRef(null);
  const [currTab, setCurrTab] = useState<string>('stt');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showTemplatePopup, setShowTemplatePopup] = useState(false);
  const [template, setTemplate] = useState<TRANSFER_TEMPLATE>('default');

  const updateFileVisitStatus = async () => {
    await tttUpdateFile({ recordTransferId: currRecordTransferId.current, visit: true });
    dispatch(updateRecordTransferResultList());
  };

  useEffect(() => {
    if (typeof recordFile?.transfer !== 'undefined') {
      setTransferStatus(recordFile.transfer);
    }
  }, [recordFile?.transfer]);

  const resolveSttText = (text: string) => {
    try {
      const sttList = JSON.parse(text);
      originSttList.current = sttList;
      // 单位是否为秒
      const isSecondUnit = sttList?.[0].timeOffset.includes('s');
      const sttResData = sttList.map(
        ({ transcript, translation, timeOffset }: any, idx: number) => {
          const time = isSecondUnit ? +parseInt(timeOffset, 10) : Math.floor(+timeOffset / 1000);
          return {
            startSecond:
              idx === 0
                ? 0
                : Math.floor(
                  parseInt(sttList?.[idx - 1]?.timeOffset || 0, 10) / (isSecondUnit ? 1 : 1000)
                ),
            endSecond: time,
            text: transcript,
            transText: translation,
          };
        }
      );
      setSttData(sttResData);
      originSttData.current = sttResData;
    } catch (error) {
      console.log('resolveSttText error', error);
    }
  };

  const resolveSummaryText = (text: string) => {
    try {
      const summaryData: any = JSON.parse(text);
      setSummary(summaryData?.summary || '');
    } catch (error) {
      console.log('resolveSummaryText error', error);
    }
  };

  const getFileDetail = async () => {
    const finishLoading = () => {
      ty.hideLoading();
      isLoading.current = false;
    };
    try {
      isLoading.current = true;
      ty.showLoading({ title: '' });
      const recordTransferId = currRecordTransferId.current;
      const fileDetail: any = await tttGetFilesDetail({
        recordTransferId,
        amplitudeMaxCount: 100,
      });
      if (fileDetail) {
        setRecordFile(fileDetail);
        const { storageKey, transfer, visit, status, recordId, transferType } = fileDetail;
        if (!visit) {
          updateFileVisitStatus();
        }
        setTransferStatus(transfer);
        // 实时转写直接取用app接口的转写数据
        if (transferType === TransferType.REALTIME) {
          const realTimeResult: any = await tttGetRecordTransferRealTimeResult({
            recordId,
          });
          const { list } = realTimeResult;
          const newData = list
            .filter(item => !!item?.asr && item?.asr !== 'null')
            .map(item => ({
              asrId: item.asrId,
              startSecond: Math.floor(item.beginOffset / 1000),
              endSecond: Math.floor(item.endOffset / 1000),
              text: item.asr,
              transText: item.translate,
              channel: item.channel,
            }));
          setSttData(newData);
          originSttData.current = newData;
          // 获取客户端本地总结数据
          tttGetRecordTransferSummaryResult({
            recordTransferId,
            from: 0,
          }).then((d: any) => {
            if (d?.text) {
              resolveSummaryText(d?.text);
            }
          });
          // 获取云端总结数据
          tttGetRecordTransferSummaryResult({
            recordTransferId,
            from: 1, // 云端
          }).then((d: any) => {
            if (d?.text) {
              tttSaveRecordTransferSummaryResult({ recordTransferId, text: d?.text });
              resolveSummaryText(d?.text);
            }
          });
        } else {
          // status 文件同步状态，0未上传、1上传中、2已上传、3上传失败
          // transfer 转录状态，0未转录、1转录中、2已转录、3转录失败
          // eslint-disable-next-line no-lonely-if
          if (status === 2 && transfer === 2) {
            // 获取客户端本地转写数据
            tttGetRecordTransferRecognizeResult({
              recordTransferId,
              from: 0, // 本地
            }).then((d: any) => {
              if (d?.text) {
                resolveSttText(d?.text);
              }
            });
            // 获取云端转写数据
            tttGetRecordTransferRecognizeResult({
              recordTransferId,
              from: 1, // 云端
            }).then((d: any) => {
              if (d?.text) {
                // 缓存到客户端本地
                tttSaveRecordTransferRecognizeResult({ recordTransferId, text: d?.text });
                resolveSttText(d?.text);
              }
            });
            // 获取客户端本地总结数据
            tttGetRecordTransferSummaryResult({
              recordTransferId,
              from: 0,
            }).then((d: any) => {
              if (d?.text) {
                resolveSummaryText(d?.text);
              }
            });
            // 获取云端总结数据
            tttGetRecordTransferSummaryResult({
              recordTransferId,
              from: 1, // 云端
            }).then((d: any) => {
              if (d?.text) {
                tttSaveRecordTransferSummaryResult({ recordTransferId, text: d?.text });
                resolveSummaryText(d?.text);
              }
            });
          }
        }

        finishLoading();
      }
    } catch (error) {
      console.log('error', error);
      finishLoading();
    }
  };

  const innerAudioContextRef = useRef(null);

  useEffect(() => {
    ty.hideMenuButton();
    currRecordTransferId.current = props.location.query.recordTransferId;
    getFileDetail();
    setKeepScreenOn({ keepScreenOn: true });
    return () => {
      ty.hideLoading();
    };
  }, []);

  const { loopStatus, setLoopStatus } = useUpdateSingleTransferStatus(
    props.location.query.recordTransferId,
    recordFile
  );
  const debounceGetDetail = _.debounce(() => {
    getFileDetail();
    setLoopStatus(0); // 重置状态
  }, 2000);
  useEffect(() => {
    if (loopStatus !== 0) {
      debounceGetDetail();
    }
  }, [loopStatus]);

  usePageEvent('onUnload', () => {
    ty.hideLoading();
    setKeepScreenOn({ keepScreenOn: false });
  });

  const handleConfirmTemplate = (selectTemplate: TRANSFER_TEMPLATE) => {
    setTemplate(selectTemplate);
    setShowTemplatePopup(false);
    const { duration } = recordFile;
    if (duration < 90 * 1000) {
      // 小于90秒弹提示
      showModal({
        title: Strings.getLang('transfer_start_recordTime_warn_title'),
        content: Strings.getLang('transfer_start_recordTime_warn_tip'),
        showCancel: true,
        cancelText: Strings.getLang('cancel'),
        cancelColor: '#66666',
        confirmText: Strings.getLang('confirm'),
        confirmColor: '#3678E3',
        success: async ({ confirm }) => {
          try {
            if (confirm) {
              handleStartTransfer(selectTemplate);
            }
          } catch (error) {
            console.log(error);
          }
        },
      });
    } else {
      handleStartTransfer(selectTemplate);
    }
  };

  const isLoading = useRef(false);
  const handleStartTransfer = async (selectTemplate: TRANSFER_TEMPLATE) => {
    if (isLoading.current) return;
    try {
      isLoading.current = true;
      ty.showLoading({ title: '' });
      await tttTransfer({
        recordTransferId: currRecordTransferId.current,
        template: selectTemplate,
        language: recordFile?.originalLanguage || language,
      });
      setTransferStatus(TRANSFER_STATUS.Processing);
      const fileDetail: any = await tttGetFilesDetail({
        recordTransferId: currRecordTransferId.current,
        amplitudeMaxCount: 100,
      });
      setRecordFile(fileDetail);
      dispatch(updateRecordTransferResultList());
      ty.hideLoading();
      isLoading.current = false;
    } catch (error) {
      console.log(error);
      dispatch(updateRecordTransferResultList());
      ty.hideLoading();
      isLoading.current = false;
    }
  };

  const handleDelete = async () => {
    showModal({
      title: Strings.getLang('dialog_delete_title'),
      content: Strings.getLang('dialog_delete_content'),
      showCancel: true,
      cancelText: Strings.getLang('cancel'),
      cancelColor: '#666666',
      confirmText: Strings.getLang('confirm'),
      confirmColor: '#3678E3',
      success: async ({ confirm }) => {
        try {
          if (confirm) {
            await tttRemoveFiles({ fileIds: [currRecordTransferId.current] });
            dispatch(updateRecordTransferResultList());
            router.back();
          }
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  const [currPlayTime, setCurrPlayTime] = useState(0);

  const handlePlayerTimeUpdate = useCallback(
    (time: number) => {
      setCurrPlayTime(time);
    },
    [recordFile?.duration || 0]
  );

  const originSttData = useRef([]);
  const handleUpdateSttData = useCallback(
    (text: string, index: number, isTrans?: boolean) => {
      let newSttData = _.cloneDeep(sttData);
      if (isTrans) {
        newSttData = newSttData.map((item, idx) => {
          if (idx === index) {
            return {
              ...item,
              transText: text,
            };
          }
          return item;
        });
      } else {
        newSttData = newSttData.map((item, idx) => {
          if (idx === index) {
            return {
              ...item,
              text,
            };
          }
          return item;
        });
      }
      setSttData(newSttData);
    },
    [sttData]
  );

  const handleSttEdit = () => {
    setIsEditMode(true);
  };

  const [keyboardShow, setKeyboardShow] = useState(false);
  const handleKeyboardWillShow = () => {
    setKeyboardShow(true);
  };
  const handleKeyboardWillHide = () => {
    setKeyboardShow(false);
  };
  useEffect(() => {
    ty.onKeyboardWillShow(handleKeyboardWillShow);
    ty.onKeyboardWillHide(handleKeyboardWillHide);
    return () => {
      ty.offKeyboardWillShow(handleKeyboardWillShow);
      ty.offKeyboardWillHide(handleKeyboardWillHide);
    };
  }, []);

  // 保存编辑结果
  const handleClickEditSave = useCallback(async () => {
    try {
      // 判断一下键盘是否收起，避免输入框未失焦
      if (keyboardShow) return;
      // 实时转写/同声传译的编辑保存逻辑 与 离线转写不同
      if (recordFile.transferType === TransferType.REALTIME) {
        sttData.forEach(async item => {
          const { asrId, text, transText } = item;
          await tttSaveRecordTransferRealTimeRecognizeResult({
            asrId,
            asr: text,
            translate: transText,
          });
        });
        setIsEditMode(false);
      } else {
        if (!originSttList.current) return;
        // 处理修改后的转写记录，分别存到云端和APP本地
        const newSttList = _.cloneDeep(originSttList.current).map(
          (item: any, idx: string | number) => ({
            ...item,
            transcript: sttData[idx].text,
          })
        );
        const newSttListJsonStr = JSON.stringify(newSttList);
        // 存APP本地
        const localParams = {
          recordTransferId: currRecordTransferId.current,
          text: newSttListJsonStr,
        };
        console.log('localParams', localParams);
        await tttSaveRecordTransferRecognizeResult(localParams);
        resolveSttText(newSttListJsonStr);
        setIsEditMode(false);
        // currEditSttItem.current = null;
      }
    } catch (error) {
      console.log('error', error);
    }
  }, [sttData, keyboardShow, recordFile]);

  const handleClickEditCancel = useCallback(() => {
    // 判断一下键盘是否收起，避免输入框未失焦
    if (keyboardShow) return;
    setSttData(originSttData.current);
    setIsEditMode(false);
  }, [keyboardShow]);

  const renderHeaderRight = useCallback(() => {
    if (transferStatus === TRANSFER_STATUS.Finish) {
      if (isEditMode) {
        return (
          <View className={styles.saveBtn} onClick={handleClickEditSave}>
            <Text className={styles.saveText}>{Strings.getLang('save')}</Text>
          </View>
        );
      }
    }
    return null;
  }, [transferStatus, isEditMode, handleClickEditSave]);

  return (
    <View className={styles.main}>
      <TopBar
        title={isEditMode ? '' : Strings.getLang('title_recording_detail')}
        renderRight={renderHeaderRight}
        onBack={() => {
          if (isEditMode) {
            handleClickEditCancel();
          } else {
            router.back();
          }
        }}
      />
      <ScrollView
        className={styles.container}
        style={{
          height: `${screenHeight - topBarHeight - safeBottomHeight}px`,
          // backgroundColor: '#0f0',
        }}
        refresherTriggered={false}
        scrollY
      >
        {/* 播放器 */}
        <View className={styles.content}>
          <Player
            wavFilePath={recordFile?.wavFilePath || ''}
            duration={recordFile?.duration || 0}
            playerStatus={playerStatus}
            amplitudes={recordFile?.amplitudes || ''}
            onPlayerStatusChange={status => {
              setPlayerStatus(status);
            }}
            onInnerAudioContext={context => {
              innerAudioContextRef.current = context;
            }}
            onPlayerTimeUpdate={handlePlayerTimeUpdate}
          />
        </View>
        {/* 转录结果 */}
        <View className={styles.content}>
          <Tabs.SegmentedPicker
            activeKey={currTab}
            tabActiveTextStyle={{
              color: 'rgba(54, 120, 227, 1)',
              fontWeight: '600',
            }}
            style={{ backgroundColor: 'rgba(241, 241, 241, 1)' }}
            onChange={activeKey => {
              setCurrTab(activeKey);
            }}
          >
            <Tabs.TabPanel tab={Strings.getLang('recording_detail_tab_stt')} tabKey="stt" />
            <Tabs.TabPanel tab={Strings.getLang('recording_detail_tab_summary')} tabKey="summary" />
            <Tabs.TabPanel
              tab={Strings.getLang('recording_detail_tab_mind_map')}
              tabKey="mindMap"
            />
          </Tabs.SegmentedPicker>
          {currTab === 'stt' && (
            <SttContent
              playerStatus={playerStatus}
              wavFilePath={recordFile?.wavFilePath}
              transferStatus={transferStatus}
              sttData={sttData}
              recordType={recordFile?.recordType}
              currPlayTime={currPlayTime}
              onChangePlayerStatus={status => {
                setPlayerStatus(status);
              }}
              innerAudioContextRef={innerAudioContextRef}
              isEditMode={isEditMode}
              onUpdateSttData={handleUpdateSttData}
            />
          )}
          {currTab === 'summary' && (
            <SummaryContent summary={summary} transferStatus={transferStatus} />
          )}
          {currTab === 'mindMap' && (
            <MindMapContent summary={summary} transferStatus={transferStatus} />
          )}
          {(transferStatus === TRANSFER_STATUS.Initial ||
            transferStatus === TRANSFER_STATUS.Failed) &&
            !(currTab === 'stt' && recordFile?.transferType === TransferType.REALTIME) && (
              <>
                <EmptyContent type={EMPTY_TYPE.NO_TRANSCRIPTION} />
                <Button
                  className={styles.generateButton}
                  onClick={() => {
                    // 先选择模版
                    setShowTemplatePopup(true);
                  }}
                >
                  <Text className={styles.generateText}>{Strings.getLang('generate')}</Text>
                </Button>
              </>
            )}
        </View>
        <Button className={styles.deleteButton} onClick={handleDelete}>
          <Text className={styles.deleteButton}>{Strings.getLang('delete')}</Text>
        </Button>
        <View style={{ width: '100%', height: '140px' }} />
      </ScrollView>
      {/* 选择转录模版 */}
      <ChooseTransferTemplate
        show={showTemplatePopup}
        template={template}
        onBottomBtnClick={handleConfirmTemplate}
        onClickOverlay={() => {
          setShowTemplatePopup(false);
        }}
      />
      {/* 编辑撰写结果 */}
      {recordFile?.status === 2 && recordFile?.transfer === 2 && !isEditMode && (
        <View className={styles.editBtnBox}>
          <View className={styles.btnGroup}>
            {/* 编辑 */}
            <View className={`${styles.editBtn} ${styles.bRadiusL67}`} onClick={handleSttEdit}>
              <Image src={Res.editBlue} className={styles.btnIcon} />
            </View>
            {/* 重新转写 */}
            <View
              className={`${styles.editBtn} ${styles.minW96}`}
              onClick={() => {
                // 先选择模版
                setShowTemplatePopup(true);
              }}
            >
              <Image src={Res.rewriteBlue} className={styles.btnIcon} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default React.memo(Detail);
