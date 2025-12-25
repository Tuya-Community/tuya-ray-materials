import Strings from '@/i18n';

export const DEFAULTOPTIONS = {
  cellIntervalTime: 50, // 1 BYTE 单元切换间隔时间
  cellChangeTime: 50, // 1 BYTE 单元变化时间
  setA: 0, // 1 BYTE 00000000  1-4bit预留。 bit 5: 0 - 顺时针 / 1- 逆时针 bit 6: 0 - 不过渡 / 1 - 过渡 bit 7: 0 - 不循环 /1 -循环 bit 8: 0 - 全段 / 1 - 分段
  setB: 0, // 1 BYTE 预留
  setC: 0, // 1 BYTE 预留
  colors: [
    {
      value: 100,
      hue: 2,
      saturation: 100,
      brightness: 0,
      temperature: 0,
    },
  ],
  changeType: 1,
};

export const getCHANGE_TYPE = () => [
  {
    id: 0,
    title: Strings.getLang('change_type_float_down_new'), // 飘落
    options: [
      {
        type: 'binary',
        title: Strings.getLang('direction'),
        defaultValue: 0,
        field: 'setA',
        position: 4, // 第几位
        option: [
          { title: Strings.getLang('clockwise'), value: 0 },
          { title: Strings.getLang('anticlockwise'), value: 1 },
        ],
      },
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: 1,
    title: Strings.getLang('change_type_rainbow'), // 彩虹
    options: [
      {
        type: 'binary',
        title: Strings.getLang('direction'),
        defaultValue: 0,
        field: 'setA',
        position: 4, // 第几位
        option: [
          { title: Strings.getLang('clockwise'), value: 0 },
          { title: Strings.getLang('anticlockwise'), value: 1 },
        ],
      },
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  // {
  //   id: 2,
  //   title: Strings.getLang('change_type_gluttonous_snake'),
  //   options: [
  //     {
  //       type: 'number',
  //       title: Strings.getLang('speed'),
  //       field: 'cellChangeTime',
  //       max: 100,
  //       min: 0,
  //       defaultValue: 50,
  //     },
  //   ],
  // },
  {
    id: 3,
    title: Strings.getLang('change_type_chase'), // 追逐
    options: [
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: 4,
    title: Strings.getLang('change_type_apsaras'), // 飞天
    options: [
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: 5,
    title: Strings.getLang('change_type_bunting'), // 彩旗
    options: [
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  // {
  //   id: 6,
  //   title: Strings.getLang('change_type_collision'),
  //   options: [
  //     {
  //       type: 'number',
  //       title: Strings.getLang('speed'),
  //       field: 'cellChangeTime',
  //       max: 100,
  //       min: 0,
  //       defaultValue: 50,
  //     },
  //   ],
  // },
  {
    id: 7,
    title: Strings.getLang('change_type_rebound'), // 反弹
    options: [
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: 8,
    title: Strings.getLang('change_type_radiant'), // 闪耀
    options: [
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: 9,
    title: Strings.getLang('change_type_jump'), // 跳变
    options: [
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: 10,
    title: Strings.getLang('change_type_breath'), // 呼吸
    options: [
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: 11,
    title: Strings.getLang('change_type_flicker'), // 闪烁
    options: [
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: 12,
    title: Strings.getLang('change_type_gradation'), // 渐变
    options: [
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: 13,
    title: Strings.getLang('change_type_meteor'), // 流星
    options: [
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: 14,
    title: Strings.getLang('change_type_stacking'), // 堆积
    options: [
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: 15,
    title: Strings.getLang('change_type_follow_spot'), // 追光
    options: [
      {
        type: 'binary',
        title: Strings.getLang('direction'),
        defaultValue: 0,
        field: 'setA',
        position: 4, // 第几位
        option: [
          { title: Strings.getLang('clockwise'), value: 0 },
          { title: Strings.getLang('anticlockwise'), value: 1 },
        ],
      },
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: 16,
    title: Strings.getLang('change_type_flutter'), // 飘动
    options: [
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: 17,
    title: Strings.getLang('change_type_flash'), // 闪现
    options: [
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: 18,
    title: Strings.getLang('change_type_open_close'), // 开合
    options: [
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: 19,
    title: Strings.getLang('change_type_chaos_flash_new'), // 乱闪
    options: [
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: 20,
    title: Strings.getLang('change_type_gluttonous_snake'), // 流水
    options: [
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: 21,
    title: Strings.getLang('change_type_shuttle'), // 穿梭
    options: [
      {
        type: 'number',
        title: Strings.getLang('speed'),
        field: 'cellChangeTime',
        max: 100,
        min: 1,
        defaultValue: 50,
      },
    ],
  },
];
