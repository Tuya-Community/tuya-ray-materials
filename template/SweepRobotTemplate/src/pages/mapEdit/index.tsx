import MapView from '@/components/MapView';
import { PROTOCOL_VERSION, THEME_COLOR } from '@/constant';
import { commandTransCode } from '@/constant/dpCodes';
import { useCreateVirtualWall, useForbiddenNoGo, useForbiddenNoMop } from '@/hooks';
import { useSendDp } from '@/hooks/useSendDp';
import Strings from '@/i18n';
import store from '@/redux';
import Res from '@/res';
import { emitter, isForbiddenZonePointsInCurPos, isForbiddenZonePointsInPile } from '@/utils';
import { freezeMapUpdate, getMapPointsInfo, setLaserMapStateAndEdit } from '@/utils/openApi';
import { CoverView, Image, Text, View } from '@ray-js/ray';
import { encodeVirtualArea0x38, encodeVirtualWall0x12 } from '@ray-js/robot-protocol';
import { ENativeMapStatusEnum } from '@ray-js/robot-sdk-types';
import { Grid, GridItem } from '@ray-js/smart-ui';
import { useThrottleFn } from 'ahooks';
import { once } from 'lodash-es';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';

import styles from './index.module.less';

const MapEdit: FC = () => {
  const iconColor = THEME_COLOR;
  const [mapLoadEnd, setMapLoadEnd] = useState(false);
  const [status, setStatus] = useState<number>(ENativeMapStatusEnum.normal);
  const [showVirtualBar, setShowVirtualBar] = useState(false);
  const [showMenuBar, setShowMenuBar] = useState(true);
  const mapId = useRef('');
  const isWallRef = useRef(false);
  const { drawOneVirtualWall } = useCreateVirtualWall();
  const { drawOneForbiddenNoGo } = useForbiddenNoGo();
  const { drawOneForbiddenNoMop } = useForbiddenNoMop();

  const { sendDP, getTimer, clearTimer } = useSendDp(undefined, () => {
    setMapStatus(status, true);
    ty.showToast({
      title: Strings.getLang('dsc_save_failed'),
      icon: 'error',
    });
  });

  useEffect(() => {
    const handleReportVirtualData = () => {
      if (getTimer()) {
        setTimeout(() => {
          onVirtualMenuBarCancel();
          ty.hideLoading();
          clearTimer();
        }, 500);
      }
    };

    ty.setNavigationBarTitle({
      title: Strings.getLang('dsc_map_edit'),
    });
    emitter.on('reportVirtualData', handleReportVirtualData);

    return () => {
      emitter.off('reportVirtualData', handleReportVirtualData);
      freezeMapUpdate(mapId.current, false);
    };
  }, []);

  /**
   * 地图加载完成回调
   * @param data
   */
  const onMapId = data => {
    console.info('onMapId', data);
    mapId.current = data.mapId;
  };

  const { run: onLaserMapPoints } = useThrottleFn(
    ({ data }) => {
      const { mapResolution, curPos, origin, pilePosition } = store.getState().mapState;
      try {
        isForbiddenZonePointsInCurPos(data, {
          resolution: mapResolution / 100 || 0.05,
          curPos,
          origin,
          mapId: mapId.current,
        }).then(res => {
          if (res) {
            ty.showToast({
              title: Strings.getLang('dsc_forbid_too_close_tips'),
              icon: 'error',
            });
          }
        });

        isForbiddenZonePointsInPile(data, {
          resolution: mapResolution / 100 || 0.05,
          pilePosition,
          origin,
          mapId: mapId.current,
        }).then(res => {
          if (res) {
            ty.showToast({
              title: Strings.getLang('dsc_pile_too_close_tips'),
              icon: 'error',
            });
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
    { wait: 300, leading: true, trailing: false }
  );
  /**
   * 地图渲染完成回调
   * @param success
   */
  const onMapLoadEnd = (success: boolean) => {
    // 进入地图编辑页面需要把地图先冻结掉
    freezeMapUpdate(mapId.current, true);
    setMapLoadEnd(success);
  };

  /**
   * 设置地图状态
   * @param mapStatus
   * @param edit
   */
  const setMapStatus = async (mapStatus: number, edit: boolean) => {
    setLaserMapStateAndEdit(mapId.current, { state: mapStatus, edit });
    setStatus(mapStatus);
  };

  /**
   * 取消按钮
   */
  const onVirtualMenuBarCancel = () => {
    setMapStatus(ENativeMapStatusEnum.normal, false);
    setShowVirtualBar(false);
    setShowMenuBar(true);
  };

  /**
   * 新增确定按钮
   */
  const onVirtualMenuBarConfirm = async () => {
    const { origin } = store.getState().mapState;
    const { data } = await getMapPointsInfo(mapId.current);

    // console.info('【MapEditLayout】getLaserMapPointsInfo ==>', data);
    let dataArr: any = [];
    if (status === ENativeMapStatusEnum.virtualArea) {
      dataArr = data;
    } else {
      data.forEach(i => dataArr.push(i.points));
    }
    const putFn = once(() => {
      if (status === ENativeMapStatusEnum.virtualArea) {
        // 禁区
        const command = encodeVirtualArea0x38({
          version: PROTOCOL_VERSION,
          protocolVersion: 1,
          virtualAreas: dataArr.map(item => {
            return {
              points: item.points,
              mode: item.extend.forbidType === 'sweep' ? 1 : 2,
              name: item.content.text,
            };
          }),
          origin,
        });

        sendDP(commandTransCode, command, true);
      }

      if (status === ENativeMapStatusEnum.virtualWall) {
        // 虚拟墙
        const command = encodeVirtualWall0x12({
          version: PROTOCOL_VERSION,
          origin,
          walls: dataArr,
        });
        sendDP(commandTransCode, command, true);
      }
    });
    putFn();
  };
  /**
   * 渲染底部的控制按钮
   */
  const renderMenuBar = () => {
    const menuList: { text: string; image: any; onClick: () => void }[] = [
      {
        text: Strings.getLang('dsc_virtual_edit'),
        image: Res.virtual,
        onClick: () => {
          setShowMenuBar(false);
          setShowVirtualBar(true);
          isWallRef.current = false;
          setMapStatus(ENativeMapStatusEnum.virtualArea, true);
        },
      },
      {
        text: Strings.getLang('dsc_virtual_wall'),
        image: Res.virtualWall,
        onClick: () => {
          setShowMenuBar(false);
          setShowVirtualBar(true);
          isWallRef.current = true;

          setMapStatus(ENativeMapStatusEnum.virtualWall, true);
        },
      },

      {
        text: Strings.getLang('dsc_room_edit'),
        image: Res.mapEdit,
        onClick: () => {
          ty.navigateTo({ url: '/pages/roomEdit/index' });
        },
      },
    ];
    return (
      <Grid border={false} columnNum={3}>
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
    //  <BottomMenuBar menuList={menuList} />;
  };

  /**
   * 扫拖禁区
   */
  const { run: handleNoGo } = useThrottleFn(
    () => {
      drawOneForbiddenNoGo(mapId.current);
    },
    { wait: 300, leading: true, trailing: false }
  );

  /**
   * 拖地禁区
   */
  const { run: handleNoMop } = useThrottleFn(
    () => {
      drawOneForbiddenNoMop(mapId.current);
    },
    { wait: 300, leading: true, trailing: false }
  );

  const { run: handleVirtualWall } = useThrottleFn(
    () => {
      drawOneVirtualWall(mapId.current);
    },
    { wait: 300, leading: true, trailing: false }
  );

  /**
   * 渲染底部禁区编辑状态时的工具栏
   */
  const renderVirtualMenuBar = () => {
    return (
      <View className={styles.virtualMenuBar}>
        <View
          style={{
            marginTop: 110,
          }}
        >
          {isWallRef.current ? (
            <Grid border={false} columnNum={1}>
              <GridItem
                text={Strings.getLang('dsc_virtual_wall')}
                onClick={handleVirtualWall}
                iconClass={styles.cleanModeContent}
                slot={{
                  icon: <Image src={Res.virtualWall} className={styles.myImg} />,
                }}
              />
            </Grid>
          ) : (
            <Grid border={false} columnNum={2}>
              <GridItem
                text={Strings.getLang('dsc_forbid_sweep')}
                onClick={handleNoGo}
                iconClass={styles.cleanModeContent}
                slot={{
                  icon: <Image src={Res.noGo} className={styles.myImg} />,
                }}
              />
              <GridItem
                text={Strings.getLang('dsc_forbid_mop')}
                onClick={handleNoMop}
                iconClass={styles.cleanModeContent}
                slot={{
                  icon: <Image src={Res.noMop} className={styles.myImg} />,
                }}
              />
            </Grid>
          )}
        </View>

        <View
          style={{ position: 'absolute', top: '26px', left: '24px' }}
          onClick={onVirtualMenuBarCancel}
        >
          <Text className={styles.barBtn} style={{ color: 'rgba(0,0,0,0.7)' }}>
            {Strings.getLang('dsc_cancel')}
          </Text>
        </View>
        <View
          style={{ position: 'absolute', top: '26px', right: '24px' }}
          onClick={onVirtualMenuBarConfirm}
        >
          <Text className={styles.barBtn} style={{ color: iconColor }}>
            {Strings.getLang('dsc_confirm')}
          </Text>
        </View>
      </View>
    );
  };

  const uiInterFace = useMemo(() => {
    return { isFoldable: true, isCustomizeMode: false, isShowPileRing: true };
  }, []);

  return (
    <View className={styles.container}>
      <MapView
        isFullScreen
        mapDisplayMode="splitMap"
        uiInterFace={uiInterFace}
        onMapId={onMapId}
        onLaserMapPoints={onLaserMapPoints}
        isLite
        onMapLoadEnd={onMapLoadEnd}
        mapLoadEnd={mapLoadEnd}
        pathVisible={false}
        selectRoomData={[]}
      />
      <CoverView className={styles.bottomMenuBar}>
        {showMenuBar && renderMenuBar()}
        {!showMenuBar && showVirtualBar && renderVirtualMenuBar()}
      </CoverView>
    </View>
  );
};

export default MapEdit;
