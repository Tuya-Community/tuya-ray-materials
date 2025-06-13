import { property } from 'lodash-es';

export const defaultSchema = [
  {
    id: 101,
    code: 'basic_indicator',
    mode: 'rw',
    property: {
      type: 'bool',
    },
    type: 'obj',
    name: '状态指示灯',
  },
  {
    id: 46,
    code: 'wireless_powermode',
    node: 'ro',
    type: 'enum',
    name: '供电方式', // 设备主动上报当前供电状态，供电状态发生变化时上报。0为电池供电状态，1为插电供电状态（或电池充电状态）
    property: { range: ['0', '1'], type: 'enum' },
  },
  {
    id: 163,
    code: 'zoom_control',
    mode: 'rw',
    property: {
      range: ['0', '1'],
      type: 'enum',
    },
    type: 'obj',
    name: '焦距控制',
  },
  {
    id: 164,
    code: 'zoom_stop',
    mode: 'rw',
    property: {
      type: 'bool',
    },
    type: 'obj',
    name: '停止变焦',
  },
  {
    id: 116,
    code: 'ptz_stop',
    mode: 'rw',
    property: {
      type: 'bool',
    },
    type: 'obj',
    name: '停止转动',
  },
  {
    id: 119,
    code: 'ptz_control',
    mode: 'rw',
    property: {
      range: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      type: 'enum',
    },
    type: 'obj',
    name: '云台转动',
  },
  {
    id: 105,
    code: 'basic_private',
    mode: 'rw',
    property: {
      type: 'bool',
    },
    type: 'obj',
    name: '隐私模式',
  },
  {
    id: 231,
    code: 'ipc_direction_control',
    mode: 'wr',
    property: {
      type: 'string',
    },
    type: 'string',
    name: '遥控',
  },
  {
    id: 233,
    code: 'ipc_movement_speed',
    mode: 'rw',
    property: { unit: '%', min: 0, max: 100, scale: 0, step: 1, type: 'value' },
    type: 'value',
    name: '速度',
  },
  {
    id: 232,
    code: 'ipc_auto_recharge',
    mode: 'rw',
    property: {
      type: 'bool',
    },
    type: 'bool',
    name: '自动回充',
  },
  {
    id: 161,
    code: 'motion_tracking',
    mode: 'rw',
    property: {
      type: 'bool',
    },
    type: 'bool',
    name: '跟随',
  },
  {
    id: 237,
    code: 'ipc_manual_petting',
    name: '互动动作',
    mode: 'rw',
    property: {
      range: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      type: 'enum',
    },
    type: 'obj',
  },
  {
    id: 238,
    name: '互动动作状态',
    code: 'ipc_manual_petting_state',
    mode: 'ro',
    property: { type: 'bool' },
    type: 'bool',
  },
  {
    id: 239,
    name: '路径功能',
    code: 'ipc_mobile_path',
    mode: 'rw',
    type: 'string',
    property: {
      type: 'string',
      maxLen: 255,
    },
  },
  {
    id: 240,
    name: '路径节点数量',
    code: 'ipc_mobile_pathnum',
    mode: 'ro',
    type: 'value',
    property: {
      type: 'value',
      min: 1,
      max: 10,
      scale: 0,
      step: 1,
    },
  },
  {
    id: 241,
    name: '路径节点能力',
    code: 'ipc_mobile_pathnode',
    mode: 'rw',
    type: 'string',
    property: {
      type: 'string',
      maxLen: 255,
    },
  },
] as const;
