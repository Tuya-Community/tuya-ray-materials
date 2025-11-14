import { PROTOCOL_VERSION, THEME_COLOR } from '@/constant';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { useActions } from '@ray-js/panel-sdk';
import { CoverView, Text, View, hideLoading, router, showLoading } from '@ray-js/ray';
import { Dialog, ToastInstance, NavBar, Toast, Icon } from '@ray-js/smart-ui';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import WebViewMap from '@/components/Map/WebViewMap';
import { DeepPartialRuntimeConfig, RoomData } from '@ray-js/robot-map';
import { selectMapStateByKey } from '@/redux/modules/mapStateSlice';
import { encodeSetRoomFloorMaterial0x52 } from '@ray-js/robot-protocol';
import { commandTransCode } from '@/constant/dpCodes';
import { emitter } from '@/utils';
import {
  iconFloorMaterial0,
  iconFloorMaterial1,
  iconFloorMaterial2,
  iconFloorMaterial3,
} from '@/res/iconsvg';
import clsx from 'clsx';

import styles from './index.module.less';

const MapEdit: FC = () => {
  const dpActions = useActions();
  const [tempFloorMaterial, setTempFloorMaterial] = useState<Record<number, number>>({});
  const [selectRoomId, setSelectRoomId] = useState<number | null>(null);

  const roomProperties = useSelector(selectMapStateByKey('roomProperties'));

  const finalRoomProperties = useMemo(() => {
    return roomProperties.map(room => ({
      ...room,
      floorType: tempFloorMaterial[room.id] ?? room.floorType ?? 0,
    }));
  }, [roomProperties, tempFloorMaterial]);

  const activeFloorType = useMemo(() => {
    return finalRoomProperties.find(room => room.id === selectRoomId)?.floorType ?? 0;
  }, [finalRoomProperties, selectRoomId]);

  const runtime = useMemo<DeepPartialRuntimeConfig>(() => {
    return {
      enableRoomSelection: true,
      selectRoomIds: [selectRoomId],
      showPath: false,
    };
  }, [selectRoomId]);

  const timerRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const handleRoomFloorMaterialResponse = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        hideLoading();
        setSelectRoomId(null);
        ToastInstance.success({
          message: Strings.getLang('edit_success'),
        });
      }
    };

    emitter.on('receiveRoomFloorMaterialResponse', handleRoomFloorMaterialResponse);

    return () => {
      emitter.off('receiveRoomFloorMaterialResponse', handleRoomFloorMaterialResponse);
    };
  }, []);

  const handleChooseFloorMaterial = (id: number) => {
    setTempFloorMaterial({
      ...tempFloorMaterial,
      [selectRoomId]: id,
    });
  };

  const handleSave = () => {
    showLoading({ title: '' });

    const command = encodeSetRoomFloorMaterial0x52({
      version: PROTOCOL_VERSION,
      rooms: finalRoomProperties.map(room => ({
        roomId: room.id,
        material: room.floorType,
      })),
    });

    dpActions[commandTransCode].set(command);
  };

  const floorList = useMemo(() => {
    return [
      {
        id: 0,
        text: Strings.getLang('dsc_floor_empty'),
        icon: iconFloorMaterial0,
      },
      {
        id: 1,
        text: Strings.getLang('dsc_floor_tiles'),
        icon: iconFloorMaterial1,
      },
      {
        id: 2,
        text: Strings.getLang('dsc_floor_horizontal'),
        icon: iconFloorMaterial2,
      },
      {
        id: 3,
        text: Strings.getLang('dsc_floor_vertical'),
        icon: iconFloorMaterial3,
      },
    ];
  }, []);

  const disabled = useMemo(() => {
    return Object.keys(tempFloorMaterial).length === 0;
  }, [tempFloorMaterial]);

  const handleClickRoom = (room: RoomData) => {
    setSelectRoomId(selectRoomId === room.id ? null : room.id);
  };

  return (
    <>
      <View className={styles.container}>
        <CoverView>
          <NavBar
            title={Strings.getLang('dsc_room_floor_material')}
            leftArrow
            onClickLeft={router.back}
            slot={{
              right: (
                <View
                  style={{ color: THEME_COLOR, fontWeight: 600, opacity: disabled ? 0.5 : 1 }}
                  onClick={() => {
                    if (disabled) return;
                    handleSave();
                  }}
                >
                  {Strings.getLang('dsc_save')}
                </View>
              ),
            }}
          />
        </CoverView>
        <WebViewMap
          roomProperties={finalRoomProperties}
          runtime={runtime}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
          }}
          onClickRoom={handleClickRoom}
          onClickRoomProperties={handleClickRoom}
        />

        {selectRoomId !== null && (
          <CoverView className={styles.bottomWrapper}>
            <View className={styles.bottom}>
              {floorList.map(item => (
                <View
                  className={clsx(styles.floorItem, activeFloorType === item.id && styles.active)}
                  onClick={() => handleChooseFloorMaterial(item.id)}
                >
                  <View className={styles.floorItemIcon}>
                    <Icon
                      name={item.icon}
                      size="64rpx"
                      color={activeFloorType === item.id ? '#fff' : '#000'}
                    />
                  </View>
                  <Text className={styles.floorItemText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </CoverView>
        )}
      </View>
      <Toast id="smart-toast" />
      <Dialog id="smart-dialog" />
    </>
  );
};

export default MapEdit;
