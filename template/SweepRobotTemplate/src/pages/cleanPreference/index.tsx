import RoomPreferencePopLayout from '@/components/RoomPreferencePopLayout';
import { commandTransCode } from '@/constant/dpCodes';
import Strings from '@/i18n';
import { emitter } from '@/utils';
import { useActions } from '@ray-js/panel-sdk';
import { CoverView, router, View } from '@ray-js/ray';
import { encodeSetRoomProperty0x22 } from '@ray-js/robot-protocol';
import { NavBar, Toast, ToastInstance } from '@ray-js/smart-ui';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { PROTOCOL_VERSION } from '@/constant';
import WebViewMap from '@/components/Map/WebViewMap';
import { selectMapStateByKey } from '@/redux/modules/mapStateSlice';
import { useSelector } from 'react-redux';
import { RoomData } from '@ray-js/robot-map';

import styles from './index.module.less';

const CleanPreference: FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const dpActions = useActions();

  const [selectRoomId, setSelectRoomId] = useState<number | null>(null);

  const roomProperties = useSelector(selectMapStateByKey('roomProperties'));

  const currentRoomProperty = useMemo(() => {
    return roomProperties.find(room => room.id === selectRoomId);
  }, [roomProperties, selectRoomId]);

  const runtime = useMemo(() => {
    return {
      enableRoomSelection: true,
      selectRoomIds: [selectRoomId],
      showRoomProperty: true,
      showPath: false,
    };
  }, [selectRoomId]);

  useEffect(() => {
    emitter.on('receiveSetRoomPropertyResponse', handleRoomPropertyResponse);

    return () => {
      emitter.off('receiveSetRoomPropertyResponse', handleRoomPropertyResponse);
    };
  }, []);

  const handleRoomPropertyResponse = () => {
    ToastInstance.success({
      message: Strings.getLang('edit_success'),
    });
  };

  /**
   * 重命名弹窗确定
   * @param tag
   */
  const handleConfirm = (fanValue: string, waterValue: string, cleanCount: string) => {
    const command = encodeSetRoomProperty0x22({
      rooms: [
        {
          roomId: selectRoomId,
          cleanTimes: Number(cleanCount),
          suction: Number(fanValue),
          cistern: Number(waterValue),
          yMop: 0,
        },
      ],
      version: PROTOCOL_VERSION,
    });

    dpActions[commandTransCode].set(command);

    setModalVisible(false);
    setSelectRoomId(null);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setSelectRoomId(null);
  };

  const handleClickRoom = (room: RoomData) => {
    setModalVisible(true);

    setTimeout(() => {
      setSelectRoomId(room.id);
    }, 0);
  };

  return (
    <View className={styles.container}>
      <CoverView>
        <NavBar title={Strings.getLang('dsc_preference')} leftArrow onClickLeft={router.back} />
      </CoverView>
      <WebViewMap
        runtime={runtime}
        onClickRoom={handleClickRoom}
        onClickRoomProperties={handleClickRoom}
      />

      <RoomPreferencePopLayout
        show={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        fan={String(currentRoomProperty?.suction ?? 0)}
        water={String(currentRoomProperty?.cistern ?? 0)}
        sweepCount={String(currentRoomProperty?.cleanTimes ?? 1)}
      />

      <Toast id="smart-toast" />
    </View>
  );
};

export default CleanPreference;
