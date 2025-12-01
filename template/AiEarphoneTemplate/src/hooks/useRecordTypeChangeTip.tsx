import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectAudioFileByKey } from '@/redux/modules/audioFileSlice';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';
import { selectDpStateByCode } from '@/redux/modules/dpStateSlice';
import { aiModeCode } from '@/config/dpCodes';
import { checkDpExist } from '@/utils';
import { showToast } from '@ray-js/ray';
import Strings from '@/i18n';

/**
 * 录音模式切换提示
 * 针对卡片型设备，当有录音任务进行中，设备端上报录音模式切换(会议/电话)
 * 此时设备端会停止当前任务并按新的录音模式开启一条新任务，小程序端弹个提示
 */
export default function useRecordTypeChangeTip() {
  const productStyle = useSelector(selectUiStateByKey('productStyle'));
  const aiModeDp = useSelector(selectDpStateByCode(aiModeCode as never));
  const task = useSelector(selectAudioFileByKey('task'));

  const prevAiModeDp = useRef(aiModeDp);

  useEffect(() => {
    if (!checkDpExist(aiModeCode)) return;
    if (productStyle === 'card' && task) {
      if (prevAiModeDp.current !== aiModeDp) {
        showToast({ icon: 'none', title: Strings.getLang('card_device_record_type_change_tip') });
      }
    }
    prevAiModeDp.current = aiModeDp;
  }, [aiModeDp, productStyle, task]);
}
