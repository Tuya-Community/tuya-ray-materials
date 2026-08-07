import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Button } from '@ray-js/components';
import { useSelector, useDispatch } from 'react-redux';
import Res from '@/res';
import Strings from '@/i18n';
import ThemedImage from '@/components/ThemedImage';
import { devInfoChange, selectDevInfo } from '@/redux/modules/devInfoSlice';
import { getDeviceList } from '@/redux/modules/deviceListSlice';
import { RecordStatus, selectAudioFileByKey } from '@/redux/modules/audioFileSlice';
import { formatDevSchema, checkIsCall } from '@/utils';
import CustomDialog from '@/components/CustomDialog';
import { DEVTYPES } from '@/constant/enums';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import AiGeneratedDisclaimer from '@/components/AiGeneratedDisclaimer';
// @ts-ignore
import styles from './index.module.less';

const Index = ({
  // task,
  children = null,
  handleControl,
  handleStopRecord,
  recordType = undefined,
  isPauseSelf,
  setIsPauseSelf,
  showAiDisclaimer = false,
}) => {
  const dispatch = useDispatch();
  const devInfo = useSelector(selectDevInfo);
  const { safeBottomHeight } = useSelector(selectSystemInfo);
  const [showDevList, setShowDevList] = useState(false);
  const deviceList = useSelector(getDeviceList);
  const task = useSelector(selectAudioFileByKey('task'));

  const [realShowDevList, setRealShowDevList] = useState(false);

  useEffect(() => {
    let timer: any;
    if (showDevList) {
      timer = setTimeout(() => setRealShowDevList(true), 16); // 延迟 50ms
    } else {
      setRealShowDevList(false);
    }
    return () => timer && clearTimeout(timer);
  }, [showDevList]);

  useEffect(() => {
    // 电话录音，只能选择pro类型设备
    if (checkIsCall({ audioSource: task?.audioSource, recordType })) {
      const isProSelected = devInfo?.customDevType === DEVTYPES.pro;
      if (!isProSelected) {
        let proDev = deviceList.find(item => item.isOnline && item?.customDevType === DEVTYPES.pro);

        if (!proDev) {
          proDev = deviceList.find(item => item?.customDevType === DEVTYPES.pro);
        }

        proDev && dispatch(devInfoChange(formatDevSchema(proDev)));
      }
      return;
    }
    // if (!devInfo?.devId || (!devInfo?.isOnline && devInfo?.customDevType !== 'pro_version')) {
    if (!devInfo?.devId) {
      // 只要有选择过，就不做二次自动处理
      const defaultDev = deviceList.find(item => item.isOnline);
      defaultDev && dispatch(devInfoChange(formatDevSchema(defaultDev)));
    }
  }, [devInfo, recordType, task?.audioSource, deviceList]);

  const visibleDevs = useMemo(() => {
    if (checkIsCall({ audioSource: task?.audioSource, recordType })) {
      // 电话录音，只显示pro类型设备
      return deviceList.filter(item => item?.customDevType === DEVTYPES.pro);
    }
    return deviceList;
  }, [deviceList, recordType, task?.audioSource]);

  // 选择设备
  const handleChooseDev = item => {
    if (!handleIsDisabled(item)) {
      setShowDevList(false);
      dispatch(devInfoChange(formatDevSchema(item)));
    }
  };

  const handleIsDisabled = item => {
    const isCallMode = checkIsCall({ audioSource: task?.audioSource, recordType });
    if (task?.state === RecordStatus.PAUSE || task?.state === RecordStatus.RECORDING) {
      // 电话录音保持原限制：仅允许 pro 设备
      if (isCallMode) {
        return item?.customDevType !== DEVTYPES.pro || !item.isOnline;
      }
      // 非电话录音：录音中可切换到任意在线设备
      return !item.isOnline;
    }
    return !item.isOnline;
  };

  useEffect(() => {
    setIsPauseSelf(false);
  }, [task?.state]);

  return (
    <View
      id="recordCtrl"
      className={styles.bottomBox}
      style={{ paddingBottom: safeBottomHeight ? `${safeBottomHeight}px` : '24px' }}
    >
      {children}
      <View className={styles.controlArea}>
        <CustomDialog
          visible={realShowDevList}
          onClose={() => setShowDevList(false)}
          contentSty={styles.content}
          clickDom={
            <View
              className={styles.devEntry}
              onClick={() => {
                setShowDevList(!showDevList);
              }}
            >
              <View className={styles.devEntryImgs}>
                <ThemedImage
                  className={styles.leftIcon}
                  src={devInfo?.icon}
                  imageName={devInfo?.iconName}
                />
                <ThemedImage
                  imageName="imgTransIcon"
                  className={styles.rightIcon}
                  src={Res.imgTransIcon}
                />
              </View>
              {/* <View>
                <Text className={styles.devName}>{Strings.getLang('receiving')}</Text>
              </View> */}
            </View>
          }
        >
          <View className={styles.scrollView}>
            <View className={styles.devBox}>
              {visibleDevs.map(item => {
                return (
                  <View
                    key={item.devId}
                    className={`${styles.devItem} ${handleIsDisabled(item) ? styles.disabled : ''}`}
                    onClick={() => {
                      // e.stopPropagation();
                      handleChooseDev(item);
                    }}
                  >
                    <View className={styles.devTextBox}>
                      {item?.icon && (
                        <ThemedImage
                          className={styles.devIcon}
                          src={item?.icon}
                          imageName={item?.iconName}
                        />
                      )}
                      <Text>{item.name}</Text>
                    </View>
                    {item?.devId === devInfo?.devId && (
                      <ThemedImage
                        imageName="devCheckIcon"
                        src={Res.devCheckIcon}
                        className={styles.checkIcon}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </CustomDialog>

        <View className={styles.controlBtnBox}>
          {/* <Button
            className={`${controlBtnLoading ? styles.controlBtn : `${styles.controlBtn} ${styles.displayNone}`
              }`}
            onClick={handleControl}
          >
            <Loading />
          </Button> */}
          <Button
            id="sim-pause-btn"
            className={`${
              task?.state === RecordStatus.RECORDING || isPauseSelf
                ? styles.controlBtn
                : `${styles.controlBtn} ${styles.displayNone}`
            }`}
            onClick={handleControl}
          >
            <View className={styles.recordingText}>{Strings.getLang('pause')}</View>
            {/* <Image className={styles.icon} src={Res.imgStopBlack} /> */}
          </Button>
          <Button
            id="sim-resume-btn"
            className={`${
              task?.state === RecordStatus.PAUSE
                ? styles.controlPause
                : `${styles.controlPause} ${styles.displayNone}`
            }`}
            onClick={handleControl}
          >
            <View className={styles.pauseText}>{Strings.getLang('resume')}</View>
          </Button>
          <Button
            id="sim-start-btn"
            className={`${
              (task?.state === RecordStatus.UNKNOWN ||
                task?.state === RecordStatus.FINISH ||
                !task) &&
              !isPauseSelf
                ? styles.controlStart
                : `${styles.controlStart} ${styles.displayNone}`
            }`}
            onClick={handleControl}
          >
            <View className={styles.startText}>{Strings.getLang('start')}</View>
          </Button>
        </View>

        <View
          id="sim-done-btn"
          className={`${styles.saveBox} ${
            task?.state !== RecordStatus.PAUSE && task?.state !== RecordStatus.RECORDING
              ? styles.disabled
              : ''
          }`}
          onTouchEnd={() => {
            handleStopRecord();
          }}
        >
          <Text className={styles.done}>{Strings.getLang('record_done')}</Text>
          {/* <Image className={styles.saveIcon} src={Res.saveIcon} /> */}
          {/* <View className={styles.save}>{Strings.getLang('save')}</View> */}
        </View>
      </View>
      {showAiDisclaimer && <AiGeneratedDisclaimer className={styles.aiDisclaimer} />}
    </View>
  );
};

export default Index;
