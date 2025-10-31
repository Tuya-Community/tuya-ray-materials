import { PROTOCOL_VERSION, THEME_COLOR } from '@/constant';
import Strings from '@/i18n';
import store from '@/redux';
import Res from '@/res';
import { CoverView, Image, router, Text, View } from '@ray-js/ray';
import { encodeVirtualArea0x38, encodeVirtualWall0x12 } from '@ray-js/robot-protocol';
import { Grid, GridItem, NavBar } from '@ray-js/smart-ui';
import { useThrottleFn } from 'ahooks';
import React, { FC, useMemo, useState } from 'react';
import WebViewMap from '@/components/Map/WebViewMap';
import { MapApi, offsetPointsToAvoidOverlap, VirtualWallParam, ZoneParam } from '@ray-js/robot-map';
import { nanoid } from '@reduxjs/toolkit';
import { useActions } from '@ray-js/panel-sdk';
import { commandTransCode } from '@/constant/dpCodes';

import styles from './index.module.less';

const MapEdit: FC = () => {
  const actions = useActions();
  const [mapApi, setMapApi] = useState<MapApi | null>(null);
  const [virtualWalls, setVirtualWalls] = useState<VirtualWallParam[]>(
    () => store.getState().mapState.virtualWalls
  );
  const [forbiddenSweepZones, setForbiddenSweepZones] = useState<ZoneParam[]>(
    () => store.getState().mapState.forbiddenSweepZones
  );
  const [forbiddenMopZones, setForbiddenMopZones] = useState<ZoneParam[]>(
    () => store.getState().mapState.forbiddenMopZones
  );
  const [editingVirtualWallIds, setEditingVirtualWallIds] = useState<string[]>([]);
  const [editingForbiddenMopZoneIds, setEditingForbiddenMopZoneIds] = useState<string[]>([]);
  const [editingForbiddenSweepZoneIds, setEditingForbiddenSweepZoneIds] = useState<string[]>([]);

  const runtime = useMemo(() => {
    return {
      editingVirtualWallIds,
      editingForbiddenMopZoneIds,
      editingForbiddenSweepZoneIds,
      showPath: false,
    };
  }, [editingVirtualWallIds, editingForbiddenMopZoneIds, editingForbiddenSweepZoneIds]);

  /**
   * 取消按钮
   */
  const handleReset = () => {
    // 从 store 中重新获取初始数据，恢复到进入页面时的状态
    const initialState = store.getState().mapState;

    // 重置所有数据到初始状态
    setVirtualWalls(initialState.virtualWalls);
    setForbiddenSweepZones(initialState.forbiddenSweepZones);
    setForbiddenMopZones(initialState.forbiddenMopZones);

    // 清空所有编辑状态
    setEditingVirtualWallIds([]);
    setEditingForbiddenMopZoneIds([]);
    setEditingForbiddenSweepZoneIds([]);
  };

  /**
   * 新增确定按钮
   */
  const handleConfirm = async () => {
    // 禁区
    const zonesCommand = encodeVirtualArea0x38({
      version: PROTOCOL_VERSION,
      protocolVersion: 1,
      virtualAreas: forbiddenSweepZones
        .map(item => {
          return {
            points: item.points,
            mode: 1,
            name: '',
          };
        })
        .concat(
          forbiddenMopZones.map(item => {
            return {
              points: item.points,
              mode: 2,
              name: '',
            };
          })
        ),
    });

    const virtualWallsCommand = encodeVirtualWall0x12({
      version: PROTOCOL_VERSION,
      walls: virtualWalls.map(item => item.points),
    });

    actions[commandTransCode].set(zonesCommand);
    actions[commandTransCode].set(virtualWallsCommand);

    setEditingForbiddenMopZoneIds([]);
    setEditingForbiddenSweepZoneIds([]);
    setEditingVirtualWallIds([]);
  };

  const handleMapReady = (mapApi: MapApi) => {
    setMapApi(mapApi);
  };

  /**
   * 扫拖禁区
   */
  const { run: handleNoGo } = useThrottleFn(
    async () => {
      const points = await mapApi.getForbiddenSweepZonePointsByViewportCenter({
        size: 1.6,
      });

      // 自动偏移，避免与已有的禁扫区和禁拖区重叠
      offsetPointsToAvoidOverlap(points, [
        ...forbiddenSweepZones.map(zone => zone.points),
        ...forbiddenMopZones.map(zone => zone.points),
      ]);

      const newId = nanoid();
      setForbiddenSweepZones([...forbiddenSweepZones, { id: newId, points }]);
      setEditingForbiddenSweepZoneIds([newId]);
    },
    { wait: 300, leading: true, trailing: false }
  );

  const handleUpdateForbiddenSweepZone = (zone: ZoneParam) => {
    setForbiddenSweepZones(forbiddenSweepZones.map(z => (z.id === zone.id ? zone : z)));
  };

  const handleClickForbiddenSweepZone = (zone: ZoneParam) => {
    setEditingForbiddenSweepZoneIds([zone.id]);
  };

  const handleRemoveForbiddenSweepZone = (removedId: string) => {
    setForbiddenSweepZones(forbiddenSweepZones.filter(z => z.id !== removedId));
    setEditingForbiddenSweepZoneIds(editingForbiddenSweepZoneIds.filter(id => id !== removedId));
  };

  /**
   * 拖地禁区
   */
  const { run: handleNoMop } = useThrottleFn(
    async () => {
      const points = await mapApi.getForbiddenMopZonePointsByViewportCenter({
        size: 1.6,
      });

      // 自动偏移，避免与已有的禁扫区和禁拖区重叠
      offsetPointsToAvoidOverlap(points, [
        ...forbiddenSweepZones.map(zone => zone.points),
        ...forbiddenMopZones.map(zone => zone.points),
      ]);

      const newId = nanoid();
      setForbiddenMopZones([...forbiddenMopZones, { id: newId, points }]);
      setEditingForbiddenMopZoneIds([newId]);
    },
    { wait: 300, leading: true, trailing: false }
  );

  const handleUpdateForbiddenMopZone = (zone: ZoneParam) => {
    setForbiddenMopZones(forbiddenMopZones.map(z => (z.id === zone.id ? zone : z)));
  };

  const handleClickForbiddenMopZone = (zone: ZoneParam) => {
    setEditingForbiddenMopZoneIds([zone.id]);
  };

  const handleRemoveForbiddenMopZone = (removedId: string) => {
    setForbiddenMopZones(forbiddenMopZones.filter(z => z.id !== removedId));
    setEditingForbiddenMopZoneIds(editingForbiddenMopZoneIds.filter(id => id !== removedId));
  };

  const { run: handleVirtualWall } = useThrottleFn(
    async () => {
      if (!mapApi) return;

      const wallPoints = await mapApi.getWallPointsByViewportCenter({
        width: 1.2,
      });

      // 自动偏移，避免与已有的虚拟墙重叠
      offsetPointsToAvoidOverlap(
        wallPoints,
        virtualWalls.map(wall => wall.points)
      );

      const newId = nanoid();
      setVirtualWalls([...virtualWalls, { id: newId, points: wallPoints }]);
      setEditingVirtualWallIds([newId]);
    },
    { wait: 300, leading: true, trailing: false }
  );

  const handleUpdateVirtualWall = (wall: VirtualWallParam) => {
    setVirtualWalls(virtualWalls.map(w => (w.id === wall.id ? wall : w)));
  };

  const handleClickVirtualWall = (wall: VirtualWallParam) => {
    setEditingVirtualWallIds([wall.id]);
  };

  const handleRemoveVirtualWall = (removedId: string) => {
    setVirtualWalls(virtualWalls.filter(w => w.id !== removedId));
    setEditingVirtualWallIds(editingVirtualWallIds.filter(id => id !== removedId));
  };

  return (
    <View className={styles.container}>
      <CoverView>
        <NavBar title={Strings.getLang('dsc_map_edit')} leftArrow onClickLeft={router.back} />
      </CoverView>
      <WebViewMap
        onMapReady={handleMapReady}
        virtualWalls={virtualWalls}
        forbiddenSweepZones={forbiddenSweepZones}
        forbiddenMopZones={forbiddenMopZones}
        runtime={runtime}
        onUpdateVirtualWall={handleUpdateVirtualWall}
        onClickVirtualWall={handleClickVirtualWall}
        onRemoveVirtualWall={handleRemoveVirtualWall}
        onUpdateForbiddenMopZone={handleUpdateForbiddenMopZone}
        onClickForbiddenMopZone={handleClickForbiddenMopZone}
        onRemoveForbiddenMopZone={handleRemoveForbiddenMopZone}
        onUpdateForbiddenSweepZone={handleUpdateForbiddenSweepZone}
        onClickForbiddenSweepZone={handleClickForbiddenSweepZone}
        onRemoveForbiddenSweepZone={handleRemoveForbiddenSweepZone}
      />
      <CoverView className={styles.footerWrapper}>
        <View className={styles.footer}>
          <View className={styles.footerHeader}>
            <View onClick={handleReset}>
              <Text className={styles.btn} style={{ color: 'rgba(0,0,0,0.7)' }}>
                {Strings.getLang('dsc_reset')}
              </Text>
            </View>
            <View onClick={handleConfirm}>
              <Text className={styles.btn} style={{ color: THEME_COLOR }}>
                {Strings.getLang('dsc_confirm')}
              </Text>
            </View>
          </View>

          <Grid border={false} columnNum={3}>
            <GridItem
              text={Strings.getLang('dsc_virtual_wall')}
              onClick={handleVirtualWall}
              iconClass={styles.gridItem}
              slot={{
                icon: <Image src={Res.virtualWall} className={styles.icon} />,
              }}
            />
            <GridItem
              text={Strings.getLang('dsc_forbid_sweep')}
              onClick={handleNoGo}
              iconClass={styles.gridItem}
              slot={{
                icon: <Image src={Res.noGo} className={styles.icon} />,
              }}
            />
            <GridItem
              text={Strings.getLang('dsc_forbid_mop')}
              onClick={handleNoMop}
              iconClass={styles.gridItem}
              slot={{
                icon: <Image src={Res.noMop} className={styles.icon} />,
              }}
            />
          </Grid>
        </View>
      </CoverView>
    </View>
  );
};

export default MapEdit;
