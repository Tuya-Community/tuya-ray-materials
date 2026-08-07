import { AudioSource, DEVTYPES, TtsOutput } from '@/constant/enums';
import { RecordType } from '@/redux/modules/audioFileSlice';
import store from '@/redux';
import { setStorageSync, getStorageSync } from '@ray-js/ray';

const STORAGE_KEY_RECORDING_DEVICE_ID = 'recordingDeviceId';

/**
 * @brief Persist recording device id
 * @param[in] deviceId device id
 * @return none
 */
export const setStorageRecordingDeviceId = (deviceId: string) => {
  setStorageSync({ key: STORAGE_KEY_RECORDING_DEVICE_ID, data: deviceId });
};

/**
 * @brief Read recording device id from storage
 * @return device id or null
 */
export const getStorageRecordingDeviceId = (): string | null => {
  // @ts-ignore
  return getStorageSync({ key: STORAGE_KEY_RECORDING_DEVICE_ID }) || null;
};

/**
 * @brief Clear recording device id from storage
 * @return none
 */
export const clearStorageRecordingDeviceId = () => {
  setStorageSync({ key: STORAGE_KEY_RECORDING_DEVICE_ID, data: '' });
};

/**
 * @brief Parse realtime transfer result into DualChannelASRList items
 * @param[in] realTimeResult raw realtime result
 * @return parsed list
 */
export const parseRealTimerResult = (realTimeResult: any) => {
  try {
    const resList = [];
    if (realTimeResult?.list?.length) {
      realTimeResult?.list?.forEach(item => {
        const translate = item?.translate?.replace(/\n/g, '');
        if (item.status === 1 && (translate || item?.asr)) {
          resList.push({
            id: item.requestId,
            text: `${item?.asr || ''}\n${translate || ''}`,
            channel: item.channel,
          });
        }
      });
    }
    return resList;
  } catch (error) {
    return [];
  }
};

/**
 * @brief Resolve audio source list by device type and record type
 * @param[in] devType custom device type
 * @param[in] recordType record type
 * @return audio source list
 */
export const getAudioSourceList = (devType: DEVTYPES, recordType?: RecordType) => {
  const isEntryOrOs = (type: DEVTYPES) => type === DEVTYPES.entry || type === DEVTYPES.os;

  if (recordType === RecordType.Call) {
    return [AudioSource.proCall];
  }

  if (recordType === RecordType.PhoneEar) {
    if (devType === DEVTYPES.pro) {
      return [AudioSource.phone, AudioSource.proLive];
    }
    if (isEntryOrOs(devType)) {
      return [AudioSource.entry];
    }
    return [AudioSource.phone];
  }

  if (recordType === RecordType.FaceToFace || recordType === RecordType.FaceToFacePro) {
    if (devType === DEVTYPES.pro) {
      return [AudioSource.proFaceToFace];
    }
    if (isEntryOrOs(devType)) {
      return [AudioSource.entry];
    }
    return [AudioSource.phone];
  }

  switch (devType) {
    case DEVTYPES.phone:
      return [AudioSource.phone];
    case DEVTYPES.entry:
    case DEVTYPES.os:
      return [AudioSource.entry];
    case DEVTYPES.card:
      return [AudioSource.cardSigle];
    case DEVTYPES.pro:
      return [AudioSource.proLive];
    default:
      return [];
  }
};

/**
 * @brief Resolve TTS output channel for an audio source
 * @param[in] audioSource audio source
 * @param[in] recordType record type
 * @param[in] customDevType custom device type
 * @return TTS output channel
 */
export const getTtsOutputBySource = (
  audioSource: number,
  recordType?: RecordType,
  customDevType?: DEVTYPES
) => {
  const isPro = customDevType === DEVTYPES.pro;
  const isPhoneEarMode = recordType === RecordType.PhoneEar;
  switch (audioSource) {
    case AudioSource.phone:
      return isPhoneEarMode ? (isPro ? TtsOutput.Device : TtsOutput.Bt) : TtsOutput.Mic;
    case AudioSource.entry:
      return isPhoneEarMode ? TtsOutput.Mic : TtsOutput.Bt;
    case AudioSource.proLive:
      return isPhoneEarMode ? TtsOutput.Mic : TtsOutput.Device;
    default:
      return TtsOutput.Device;
  }
};

/**
 * @brief Build TTS config list for start recording
 * @param[in] audioSourceList audio sources
 * @param[in] recordType record type
 * @return TTS config list
 */
export const getTtsConfigList = (audioSourceList: AudioSource[], recordType?: RecordType) => {
  const selectedDevice = store.getState().devInfo;
  const { customDevType, isOpusCelt, devId } = selectedDevice as any;
  const uiIsOpusCelt = store.getState()?.uiState?.isOpusCelt;
  const opusCelt = isOpusCelt ?? uiIsOpusCelt;

  return audioSourceList.map(audioSource => {
    return {
      // 设备ID：输出源为设备时需下发；BT/MIC 传空
      devId: customDevType === DEVTYPES.entry || customDevType === DEVTYPES.phone ? '' : devId || '',
      ttsOutput: getTtsOutputBySource(audioSource, recordType, customDevType),
      ttsEncode: opusCelt ? 2 : customDevType === DEVTYPES.pro ? 1 : 0,
      ttsOutputChannel: 0,
    };
  });
};
