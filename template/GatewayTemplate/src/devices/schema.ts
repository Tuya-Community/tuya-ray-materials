export const defaultSchema = [
  {
    attr: 0,
    canTrigger: true,
    code: 'switch_alarm_sound',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    id: 4,
    mode: 'rw',
    name: '报警声开关',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'master_state',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    id: 32,
    mode: 'rw',
    name: '主机状态',
    property: {
      range: ['normal', 'alarm'],
      type: 'enum',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'factory_reset',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    id: 34,
    mode: 'rw',
    name: '恢复出厂设置',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'alarm_active',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    id: 45,
    mode: 'rw',
    name: '主动报警',
    property: {
      type: 'string',
      maxlen: 255,
    },
    type: 'obj',
  },
];
