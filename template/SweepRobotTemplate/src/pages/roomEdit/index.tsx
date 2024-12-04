import DecisionBar from '@/components/DecisionBar';
import MapView from '@/components/MapView';
import RoomNamePopLayout from '@/components/RoomNamePopLayout';
import { PROTOCOL_VERSION } from '@/constant';
import { commandTransCode } from '@/constant/dpCodes';
import Strings from '@/i18n';
import store from '@/redux';
import Res from '@/res';
import { emitter } from '@/utils';
import {
  changeAllMapAreaColor,
  getLaserMapMergeInfo,
  getLaserMapSplitPoint,
  getMapAreaInfo,
  getMapPointsInfo,
  updateMapAreaColor,
} from '@/utils/openApi';
import {
  setMapStatusMerge,
  setMapStatusNormal,
  setMapStatusOrder,
  setMapStatusRename,
  setMapStatusSplit,
} from '@/utils/openApi/mapStatus';
import { useActions } from '@ray-js/panel-sdk';
import { CoverView, hideLoading, Image, showLoading, showToast, View } from '@ray-js/ray';
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
  isAdjacent,
  parseRoomId,
  stringToByte,
} from '@ray-js/robot-protocol';
import { EMapSplitStateEnum } from '@ray-js/robot-sdk-types';
import { Grid, GridItem, Toast, ToastInstance } from '@ray-js/smart-ui';
import React, { FC, useEffect, useRef, useState } from 'react';

import styles from './index.module.less';

enum EditTypes {
  split = 'split',
  order = 'order',
  merge = 'merge',
  reName = 'reName',
}

const RoomEdit: FC = () => {
  const actions = useActions();
  const [mapLoadEnd, setMapLoadEnd] = useState(false);
  const [showMenuBar, setShowMenuBar] = useState(true);
  const [showDecisionBar, setShowDecisionBar] = useState(false);
  const [previewCustom, setPreviewCustom] = useState({});
  const [tip, setTip] = useState('');
  const [roomIdHexState, setRoomIdHexState] = useState('');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [activeConfirm, setActiveConfirm] = useState(false);
  const mapId = useRef('');
  const stateType = useRef('normal');
  const timerRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    ty.setNavigationBarTitle({
      title: Strings.getLang('dsc_room_edit'),
    });
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
                message: Strings.getLang('edit_success'),
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
   * 地图加载完成回调
   * @param data
   */
  const onMapId = (data: any) => {
    mapId.current = data.mapId;
  };

  const onClickSplitArea = async (data: any) => {
    if (stateType.current === EditTypes.split || stateType.current === EditTypes.order)
      setActiveConfirm(true);
    if (stateType.current === EditTypes.merge) {
      const res: any = await getLaserMapSplitPoint(mapId.current);
      // console.info('getLaserMapSplitPoint', res);
      const { data: rooms } = res;
      const roomIds = rooms
        .filter(({ pixel }: any) => pixel !== undefined)
        .map(({ pixel }: any) => {
          return pixel;
        });

      changeAllMapAreaColor(mapId.current, true).then(() => {
        updateMapAreaColor(mapId.current, roomIds, true, false);
      });

      if (roomIds.length > 1) {
        const dataList = (await getMapAreaInfo(mapId.current, roomIds, true)) as any[];
        console.log('dataList ==>', dataList);
        if (!isAdjacent(dataList[0].points, dataList[1].points, 3)) {
          setTimeout(() => {
            showToast({
              title: Strings.getLang('dsc_room_merge_board_error'),
              icon: 'error',
            });
            setActiveConfirm(false);
          }, 500);
        } else {
          setActiveConfirm(true);
        }
      }
    }

    if (stateType.current === EditTypes.reName) {
      const { version } = store.getState().mapState;
      const maxUnknownId = version === 1 ? 31 : 26;
      if (!data || !data.length || !Array.isArray(data)) return;
      const [firstRoom] = data;
      const { pixel } = firstRoom;
      const roomId = parseRoomId(pixel, version);
      if (roomId > maxUnknownId) {
        showToast({
          title: Strings.getLang('dsc_home_selectRoom_unknown'),
          icon: 'error',
        });
        return;
      }
      reName(pixel);
    }
  };

  /**
   * 点击创建了分割线之后的回调
   * @param param
   */
  const onSplitLine = ({ type }) => {
    if (type === 'add') {
      setActiveConfirm(true);
    } else if (type === 'remove') {
      setActiveConfirm(false);
    }
  };
  /**
   * 地图渲染完成回调
   * @param success
   */
  const onMapLoadEnd = (success: boolean) => {
    setMapLoadEnd(success);
  };

  const reName = (pixel: string) => {
    setRoomIdHexState(pixel);
    setShowRenameModal(true);
  };
  /**
   * 进入区域分割状态
   */
  const handleSplit = () => {
    try {
      setMapStatusSplit(mapId.current);
      setActiveConfirm(false);
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 进入区域合并状态
   */
  const handleMerge = async () => {
    setMapStatusMerge(mapId.current);
    await changeAllMapAreaColor(mapId.current, true);
    setActiveConfirm(false);
  };

  /**
   * 进入区域命名状态
   */
  const handleRename = () => {
    setMapStatusRename(mapId.current);
  };

  /**
   * 重命名弹窗确定
   * @param name 房间名称
   */
  const handleRenameConfirm = (name: string) => {
    const room = previewCustom[roomIdHexState] || {};
    const curRoom = {
      [roomIdHexState]: {
        ...room,
        name,
      },
    };
    const newPreviewCustom = { ...previewCustom, ...curRoom };
    setShowRenameModal(false);

    setPreviewCustom(newPreviewCustom);
    setActiveConfirm(true);
  };

  /**
   * 重命名取消按钮
   */
  const handleRenameCancel = () => {
    // 取消，弹框关闭，停留在rename
    setShowRenameModal(false);

    if (Object.keys(previewCustom).length === 0) setActiveConfirm(false);
  };

  /**
   * 回复地图到正常状态
   */
  const handleNormal = async () => {
    setMapStatusNormal(mapId.current);
    stateType.current = 'normal';
    setShowMenuBar(true);
    setShowDecisionBar(false);
  };

  const handleOrder = async () => {
    try {
      setMapStatusOrder(mapId.current);
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 改变当前的逻辑状态
   */
  const handleStateChange = (type: string) => {
    switch (type) {
      case EditTypes.merge:
        handleMerge();
        break;
      case EditTypes.split:
        handleSplit();
        break;
      case EditTypes.reName:
        handleRename();
        break;
      case EditTypes.order:
        handleOrder();
        break;
      default:
        break;
    }
    stateType.current = type;
    _onTip();
    setShowMenuBar(false);
    setShowDecisionBar(true);
  };

  /**
   * 渲染底部的控制按钮
   */
  const renderMenuBar = () => {
    const { roomNum, version } = store.getState().mapState;
    const menuList: { text: string; image: any; onClick: () => void }[] = [
      {
        text: Strings.getLang('dsc_room_merge'),
        image: Res.roomMerge,
        onClick: () => {
          handleStateChange(EditTypes.merge);
        },
      },
      {
        text: Strings.getLang('dsc_room_split'),
        image: Res.roomExcision,
        onClick: () => {
          if (roomNum >= (version === 1 ? 32 : 28)) {
            showToast({
              title: Strings.getLang('dsc_room_num_limit'),
              icon: 'error',
            });
            return;
          }
          handleStateChange(EditTypes.split);
        },
      },
      {
        text: Strings.getLang('dsc_rename_room'),
        image: Res.roomName,
        onClick: () => {
          handleStateChange(EditTypes.reName);
        },
      },
      {
        text: Strings.getLang('dsc_order_room'),
        image: Res.mapEdit,
        onClick: () => {
          handleStateChange(EditTypes.order);
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
              iconClass={styles.cleanModeContent}
              slot={{
                icon: <Image src={item.image} className={styles.myImg} />,
              }}
            />
          );
        })}
      </Grid>
    );
  };

  /**
   * 区域分割确定
   */
  const handleSplitOk = async () => {
    try {
      const res: any = await getLaserMapSplitPoint(mapId.current);
      console.log('【RoomEditLayout】handleSplitOk', res);
      const {
        type,
        data: [{ points, pixel }],
      } = res;
      if (points.length < 2) {
        showToast({
          title: Strings.getLang('dsc_room_split_out_of_range'),
          icon: 'error',
        });
        return;
      }
      const { version, origin } = store.getState().mapState;
      const roomId = parseRoomId(pixel, version);
      if (!roomId && roomId !== 0) {
        showToast({
          title: Strings.getLang('dsc_room_select_room'),
          icon: 'error',
        });
        return;
      }

      if (type === EMapSplitStateEnum.split) {
        const command = encodePartitionDivision0x1c({
          roomId,
          points: points.reverse(),
          origin,
          version: PROTOCOL_VERSION,
        });
        actions[commandTransCode].set(command);
        showLoading({ title: '' });

        timerRef.current = setTimeout(() => {
          hideLoading();
          ToastInstance.fail({
            message: Strings.getLang('dsc_split_room_fail'),
          });
        }, 20 * 1000);
      }
    } catch (error) {
      console.error(error);
    }
    // 无需恢复状态
  };

  /**
   * 重命名确定
   * @returns
   */
  const handleRoomNameOk = async () => {
    try {
      const { version } = store.getState().mapState;
      const maxUnknownId = version === 1 ? 31 : 26;
      const keys = Object.keys(previewCustom);

      if (keys.some(key => parseRoomId(key, version) > maxUnknownId)) {
        showToast({
          title: Strings.getLang('dsc_home_selectRoom_unknown'),
          icon: 'error',
        });
        return;
      }
      if (keys.some(key => stringToByte(previewCustom[key]).length > 19)) {
        showToast({
          title: Strings.getLang('dsc_room_name_too_long'),
          icon: 'error',
        });
        return;
      }

      if (keys.length > 0) {
        const command = encodeSetRoomName0x24({
          mapVersion: version,
          version: PROTOCOL_VERSION,
          rooms: keys.map(key => {
            return {
              roomHexId: key,
              name: previewCustom[key].name,
            };
          }),
        });

        actions[commandTransCode].set(command);
        showLoading({ title: '' });

        timerRef.current = setTimeout(() => {
          hideLoading();
          ToastInstance.fail({
            message: Strings.getLang('dsc_split_room_fail'),
          });
        }, 20 * 1000);
      } else {
        ToastInstance({
          message: Strings.getLang('dsc_rename_room_tips'),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 合并区域确定
   * @returns
   */
  const handleMergeOk = async () => {
    const { version } = store.getState().mapState;

    const maxUnknownId = version === 1 ? 31 : 26;
    try {
      const res: any = await getLaserMapMergeInfo(mapId.current);
      console.log('handleMergeOk ==>', res);
      const { type, data } = res;
      const roomIds = data.map((room: { pixel: string }) => parseRoomId(room.pixel, version));
      if (roomIds.length !== 2) {
        showToast({
          title: Strings.getLang('dsc_room_merge_count_error'),
          icon: 'error',
        });
        return;
      }
      if (roomIds.some((roomId: number) => roomId > maxUnknownId)) {
        showToast({
          title: Strings.getLang('dsc_room_selected_unknown'),
          icon: 'error',
        });
        return;
      }

      const dataList = (await getMapAreaInfo(mapId.current, roomIds, false)) as any[];
      if (!isAdjacent(dataList[0].points, dataList[1].points, 3)) {
        showToast({
          title: Strings.getLang('dsc_room_merge_board_error'),
          icon: 'error',
        });
        return;
      }

      if (type === EMapSplitStateEnum.merge) {
        const command = encodePartitionMerge0x1e({
          roomIds,
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
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 取消按钮恢复初始状态
   */
  const _onCancel = () => {
    handleNormal();
    setPreviewCustom({});
  };

  /**
   * 确定按钮对应的逻辑
   */
  const _onConfirm = () => {
    switch (stateType.current) {
      case 'merge':
        handleMergeOk();
        break;
      case 'split':
        handleSplitOk();
        break;
      case 'reName':
        handleRoomNameOk();
        break;
      case EditTypes.order:
        handleOrderOk();
        break;
      default:
        break;
    }
  };

  const handleOrderOk = async () => {
    const { data } = await getMapPointsInfo(mapId.current);
    const { version } = store.getState().mapState;

    if (Array.isArray(data)) {
      const roomIdHexs = data
        .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
        .map(itm => itm.pixel);
      const command = encodeRoomOrder0x26({
        version: PROTOCOL_VERSION,
        roomIdHexs,
        mapVersion: version,
      });
      actions[commandTransCode].set(command);
      showLoading({ title: '' });

      timerRef.current = setTimeout(() => {
        hideLoading();
        ToastInstance.fail({
          message: Strings.getLang('edit_fail'),
        });
      }, 20 * 1000);
    }
  };

  /**
   * 切换到对应的操作之后，改变提示的内容
   * @returns
   */
  const _onTip = () => {
    let tipTxt = '';
    switch (stateType.current) {
      case 'merge':
        tipTxt = Strings.getLang('dsc_merge_tip');
        break;
      case 'split':
        tipTxt = Strings.getLang('dsc_split_tip');
        break;
      case 'reName':
        tipTxt = Strings.getLang('dsc_rename_room_tips');
        break;
      default:
        break;
    }
    setTip(tipTxt);
  };

  const tags = [
    { text: Strings.getLang('dsc_room_tags_kitchen') },
    { text: Strings.getLang('dsc_room_tags_bathroom') },
    { text: Strings.getLang('dsc_room_tags_living_room') },
    { text: Strings.getLang('dsc_room_tags_bedroom') },
    { text: Strings.getLang('dsc_room_tags_balcony') },
  ];

  return (
    <View className={styles.container}>
      <MapView
        isFullScreen
        // 房间信息临时数据
        preCustomConfig={previewCustom}
        onMapId={onMapId}
        onClickSplitArea={onClickSplitArea}
        onSplitLine={onSplitLine}
        onMapLoadEnd={onMapLoadEnd}
        selectRoomData={[]}
        areaInfoList={[]}
        pathVisible={false}
      />

      <CoverView className={styles.bottomMenuBar}>
        {showMenuBar && mapLoadEnd && renderMenuBar()}
        {!showMenuBar && showDecisionBar && mapLoadEnd && (
          <DecisionBar
            onCancel={_onCancel}
            activeConfirm={activeConfirm}
            onConfirm={_onConfirm}
            tipText={tip}
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
