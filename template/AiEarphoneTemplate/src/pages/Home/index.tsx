import React, { FC } from 'react';
import { View, exitMiniProgram, usePageEvent } from '@ray-js/ray';
import { TopBar } from '@/components';
import { useSelector, useDispatch } from 'react-redux';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';
import { updateRecordTransferResultList, updateAudioFile } from '@/redux/modules/audioFileSlice';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import useUpdateTransferStatus from '@/hooks/useUpdateTransferStatus';
import useRecordTypeChangeTip from '@/hooks/useRecordTypeChangeTip';
import { tttRecordTask } from '@/api/ttt';
import ControlBar from './component/ControlBar';
import History from './component/History';
import Mode from './component/Mode';
import Setting from './component/Setting';
import HealthPrivacyPopup from './component/HealthPrivacyPopup';

// @ts-ignore
import styles from './index.module.less';

const Home: FC = () => {
  const dispatch = useDispatch();
  const currTab = useSelector(selectUiStateByKey('currTab'));
  const isEditMode = useSelector(selectUiStateByKey('isEditMode'));
  const { devId } = useSelector(selectDevInfo);

  useUpdateTransferStatus();
  useRecordTypeChangeTip();

  usePageEvent('onShow', async () => {
    const d: any = await tttRecordTask(devId);
    dispatch(updateRecordTransferResultList());
    console.warn('mode onShow task info:', d);
    dispatch(updateAudioFile({ task: d?.task || null }));
  });

  return (
    <View className={styles.container}>
      <TopBar onBack={exitMiniProgram} />
      <View className={styles.main}>
        {currTab === 'history' && <History />}
        {currTab === 'mode' && <Mode />}
        {currTab === 'setting' && <Setting />}
      </View>
      {!isEditMode && <ControlBar />}
      <HealthPrivacyPopup />
    </View>
  );
};

export default React.memo(Home);
