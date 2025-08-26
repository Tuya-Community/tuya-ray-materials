import { keyBy } from 'lodash-es';
import { GetSmartDeviceModelDpSchema } from '@ray-js/panel-sdk';

export const lampSchema = [
  {
    attr: 0,
    canTrigger: true,
    code: 'switch_gradient',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_mode',
    id: 35,
    mode: 'rw',
    name: '开关渐变',
    property: {
      type: 'raw',
      maxlen: 128,
    },
    type: 'raw',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'white_gradi_time',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_mode',
    id: 35,
    mode: 'rw',
    name: '白光渐变时间',
    property: {
      min: 0,
      max: 1000,
      scale: 0,
      step: 1,
      type: 'value',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'colour_gradi_time',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_mode',
    id: 35,
    mode: 'rw',
    name: '彩光渐变时间',
    property: {
      min: 0,
      max: 1000,
      scale: 0,
      step: 1,
      type: 'value',
    },
    type: 'obj',
  },
] as const;

export const lampSchemaMap = keyBy(lampSchema, 'code') as GetSmartDeviceModelDpSchema<
  typeof lampSchema
>;
