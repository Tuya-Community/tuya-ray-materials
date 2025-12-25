// 判断照明灯是几路
import { useDpSchema } from '@ray-js/panel-sdk';
import { useEffect, useMemo, useState } from 'react';

type dpCode = string;

export enum Road {
  road1 = 'road1',
  road2 = 'road2',
  road3 = 'road3',
  road4 = 'road4',
  road5 = 'road5',
}

type Params = {
  [Road.road1]: dpCode[];
  [Road.road2]: dpCode[];
  [Road.road3]: dpCode[];
  [Road.road4]: dpCode[];
  [Road.road5]: dpCode[];
};

enum STAND_LAMP_DP_CODE {
  'colour_data' = 'colour_data', // 3,4,5路
  'bright_value' = 'bright_value', // 1,2,3,4,5路
  'temp_value' = 'temp_value', // 2,3,4,5路
}

const defaultRoad = {
  [Road.road1]: [STAND_LAMP_DP_CODE.bright_value],
  [Road.road2]: [STAND_LAMP_DP_CODE.bright_value, STAND_LAMP_DP_CODE.temp_value],
  [Road.road3]: [STAND_LAMP_DP_CODE.colour_data],
  [Road.road4]: [STAND_LAMP_DP_CODE.colour_data, STAND_LAMP_DP_CODE.bright_value],
  [Road.road5]: [
    STAND_LAMP_DP_CODE.colour_data,
    STAND_LAMP_DP_CODE.bright_value,
    STAND_LAMP_DP_CODE.temp_value,
  ],
};

export const useLampRoad = (params: Params = defaultRoad): Road => {
  const dpSchemaObj = useDpSchema();

  return useMemo(() => {
    if (!dpSchemaObj) {
      return Road.road1;
    }
    // 判断照明灯是几路
    // 5路
    if (params[Road.road5]) {
      const road5List = params[Road.road5];
      const _road = road5List.every(item => {
        return !!dpSchemaObj[item];
      });
      if (_road) {
        return Road.road5;
      }
    }

    // 4路
    if (params[Road.road4]) {
      const road4List = params[Road.road4];
      const _road = road4List.every(item => {
        return !!dpSchemaObj[item];
      });
      if (_road) {
        return Road.road4;
      }
    }

    // 3路
    if (params[Road.road3]) {
      const road3List = params[Road.road3];
      const _road = road3List.every(item => {
        return !!dpSchemaObj[item];
      });
      if (_road) {
        return Road.road3;
      }
    }

    // 2路
    if (params[Road.road2]) {
      const road2List = params[Road.road2];
      const _road = road2List.every(item => {
        return !!dpSchemaObj[item];
      });
      if (_road) {
        return Road.road2;
      }
    }

    // 1路
    if (params[Road.road1]) {
      const road1List = params[Road.road1];
      const _road = road1List.every(item => {
        return !!dpSchemaObj[item];
      });
      if (_road) {
        return Road.road1;
      }
    }
  }, [dpSchemaObj]);
};

export default useLampRoad;
