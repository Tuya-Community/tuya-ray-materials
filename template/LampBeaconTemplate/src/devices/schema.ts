import _ from 'lodash-es';
import { GetSmartDeviceModelDpSchema } from '@ray-js/panel-sdk';

export const lampSchema = [
  {
    attr: 0,
    canTrigger: true,
    code: 'switch_led',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_power2',
    id: 1,
    mode: 'rw',
    name: '开关',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'work_mode',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_mode',
    id: 2,
    mode: 'wr',
    name: '工作模式',
    property: {
      range: ['light_white', 'colour', 'scene', 'music'],
      type: 'enum',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'bright_value',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-liangdu',
    id: 3,
    mode: 'wr',
    name: '亮度值',
    property: {
      unit: '',
      min: 10,
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
    code: 'temp_value',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-lengnuan',
    id: 4,
    mode: 'wr',
    name: '冷暖值',
    property: {
      unit: '',
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
    code: 'countdown',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_time2',
    id: 7,
    mode: 'wr',
    name: '倒计时',
    property: {
      unit: 's',
      min: 0,
      max: 86400,
      scale: 0,
      step: 1,
      type: 'value',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'colour_data_raw',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_mode',
    id: 11,
    mode: 'wr',
    name: '彩光',
    property: {
      type: 'raw',
      maxlen: 128,
    },
    type: 'raw',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'music_data_raw',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-deng',
    id: 13,
    mode: 'wr',
    name: '音乐灯',
    property: {
      type: 'raw',
      maxlen: 128,
    },
    type: 'raw',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'mic_music_data_raw',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_mode',
    id: 14,
    mode: 'rw',
    name: '麦克风音乐律动',
    property: {
      type: 'raw',
      maxlen: 128,
    },
    type: 'raw',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'cds',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-liangdu1',
    id: 53,
    mode: 'wr',
    name: '光敏参数设置',
    property: {
      range: ['2000lux', '300lux', '50lux', '10lux', '5lux'],
      type: 'enum',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'pir_sensitivity',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_mode',
    id: 54,
    mode: 'wr',
    name: 'pir灵敏度',
    property: {
      range: ['low', 'middle', 'high'],
      type: 'enum',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'pir_delay',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_time3',
    id: 55,
    mode: 'wr',
    name: '感应延时',
    property: {
      unit: 's',
      min: 5,
      max: 3600,
      scale: 0,
      step: 1,
      type: 'value',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'switch_pir',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_power2',
    id: 56,
    mode: 'wr',
    name: '感应开关',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'standby_time',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_time3',
    id: 58,
    mode: 'wr',
    name: '伴亮延时',
    property: {
      unit: 'min',
      min: 0,
      max: 480,
      scale: 0,
      step: 1,
      type: 'value',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'standby_bright',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-liangdu1',
    id: 59,
    mode: 'wr',
    name: '伴亮亮度值',
    property: {
      unit: '',
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
    code: 'sensorgroup_sync',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_power2',
    id: 60,
    mode: 'rw',
    name: '传感组同步',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'battery_state',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_battery',
    id: 62,
    mode: 'rw',
    name: '电池电量状态',
    property: {
      range: ['low', 'middle', 'high'],
      type: 'enum',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'group_id',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_doc',
    id: 63,
    mode: 'wr',
    name: '群组ID',
    property: {
      type: 'raw',
      maxlen: 128,
    },
    type: 'raw',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'strip_scene',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-a_nav_mode',
    id: 73,
    mode: 'wr',
    name: '灯带情景',
    property: {
      type: 'raw',
      maxlen: 128,
    },
    type: 'raw',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'strip_local_timer',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_time3',
    id: 75,
    mode: 'rw',
    name: '灯带本地定时',
    property: {
      type: 'raw',
      maxlen: 128,
    },
    type: 'raw',
  },
] as const;

export const lampSchemaMap = _.keyBy(lampSchema, 'code') as GetSmartDeviceModelDpSchema<
  typeof lampSchema
>;

export type IDpCodes = keyof typeof lampSchemaMap;
