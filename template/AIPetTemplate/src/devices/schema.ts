export const defaultSchema = [
  {
    attr: 0,
    canTrigger: true,
    code: 'basic_indicator',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_power2',
    id: 101,
    mode: 'rw',
    name: '基础指示灯',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'basic_flip',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_direction',
    id: 103,
    mode: 'rw',
    name: '画面翻转',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'basic_osd',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-a_nav_timer',
    id: 104,
    mode: 'rw',
    name: '时间水印',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'basic_private',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-a_nav_mode',
    id: 105,
    mode: 'rw',
    name: '隐私模式',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'motion_sensitivity',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_mode',
    id: 106,
    mode: 'rw',
    name: '移动侦测灵敏度',
    property: {
      range: ['0', '1', '2'],
      type: 'enum',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'basic_nightvision',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_mode',
    id: 108,
    mode: 'rw',
    name: '红外夜视',
    property: {
      range: ['0', '1', '2'],
      type: 'enum',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'sd_storge',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_mode',
    id: 109,
    mode: 'ro',
    name: '获取存储卡容量',
    property: {
      type: 'string',
      maxlen: 255,
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'sd_status',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-zhuangtai',
    id: 110,
    mode: 'ro',
    name: '存储卡状态',
    property: {
      min: 1,
      max: 5,
      scale: 0,
      step: 1,
      type: 'value',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'sd_format',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_power2',
    id: 111,
    mode: 'rw',
    name: '存储卡格式化',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'sd_format_state',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-zhuangtai',
    id: 117,
    mode: 'ro',
    name: '格式化状态',
    property: {
      min: -20000,
      max: 200000,
      scale: 0,
      step: 1,
      type: 'value',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'ptz_control',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_mode',
    id: 119,
    mode: 'rw',
    name: '方向控制',
    property: {
      range: ['0', '2', '4', '6', '8', '9'],
      type: 'enum',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'ptz_calibration',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_loop',
    id: 132,
    mode: 'rw',
    name: '云台校准',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'motion_switch',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-baojing',
    id: 134,
    mode: 'rw',
    name: '移动报警开关',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'record_switch',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_camera',
    id: 150,
    mode: 'rw',
    name: 'SD卡录像',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'record_mode',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_camera',
    id: 151,
    mode: 'rw',
    name: '录像模式',
    property: {
      range: ['1', '2'],
      type: 'enum',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'siren_switch',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-Panic',
    id: 159,
    mode: 'rw',
    name: '警笛开关',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'device_restart',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_power2',
    id: 162,
    mode: 'rw',
    name: '设备重启',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'quick_feed',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_power2',
    id: 202,
    mode: 'rw',
    name: '一键喂食',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'manual_feed',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_mode',
    id: 203,
    mode: 'rw',
    name: '手动喂食',
    property: {
      min: 1,
      max: 12,
      scale: 0,
      step: 1,
      type: 'value',
    },
    type: 'obj',
  },
  {
    attr: 1024,
    canTrigger: true,
    code: 'feed_state',
    defaultRecommend: false,
    editPermission: true,
    executable: true,
    extContent: '',
    iconname: 'icon-zhuangtai',
    id: 204,
    mode: 'ro',
    name: '喂食状态',
    property: {
      range: ['standby', 'feeding', 'done'],
      type: 'enum',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'feed_report',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_upload',
    id: 205,
    mode: 'ro',
    name: '喂食结果上报',
    property: {
      min: 0,
      max: 12,
      scale: 0,
      step: 1,
      type: 'value',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'status',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-zhuangtai',
    id: 206,
    mode: 'ro',
    name: '余粮状态',
    property: {
      range: ['enough', 'insufficient', 'run_out'],
      type: 'enum',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'grain_surplus',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_mode',
    id: 207,
    mode: 'rw',
    name: '粮桶余粮',
    property: {
      unit: '',
      min: 0,
      max: 99999,
      scale: 0,
      step: 1,
      type: 'value',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'percent_state',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-icon-percent',
    id: 208,
    mode: 'ro',
    name: '余粮百分比',
    property: {
      unit: '%',
      min: 0,
      max: 100,
      scale: 0,
      step: 10,
      type: 'value',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'weight',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-geren',
    id: 209,
    mode: 'ro',
    name: '余粮重量',
    property: {
      unit: 'g',
      min: 0,
      max: 10000,
      scale: 0,
      step: 1,
      type: 'value',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'battery_percentage',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_battery',
    id: 210,
    mode: 'ro',
    name: '电池电量',
    property: {
      unit: '%',
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
    code: 'light',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_light2',
    id: 211,
    mode: 'rw',
    name: '灯光开关',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 2048,
    canTrigger: true,
    code: 'initiative_message',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    id: 212,
    mode: 'rw',
    name: '主动消息推送',
    property: {
      type: 'raw',
      maxlen: 128,
    },
    type: 'raw',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'unit_switch',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_loop',
    id: 217,
    mode: 'rw',
    name: '单位转换',
    property: {
      range: ['cup', 'oz', 'grid'],
      type: 'enum',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'slow_feed',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_power2',
    id: 218,
    mode: 'rw',
    name: '慢放喂食',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'fault',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-baojing',
    id: 219,
    mode: 'ro',
    name: '故障告警',
    property: {
      label: [
        'pet_food_jam',
        'pet_food_shortages',
        'pet_food_run_out',
        'desiccant_exhausted',
        'battery_low',
        'device_stuck',
      ],
      type: 'bitmap',
      maxlen: 6,
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
    iconname: 'icon-dp_anti-clockwise',
    id: 220,
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
    code: 'cover_state',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-zhuangtai',
    id: 221,
    mode: 'ro',
    name: '喂食盖状态',
    property: {
      range: ['on', 'off'],
      type: 'enum',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'charge_state',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-zhuangtai',
    id: 222,
    mode: 'ro',
    name: '充电状态',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'meal_plan',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_mode',
    id: 223,
    mode: 'rw',
    name: '喂食计划',
    property: {
      type: 'raw',
      maxlen: 128,
    },
    type: 'raw',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'export_state',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-zhuangtai',
    id: 224,
    mode: 'ro',
    name: '出粮校准状态',
    property: {
      range: ['true', 'false'],
      type: 'enum',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'weight_calibrate',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_loop',
    id: 225,
    mode: 'rw',
    name: '余粮校准',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'feed_amount',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-setting',
    id: 226,
    mode: 'rw',
    name: '喂食数量',
    property: {
      unit: '',
      min: 0,
      max: 99999,
      scale: 1,
      step: 1,
      type: 'value',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'MCU_offline',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_power',
    id: 235,
    mode: 'ro',
    name: 'MCU下线',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'MCU_passthorugh_fail',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_power',
    id: 236,
    mode: 'ro',
    name: 'MCU DP透传失败',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'newmeal_plan',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-gongneng',
    id: 237,
    mode: 'rw',
    name: '喂食计划（新）',
    property: {
      type: 'raw',
      maxlen: 128,
    },
    type: 'raw',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'file_no',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-gongneng',
    id: 238,
    mode: 'rw',
    name: '录音文件',
    property: {
      type: 'string',
      maxlen: 255,
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'voice_times',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_0',
    id: 239,
    mode: 'rw',
    name: '语音播放次数',
    property: {
      unit: '',
      min: 0,
      max: 20,
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
    id: 240,
    mode: 'rw',
    name: '音量设置',
    property: {
      unit: '',
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
    code: 'play',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-zanting',
    id: 241,
    mode: 'rw',
    name: '录音播放/暂停',
    property: {
      type: 'bool',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'colour_data',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_mode',
    id: 242,
    mode: 'rw',
    name: '彩光调节',
    property: {
      type: 'string',
      maxlen: 255,
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'ejection_number',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-dp_mode',
    id: 243,
    mode: 'rw',
    name: '弹射次数',
    property: {
      range: ['1times', '2times', '3times', '4times', '5times'],
      type: 'enum',
    },
    type: 'obj',
  },
  {
    attr: 0,
    canTrigger: true,
    code: 'ejection_state',
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: '',
    iconname: 'icon-gongneng',
    id: 244,
    mode: 'ro',
    name: '弹射状态',
    property: {
      range: ['default', 'done', 'doing'],
      type: 'enum',
    },
    type: 'obj',
  },
] as const;
