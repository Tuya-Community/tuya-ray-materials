import OssApi from '@/api/ossApi';
import {
  useCreateVirtualWall,
  useForbiddenNoGo,
  useForbiddenNoMop,
  useSelectorMemoized,
} from '@/hooks';
import { selectMapStateByKey } from '@/redux/modules/mapStateSlice';
import { default as base64Imgs, default as res } from '@/res/base64Imgs';
import { decodeAreas } from '@/utils';
import { base64ToRaw } from '@ray-js/panel-sdk/lib/utils';
import {
  convertColorToArgbHex,
  decodeMap,
  getFeatureProtocolVersion,
} from '@ray-js/robot-protocol';
import { IAnimationTypeEnum } from '@ray-js/robot-sdk-types';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const {
  bDeleteBase64Img,
  bResizeBase64Img,
  bRotateBase64Img,
  pileBase64Img,
  pointIconBase64Img,
  robotBase64Img,
} = res;

type Props = {
  uiInterFace?: {
    isShowPileRing?: boolean; // 是否显示禁区ring
    isShowCurPosRing?: boolean; // 当前点ring
    isCustomizeMode?: boolean;
    isRobotQuiet?: boolean;
    isFoldable?: boolean; // 房间属性是否折叠
  };
  pathVisible?: boolean;
  preCustomConfig?: any;
  history?: {
    bucket: string;
    file: string;
    mapLen?: number;
    pathLen?: number;
  };
  mapId: string | number;
};

const fetch = (url, ...rest) => {
  return new Promise((resolve, reject) => {
    ty.downloadFile({
      url,
      ...rest,
      success: res => {
        const { tempFilePath } = res;
        ty.getFileSystemManager().readFile({
          filePath: tempFilePath,
          encoding: 'base64',
          position: 0,
          success: ({ data }) => {
            resolve({
              status: 200,
              data,
            });
          },
          fail: params => {
            console.log('readFile fail', params);
            reject();
          },
        });
      },
      failure: params => {
        console.log('downloadFile failure', params);
      },
    });
  });
};

const getAreasFromMixedCommand = (command: string) => {
  const protocolVersion = getFeatureProtocolVersion(command);
  const wallLength =
    (parseInt(protocolVersion === '1' ? command.slice(4, 12) : command.slice(4, 6), 16) + 2) * 2;
  const wallCommand = command.slice(0, wallLength);
  const areaCommand = command.slice(wallLength);

  return { ...decodeAreas(areaCommand), ...decodeAreas(wallCommand) };
};

export default function useHistoryMapViewParams({
  uiInterFace = {},
  history,
  mapId = 'history_' + String(new Date().getTime()),
  pathVisible = false,
}: Props) {
  const { getForbiddenNoMopConfig } = useForbiddenNoMop();
  const { getForbiddenNoGoConfig } = useForbiddenNoGo();
  const { getVirtualWallConfig } = useCreateVirtualWall();

  const { isShowPileRing = false } = uiInterFace;

  const mapResolution = useSelector(selectMapStateByKey('mapResolution'));
  const pilePosition = useSelectorMemoized(selectMapStateByKey('pilePosition'));
  const [historyMap, setHistoryMap] = useState<any>(null);
  const [historyPath, setHistoryPath] = useState<any>(null);
  const [historyAreas, setHistoryAreas] = useState<any>(null);
  const factor = mapResolution / 100;

  const selectRoomData: any[] = [];

  const iconParams = {
    pileIcon: pileBase64Img,
    isScale: false,
    scale: 0.015,
  };

  useEffect(() => {
    const fetchHistoryMap = async () => {
      if (history) {
        const { bucket, file, mapLen, pathLen } = history;
        const url = await OssApi.getCloudFileUrl(bucket, file);

        const mapData = await fetch(url, {
          method: 'GET',
        })
          .then(async (res: any) => {
            const { status } = res;
            if (status === 200) {
              if (mapLen || pathLen) {
                const data = base64ToRaw(res.data);
                const mapStrLength = mapLen * 2;
                const pathStrLength = pathLen * 2;
                const mapData = data.slice(0, mapStrLength);
                const pathData = data.slice(mapStrLength, mapStrLength + pathStrLength);
                const virtualData = data.slice(mapStrLength + pathStrLength);

                return {
                  originMap: mapData,
                  originPath: pathData,
                  virtualState: getAreasFromMixedCommand(virtualData),
                };
              }
              const data = base64ToRaw(res.data);

              const mapState = decodeMap(data);
              const {
                mapHeader: { dataLengthBeforeCompress, dataLengthAfterCompress, mapHeaderStr },
              } = mapState;
              let mapLength = 0;
              if (dataLengthAfterCompress) {
                mapLength = mapHeaderStr.length + dataLengthAfterCompress * 2;
              } else {
                mapLength = mapHeaderStr.length + dataLengthBeforeCompress * 2;
              }
              const virtualData = data.slice(mapLength);

              return {
                originMap: data,
                originPath: '',
                virtualState: getAreasFromMixedCommand(virtualData),
              };
            }
          })
          .catch(err => {
            console.error(err);
          });

        if (mapData) {
          const { originMap, virtualState, originPath } = mapData;

          setHistoryMap(originMap);
          originPath && setHistoryPath(originPath);
          Object.keys(virtualState).length > 0 && setHistoryAreas(virtualState);
        }
      }
    };

    fetchHistoryMap();
  }, [history]);

  const areaInfoListForThisMap = useMemo(() => {
    if (!historyAreas) return [];

    const { virtualMopAreaData, virtualAreaData, virtualWallData } = historyAreas;

    const areas = [];

    if (virtualMopAreaData) {
      areas.push(
        ...virtualMopAreaData.map(item => {
          return getForbiddenNoMopConfig(item.points);
        })
      );
    }

    if (virtualAreaData) {
      areas.push(
        ...virtualAreaData.map(item => {
          return getForbiddenNoGoConfig(item.points);
        })
      );
    }

    if (virtualWallData) {
      areas.push(
        ...virtualWallData.map(item => {
          return getVirtualWallConfig(item);
        })
      );
    }

    return areas;
  }, [historyAreas]);

  const pilePositionParams = isShowPileRing
    ? {
        ...pilePosition,
        iconParams,
        // 禁区半径
        radius: 20,
        bgColor: '#1937c852',
        borderColor: '',
        animation: {
          rate: 2,
          borderWidth: 3,
          duration: 2,
          borderColor: '#0037C852',
          color: '#4D37C852',
          animationType: IAnimationTypeEnum.normal,
        },
        hidden: false,
      }
    : {
        ...pilePosition,
        iconParams,
        hidden: true,
      };

  return {
    // 静态配置数据,数据只会在初始化的时候传入一次
    configurationData: {
      mapId,
      asynchronousLoadMap: false,
      bgColor: convertColorToArgbHex('#F6F6F6'),
      factorInfo: {
        factor,
        font: 12,
        color: '#ff000000',
      },
      maxRoomPropertyLength: 3,
      mergeRoomParams: {
        checkedIcon: {
          checkedIconEnable: false,
        },
      },
      minAreaWidth: 50 / 100 / 0.05,
      pathWidth: 8,
      pilePosition: pilePositionParams,
      appointIcon: pointIconBase64Img,
      posParams: {
        meter: 1.6,
        factor,
        bgColor: '#195D68FE',
        borderColor: '#FF5D68FE',
        isDash: false,
        lineWidth: 1,
        dashSize: 2,
        gapSize: 4,
        unit: {
          textColor: '#FF5D68FE',
          textSize: 12,
        },
      },
      robotParams: {
        markerIcon: robotBase64Img,
        iconParams: {
          isScale: false,
          scale: 0.02,
        },
      },
      selectedParams: {
        checkedIcon: {
          checkedIconEnable: true,
        },
      },
      showSelectRoomOrder: false,
      splitColor: '#ff3171D9',
      splitLineParams: {
        checkedIcon: {
          checkedIconEnable: false,
        },
        vertex: {
          vertexType: 'square',
          vertexColor: '#ff3171D9',
          radius: 3,
          vertexExtendTimes: 3,
        },
      },
      roomStyleConfig: {
        roomPropertyTextColor: '#ffffffff',
        roomPropertyBgColor: '#80225344',
        roomNameTextColor: '#ff000000',
        roomNameTextFont: 'Neue Frutiger World',
        roomNameTextStroke: {
          strokeWidth: 2,
          strokeColor: '#FFFFFFFF',
        },
      },

      roomAttributesConfig: {
        attributesFan: {
          attributesFanShow: true,
          attributesFanSet: true,
          attributesFanEnum: ['0', '1', '2', '3', '4'],
          attributesFanIconEnum: [
            base64Imgs.fan0,
            base64Imgs.fan1,
            base64Imgs.fan2,
            base64Imgs.fan3,
            base64Imgs.fan4,
          ],
        },
        attributesWater: {
          attributesWaterShow: true,
          attributesWaterSet: true,
          attributesWaterEnum: ['0', '1', '2', '3'],
          attributesWaterIconEnum: [
            base64Imgs.water0,
            base64Imgs.water1,
            base64Imgs.water2,
            base64Imgs.water3,
          ],
        },
        attributesTimes: {
          attributesTimesShow: true,
          attributesTimesSet: true,
          attributesTimesMaxNum: 3,
        },
        attributesOrder: {
          attributesOrderShow: true,
          attributesOrderSet: true,
        },
      },
      mapColorConfig: {
        cleaningColor: '#D0D0D0',
        barrierColor: 'rgba(0, 0, 0, 0.36)',
        unknownColor: 'rgba(255,255,255,0)',
      },
      // 机器人的一些配置数据
      robotConfig: {
        ringConfig: {
          ringRate: 2,
          ringBgColor: '#ff5abcfb',
          ringDuration: 2,
          ringBorderWidth: 8,
        },
      },
      // 路径的配置数据
      pathConfig: {
        pathColor: {
          commonColor: '#ffffffff',
          chargeColor: '#00FFFFFF',
          transitionsColor: '#00FFFFFF',
        },
      },
    },
    // 动态配置数据, 如一些用户交互或业务逻辑行为，会随着操作改变地图视图状态的数据
    runtimeData: {
      uiInterFace,
      selectRoomData,
      isFreezeMap: false,
      pathVisible,
      // 这里的areaInfoList 和 materialObject 需要再考虑是否后置
      areaInfoList: JSON.stringify(areaInfoListForThisMap),
      preCustomRoomConfig: {},
      customRoomConfig: {},
    },
    // 地图的Hex数据
    mapDataHex: historyMap,
    // 路径的Hex数据
    pathDataHex: historyPath,
    commandDataHex: '',
  };
}
