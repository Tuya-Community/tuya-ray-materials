import { ConfigurationData } from '@ray-js/robot-map-component/lib/types/config';
import { EventProps } from '@ray-js/robot-map-component/lib/types/event';
export interface IProps extends EventProps {
  mapDisplayMode?: mapDisplayModeEnum | string; // 地图模式
  history?: {
    bucket: string;
    file: string;
    mapLen?: number;
    pathLen?: number;
  };
  isFullScreen?: boolean;
  uiInterFace?: {
    isShowPileRing?: boolean;
    isShowCurPosRing?: boolean;
    isCustomizeMode?: boolean;
    isRobotQuiet?: boolean;
    isFoldable?: boolean;
  };
  mapId?: string;
  // 房间属性临时数据
  // 修改房间属性后，把修改后数据保存到previewCustom中，等待机器上报，如果成功，数据存储到customConfig中，
  // 这样，就无须等待地图上报就可以展示修改后地图数据，修改前后地图不会闪烁
  preCustomConfig?: any;
  customConfig?: string[];
  selectRoomData?: any; // 选区清扫房间数据，当isSelectRoom为true时生效
  foldableRoomIds?: string[];
  areaInfoList?: [];
  iconColor?: string;
  showLoading?: boolean;
  isLite?: boolean;
  mapLoadEnd?: boolean;
  isFreezeMap?: boolean;
  is3d?: boolean;
  snapshotImage?: { image: string; width: number; height: number };
  pathVisible?: boolean;
  onIDEP2pData?: (data: IDEP2pData) => void;
  logPrint?: boolean;
}

export enum mapDisplayModeEnum {
  immediateMap = 'immediateMap', // 实时地图
  history = 'history', // 历史地图
  splitMap = 'splitMap', // 地图分区
  multiFloor = 'multiFloor', // 地图管理
}