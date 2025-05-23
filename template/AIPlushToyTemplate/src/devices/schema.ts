export const defaultSchema = [
  {
    attr: 0,
    canTrigger: true,
    code: 'battery_percentage',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_battery',
    id: 2,
    mode: 'ro',
    name: '电量',
    property: {
      min: 0,
      max: 100,
      scale: 0,
      step: 1,
      type: 'value',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'volume_set',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_voice',
    id: 3,
    mode: 'rw',
    name: '音量',
    property: {
      min: 0,
      max: 100,
      scale: 0,
      step: 1,
      type: 'value',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'charge_status',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-zhuangtai',
    id: 5,
    mode: 'ro',
    name: '充电状态',
    property: {
      range: ['none', 'charging', 'charge_done'],
      type: 'enum',
    },
    type: 'obj',
  },
] as const;
