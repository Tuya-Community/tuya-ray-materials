import { RgbicLinerlightSceneData } from '@/devices/protocols/RgbicLinerlightSceneFormater';

export type SceneData = RgbicLinerlightSceneData & {
  name?: string;
  dataType?: number;
};

export type DrawColor = {
  isWhite: boolean;
  hue?: number;
  saturation?: number;
  value?: number;
  brightness?: number;
  temperature?: number;
};

export type ScenePData = {
  dataId?: number;
  name: string;
  colors: DrawColor[];
};
