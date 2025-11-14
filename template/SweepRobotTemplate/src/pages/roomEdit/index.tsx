import DecisionBar from '@/components/DecisionBar';
import RoomNamePopLayout from '@/components/RoomNamePopLayout';
import { PROTOCOL_VERSION } from '@/constant';
import { commandTransCode } from '@/constant/dpCodes';
import Strings from '@/i18n';
import store, { useSelector } from '@/redux';
import Res from '@/res';
import { emitter } from '@/utils';
import { useActions } from '@ray-js/panel-sdk';
import { CoverView, hideLoading, Image, router, showLoading, showToast, View } from '@ray-js/ray';
import {
  PARTITION_DIVISION_CMD_ROBOT_V1,
  PARTITION_MERGE_CMD_ROBOT_V1,
  SET_ROOM_NAME_CMD_ROBOT_V1,
  decodePartitionDivision0x1d,
  decodePartitionMerge0x1f,
  decodeSetRoomName0x25,
  encodePartitionDivision0x1c,
  encodePartitionMerge0x1e,
  encodeRoomOrder0x26,
  encodeSetRoomName0x24,
} from '@ray-js/robot-protocol';
import { Grid, GridItem, NavBar, Toast, ToastInstance } from '@ray-js/smart-ui';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import WebViewMap from '@/components/Map/WebViewMap';

import { selectMapStateByKey } from '@/redux/modules/mapStateSlice';
import { DeepPartialRuntimeConfig, MapApi, RoomData } from '@ray-js/robot-map';

import styles from './index.module.less';

type RoomEditStatus = 'normal' | 'split' | 'merge' | 'reName' | 'order';

const RoomEdit: FC = () => {
  const actions = useActions();
  const [mapLoadEnd, setMapLoadEnd] = useState(false);
  const [showMenuBar, setShowMenuBar] = useState(true);
  const [showDecisionBar, setShowDecisionBar] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [activeConfirm, setActiveConfirm] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>(null);

  const [mapApi, setMapApi] = useState<MapApi>();
  const [enableRoomSelection, setEnableRoomSelection] = useState(false);
  const [selectRoomIds, setSelectRoomIds] = useState<number[]>([]);
  const [dividingRoomId, setDividingRoomId] = useState<number>(-1);
  const [roomEditStatus, setRoomEditStatus] = useState<RoomEditStatus>('normal');
  const [roomSelectionMode, setRoomSelectionMode] = useState<'checkmark' | 'order'>('checkmark');
  const roomProperties = useSelector(selectMapStateByKey('roomProperties'));

  // 临时的清扫顺序状态
  const [tempCleaningOrder, setTempCleaningOrder] = useState<Record<number, number>>({});
  const [tempName, setTempName] = useState<Record<number, string>>({});

  const runtime = useMemo<DeepPartialRuntimeConfig>(() => {
    return {
      enableRoomSelection,
      selectRoomIds,
      showRoomOrder: true,
      dividingRoomId,
      roomSelectionMode,
      showPath: false,
    };
  }, [enableRoomSelection, selectRoomIds, dividingRoomId, roomSelectionMode]);

  // 合并原始数据和临时的状态
  const finalRoomProperties = useMemo(() => {
    return roomProperties.map(room => ({
      ...room,
      order: tempCleaningOrder[room.id] ?? room.order ?? 0,
      name: tempName[room.id] ?? room.name ?? '',
    }));
  }, [roomProperties, tempCleaningOrder, tempName]);

  useEffect(() => {
    if (roomEditStatus === 'order') {
      const roomsWithOrder = finalRoomProperties
        .filter(room => room.order > 0)
        .map(room => room.id);
      setSelectRoomIds(roomsWithOrder);
      setActiveConfirm(roomsWithOrder.length > 0);
    }
  }, [roomEditStatus, finalRoomProperties]);

  useEffect(() => {
    const handleRoomEditResponse = ({ cmd, command }) => {
      if (timerRef.current) {
        // 房间分割上报 刻意增加延迟，等待地图刷新
        if (cmd === PARTITION_DIVISION_CMD_ROBOT_V1) {
          const splitResponse = decodePartitionDivision0x1d({ command });
          if (splitResponse) {
            clearTimeout(timerRef.current);
            hideLoading();
            handleNormal();

            if (splitResponse.success) {
              ToastInstance.success({
                message: Strings.getLang('dsc_split_room_success'),
              });
            } else {
              ToastInstance.fail({
                message: Strings.getLang('dsc_split_room_fail'),
              });
            }
          }
        }

        if (cmd === PARTITION_MERGE_CMD_ROBOT_V1) {
          const mergeResponse = decodePartitionMerge0x1f({ command });
          if (mergeResponse) {
            clearTimeout(timerRef.current);
            hideLoading();
            handleNormal();

            if (mergeResponse.success) {
              ToastInstance.success({
                message: Strings.getLang('dsc_merge_room_success'),
              });
            } else {
              ToastInstance.fail({
                message: Strings.getLang('dsc_merge_room_fail'),
              });
            }
          }
        }

        if (cmd === SET_ROOM_NAME_CMD_ROBOT_V1) {
          const roomNameResponse = decodeSetRoomName0x25({
            command,
            version: PROTOCOL_VERSION,
            mapVersion: store.getState().mapState.version,
          });

          if (roomNameResponse) {
            clearTimeout(timerRef.current);
            hideLoading();
            handleNormal();

            ToastInstance.success({
              message: Strings.getLang('dsc_rename_room_success'),
            });
          }
        }
      }
    };

    const handleRoomOrderResponse = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        hideLoading();
        handleNormal();
        ToastInstance.success({
          message: Strings.getLang('edit_success'),
        });
      }
    };

    emitter.on('receiveRoomEditResponse', handleRoomEditResponse);
    emitter.on('receiveRoomOrderResponse', handleRoomOrderResponse);

    return () => {
      emitter.off('receiveRoomEditResponse', handleRoomEditResponse);
      emitter.off('receiveRoomOrderResponse', handleRoomOrderResponse);
    };
  }, []);

  /**
   * 进入区域分割状态
   */
  const handleSplit = () => {
    try {
      setActiveConfirm(false);
      setRoomEditStatus('split');
      setEnableRoomSelection(true);
      setSelectRoomIds([]);
      setRoomSelectionMode('checkmark');
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 进入区域合并状态
   */
  const handleMerge = async () => {
    setEnableRoomSelection(true);
    setSelectRoomIds([]);
    setRoomEditStatus('merge');
    setRoomSelectionMode('checkmark');
  };

  /**
   * 进入区域命名状态
   */
  const handleRename = () => {
    setRoomEditStatus('reName');
    setEnableRoomSelection(true);
    setSelectRoomIds([]);
    setRoomSelectionMode('checkmark');
  };

  /**
   * 进入区域排序状态
   */
  const handleOrder = async () => {
    try {
      setRoomEditStatus('order');
      setEnableRoomSelection(true);
      setSelectRoomIds([]);
      setRoomSelectionMode('order');
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 重命名弹窗确定
   * @param name 房间名称
   */
  const handleRenameConfirm = (name: string) => {
    setShowRenameModal(false);
    setTempName({ ...tempName, [selectRoomIds[0]]: name });
    setActiveConfirm(true);
  };

  /**
   * 重命名取消按钮
   */
  const handleRenameCancel = () => {
    setShowRenameModal(false);
    setSelectRoomIds([]);
  };

  /**
   * 回复地图到正常状态
   */
  const handleNormal = async () => {
    setEnableRoomSelection(false);
    setSelectRoomIds([]);
    setDividingRoomId(-1);
    setTempCleaningOrder({});
    setTempName({});
    setShowMenuBar(true);
    setShowDecisionBar(false);
    setActiveConfirm(false);
    setRoomEditStatus('normal');
  };

  /**
   * 改变当前的逻辑状态
   */
  const handleStateChange = (type: RoomEditStatus) => {
    const stateHandlers = {
      merge: handleMerge,
      split: handleSplit,
      reName: handleRename,
      order: handleOrder,
    };

    const handler = stateHandlers[type as RoomEditStatus];
    if (handler) {
      handler();
    }

    setShowMenuBar(false);
    setShowDecisionBar(true);
  };

  /**
   * 渲染底部的控制按钮
   */
  const renderMenuBar = () => {
    const { roomProperties, version } = store.getState().mapState;
    const menuList: { text: string; image: any; onClick: () => void }[] = [
      {
        text: Strings.getLang('dsc_room_merge'),
        image: Res.roomMerge,
        onClick: () => {
          handleStateChange('merge');
        },
      },
      {
        text: Strings.getLang('dsc_room_split'),
        image: Res.roomExcision,
        onClick: () => {
          if (roomProperties.length >= (version === 1 ? 32 : 28)) {
            showToast({
              title: Strings.getLang('dsc_room_num_limit'),
              icon: 'error',
            });
            return;
          }
          handleStateChange('split');
        },
      },
      {
        text: Strings.getLang('dsc_rename_room'),
        image: Res.roomName,
        onClick: () => {
          handleStateChange('reName');
        },
      },
      {
        text: Strings.getLang('dsc_order_room'),
        image: Res.mapEdit,
        onClick: () => {
          handleStateChange('order');
        },
      },
    ];
    return (
      <Grid border={false} columnNum={4}>
        {menuList.map(item => {
          return (
            <GridItem
              text={item.text}
              key={item.text}
              onClick={item.onClick}
              iconClass={styles.item}
              slot={{
                icon: <Image src={item.image} className={styles.icon} />,
              }}
            />
          );
        })}
      </Grid>
    );
  };

  /**
   * 确定按钮对应的逻辑
   */
  const handleConfirm = () => {
    const confirmHandlers = {
      merge: handleConfirmMerge,
      split: handleConfirmSplit,
      reName: handleConfirmRename,
      order: handleConfirmOrder,
    };

    const handler = confirmHandlers[roomEditStatus];
    if (handler) {
      handler();
    }
  };

  /**
   * 区域分割确定
   */
  const handleConfirmSplit = async () => {
    try {
      const points = await mapApi.getEffectiveDividerPoints();

      const command = encodePartitionDivision0x1c({
        roomId: dividingRoomId,
        points,
        version: PROTOCOL_VERSION,
      });
      actions[commandTransCode].set(command);
    } catch (error) {
      console.error(error);
    }
    // 无需恢复状态
  };

  /**
   * 重命名确定
   */
  const handleConfirmRename = async () => {
    try {
      const { version } = store.getState().mapState;
      const command = encodeSetRoomName0x24({
        mapVersion: version,
        version: PROTOCOL_VERSION,
        rooms: Object.entries(tempName).map(([roomId, name]) => ({
          roomId: Number(roomId),
          name,
        })),
      });

      actions[commandTransCode].set(command);
      showLoading({ title: '' });

      timerRef.current = setTimeout(() => {
        hideLoading();
        ToastInstance.fail({
          message: Strings.getLang('dsc_split_room_fail'),
        });
      }, 20 * 1000);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 合并区域确定
   */
  const handleConfirmMerge = async () => {
    try {
      const isAdjacent = await mapApi.areRoomsAdjacent(selectRoomIds);

      // 检查房间是否相邻
      if (!isAdjacent) {
        ToastInstance.fail(Strings.getLang('dsc_room_merge_board_error'));
        return;
      }

      showLoading({ title: '' });

      const command = encodePartitionMerge0x1e({
        roomIds: selectRoomIds,
        version: PROTOCOL_VERSION,
      });
      actions[commandTransCode].set(command);
      showLoading({ title: '' });

      timerRef.current = setTimeout(() => {
        hideLoading();
        ToastInstance.fail({
          message: Strings.getLang('dsc_merge_room_fail'),
        });
      }, 20 * 1000);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 区域排序确定
   */
  const handleConfirmOrder = async () => {
    const roomIds = finalRoomProperties
      .sort((a: RoomData, b: RoomData) => a.order - b.order)
      .map(room => room.id);
    const command = encodeRoomOrder0x26({
      version: PROTOCOL_VERSION,
      roomIds,
    });
    actions[commandTransCode].set(command);
    showLoading({ title: '' });

    timerRef.current = setTimeout(() => {
      hideLoading();
      ToastInstance.fail({
        message: Strings.getLang('edit_fail'),
      });
    }, 20 * 1000);
  };

  const tags = [
    { text: Strings.getLang('dsc_room_tags_kitchen') },
    { text: Strings.getLang('dsc_room_tags_bathroom') },
    { text: Strings.getLang('dsc_room_tags_living_room') },
    { text: Strings.getLang('dsc_room_tags_bedroom') },
    { text: Strings.getLang('dsc_room_tags_balcony') },
  ];

  const handleMapReady = (mapApi: MapApi) => {
    setMapApi(mapApi);
  };
  const handleMapFirstDrawed = () => {
    setMapLoadEnd(true);
  };

  const handleClickRoom = (room: RoomData) => {
    if (roomEditStatus === 'normal') return;

    if (roomEditStatus === 'merge') {
      if (selectRoomIds.includes(room.id)) {
        const newSelectRoomIds = selectRoomIds.filter(id => id !== room.id);
        setSelectRoomIds(newSelectRoomIds);
        setActiveConfirm(newSelectRoomIds.length === 2);
      } else {
        if (selectRoomIds.length >= 2) {
          // 只能合并两个房间
          ToastInstance(Strings.getLang('dsc_room_merge_count_error'));
          return;
        }
        const newSelectRoomIds = [...selectRoomIds, room.id];
        setSelectRoomIds(newSelectRoomIds);
        setActiveConfirm(newSelectRoomIds.length === 2);
      }
    }

    if (roomEditStatus === 'split') {
      setSelectRoomIds([room.id]);
      setDividingRoomId(room.id);
      setActiveConfirm(true);
    }

    if (roomEditStatus === 'reName') {
      setSelectRoomIds([room.id]);
      setShowRenameModal(true);
    }

    if (roomEditStatus === 'order') {
      const currentOrder = finalRoomProperties.find(r => r.id === room.id)?.order || 0;

      setTempCleaningOrder(prev => {
        if (currentOrder > 0) {
          // 取消顺序，其他房间顺序递减
          const updates = { ...prev, [room.id]: 0 };
          finalRoomProperties.forEach(r => {
            if (r.order > currentOrder) {
              const originalOrder = roomProperties.find(orig => orig.id === r.id)?.order || 0;
              updates[r.id] = (prev[r.id] ?? originalOrder) - 1;
            }
          });
          return updates;
        }

        // 设置新顺序
        const maxOrder = Math.max(0, ...finalRoomProperties.map(r => r.order));
        return { ...prev, [room.id]: maxOrder + 1 };
      });
    }
  };

  const handleUpdateDivider = async () => {
    const effectiveDividerPoints = await mapApi.getEffectiveDividerPoints();

    if (!effectiveDividerPoints) {
      setActiveConfirm(false);
    } else {
      setActiveConfirm(true);
    }
  };

  return (
    <View className={styles.container}>
      <CoverView>
        <NavBar title={Strings.getLang('dsc_room_edit')} leftArrow onClickLeft={router.back} />
      </CoverView>
      <WebViewMap
        roomProperties={finalRoomProperties}
        runtime={runtime}
        onMapReady={handleMapReady}
        onMapFirstDrawed={handleMapFirstDrawed}
        onClickRoom={handleClickRoom}
        onClickRoomProperties={handleClickRoom}
        onUpdateDivider={handleUpdateDivider}
      />

      <CoverView className={styles.bottomMenuBar}>
        {showMenuBar && mapLoadEnd && renderMenuBar()}
        {!showMenuBar && showDecisionBar && mapLoadEnd && (
          <DecisionBar
            onCancel={handleNormal}
            activeConfirm={activeConfirm}
            onConfirm={handleConfirm}
          />
        )}
      </CoverView>

      <RoomNamePopLayout
        show={showRenameModal}
        tags={tags}
        onCancel={handleRenameCancel}
        onConfirm={handleRenameConfirm}
        defaultValue=""
      />

      <Toast id="smart-toast" />
    </View>
  );
};

export default RoomEdit;
