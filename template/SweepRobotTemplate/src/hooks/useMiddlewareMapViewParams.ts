import { useSelectorMemoized } from '@/hooks';
import { selectCustomConfig } from '@/redux/modules/customConfigSlice';
import { selectMapStateByKey } from '@/redux/modules/mapStateSlice';
import base64Imgs from '@/res/base64Imgs';
import { UiInterFace } from '@ray-js/robot-map-component/lib/types/uiInterFace';
import { convertColorToArgbHex } from '@ray-js/robot-protocol';
import { IAnimationTypeEnum } from '@ray-js/robot-sdk-types';
import { useSelector } from 'react-redux';

type Props = {
  uiInterFace?: UiInterFace;
  pathVisible?: boolean;
  preCustomConfig: any;
  areaInfoList?: any[];
  mapId: string;
  backgroundColor?: string;
};

export default function useMiddlewareMapViewParams({
  pathVisible = true,
  uiInterFace = {},
  preCustomConfig,
  areaInfoList,
  mapId,
  backgroundColor,
}: Props) {
  const { isShowPileRing = false } = uiInterFace;

  const mapResolution = useSelector(selectMapStateByKey('mapResolution'));
  const selectRoomData = useSelectorMemoized(selectMapStateByKey('selectRoomData'));
  const RCTAreaList = useSelector(selectMapStateByKey('RCTAreaList'));
  const customConfig = useSelector(selectCustomConfig);
  const pilePosition = useSelectorMemoized(selectMapStateByKey('pilePosition'));
  const factor = mapResolution / 100;
  const originMap = useSelector(selectMapStateByKey('originMap'));
  const originPath = useSelector(selectMapStateByKey('originPath'));
  const materialObject = useSelector(selectMapStateByKey('materialObject'));

  const iconParams = {
    pileIcon: base64Imgs.pileBase64Img,
    isScale: false,
    scale: 0.015,
  };

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
      bgColor: convertColorToArgbHex(backgroundColor),
      highlightMapColor: [
        '#FDE4CF',
        '#8EECF5',
        '#CFBAF0',
        '#F1C0E8',
        '#A3C4F3',
        '#98F5E1',
        '#FFCFD2',
        '#90DBF4',
        '#E1C1EB',
        '#8ECCF5',
        '#EDDDDE',
        '#A3B8F3',
        '#EFCFE1',
        '#B2F2BE',
        '#AEE6F8',
        '#90C2F4',
      ],
      normalMapColor: [
        '#ea9a62',
        '#a47345',
        '#eabf62',
        '#ea7862',
        '#a45445',
        '#90493c',
        '#ffecda',
        '#ffd9b5',
      ],
      specialRoomColorMap: {
        60: '#11D0D0',
        61: '#82D0D1',
        62: '#98D0D2',
        63: '#87D0D3',
        28: '#11D0D0',
        29: '#82D0D1',
        30: '#98D0D2',
        31: '#87D0D3',
      },
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
      appointIcon: base64Imgs.pointIconBase64Img,
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
        markerIcon: base64Imgs.robotBase64Img,
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
        customKeys: ['modes'],
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
        modes: {
          valueEnum: ['1', '2', '3'],
          iconEnum: [base64Imgs.fan0, base64Imgs.fan1, base64Imgs.fan2],
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
      // 地板材质的配置枚举
      roomFloorMaterialConfig: {
        floorMaterial2d: {
          attributes: {
            opacity: 0.3,
            scale: 5,
          },
          typeEnum: [
            base64Imgs.floorMaterialDefault2d,
            base64Imgs.floorMaterialCeramic2d,
            base64Imgs.floorMaterialWoodHorizontal2d,
          ],
        },
        floorMaterial3d: {
          attributes: {
            opacity: 0.3,
            scale: 5,
          },
          typeEnum: [
            base64Imgs.floorMaterialDefault3d,
            base64Imgs.floorMaterialCeramic3d,
            base64Imgs.floorMaterialWoodHorizontal3d,
          ],
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
      preCustomRoomConfig: preCustomConfig,
      customRoomConfig: customConfig,
      areaInfoList: JSON.stringify(areaInfoList ?? RCTAreaList),
      materialObject,
    },
    // 地图的Hex数据
    mapDataHex: originMap,
    // 路径的Hex数据
    pathDataHex: originPath,
  };
}
