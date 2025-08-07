[English](./README.md) | 简体中文

# 灯带裁剪功能页

## 1. 功能页简介

1. 功能页是为了抽离出小程序中比较通用的一些能力（比如支付、登陆等等功能）而开发的一个特性功能。
2. 任何宿主小程序都可引入融合使用

## 2. 使用场景

1. 灯带裁剪作为一个相对独立的模块，几乎所有的照明灯带中都会用到，而单独进行每次的功能开发会花费大量开发人员的精力，所以将其功能提出来作为一个功能页级别的能力提供给开发使用以提升开发和交付效率。
2. 支持的能力：
   1. 同步裁剪后的灯带长度

<img width="200" style="width: 200px;" src="https://images.tuyacn.com/content-platform/hestia/16994978465fc72da8d22.png">

## 3. 路由

| 路由名称           | 路由地址 | 路由参数            | 路由描述   | 适用场景   |
| ------------------ | -------- | ------------------- | ---------- | ---------- |
| 灯带裁剪功能页首页 | /home    | deviceId \/ groupId | 进入功能页 | 见上面说明 |

### 路由参数

| 参数名称 | 参数描述                   | 默认值 |
| -------- | -------------------------- | ------ |
| deviceId | 设备 Id,与 groupId 二选一  | -      |
| groupId  | 群组 Id,与 deviceId 二选一 | -      |

## 4. 依赖 DP

宿主小程序关联产品所需要依赖的 DP

| 标识符                | 描述          | 数据传输类型       | 数据类型        | 功能点属性                                    | 是否必须 |
| --------------------- | ------------- | ------------------ | --------------- | --------------------------------------------- | -------- |
| light_length          | 总长度        | 可下发可上报（rw） | 数值型（Value） | 数值范围: 1-10000, 间距: 1, 倍数: 0, 单位: cm | 必须     |
| light_pixel           | 总点数        | 可下发可上报（rw） | 数值型（Value） | 数值范围: 1-1024, 间距: 1, 倍数: 0            | 必须     |
| lightpixel_number_set | 点数/长度设置 | 可下发可上报（rw） | 数值型（Value） | 数值范围: 1-1000, 间距: 1, 倍数: 0            | 必须     |

## 5. 如何接入

### global.config.ts 文件

```js
const tuya = {
  // ...其他配置
  functionalPages: {
    // 灯带裁剪功能页
    rayStripClipFunctional: {
      // tyj0zkwgqubepk3r1h 为功能页的 Id
      appid: 'tyj0zkwgqubepk3r1h',
    },
    // ...其他可能的功能页
  },
};
```

### 跳转功能页

```js
import { navigateTo } from '@ray-js/ray';
// deviceId 单设备 Id 详情参考上面表格具体内容
// groupId 群组id 详情参考上面表格具体内容
const jumpUrl = `functional://rayStripClipFunctional/home?deviceId=${deviceId || ''}&groupId=${groupId || ''}`;

navigateTo({
  url: jumpUrl,
  fail(e) {
    console.log(e);
  },
  success(e) {
    console.log(e);
  },
});
```

### presetData 跳转功能页
```js
import { navigateTo } from '@ray-js/ray';
const jumpUrl = `functional://rayStripClipFunctional/home?deviceId=${deviceId || ''}&groupId=${groupId || ''}`;

// 存储功能页数据Promise化
export const presetFunctionalData = (
  url: string,
  data: Record<string, any>
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    ty.presetFunctionalData({
      url,
      data,
      success: () => resolve(true),
      fail: err => reject(err),
    });
  });
};

// 添加功能页预设数据
await presetFunctionalData(jumpUrl, {
  themeColor: 'red',
  theme: 'light',
  backgroundStyle: {
    background: 'red',
  },
  hiddenBigIcon: true
})
navigateTo({
  url: jumpUrl,
  fail(e){console.log(e)},
  success(e){console.log(e)}
});
```


### presetFunctionalData API

| 参数         | 参数描述          | 类型                   | 默认值   | 是否必填 |
| ----------- | ---------------- | ---------------------- | ------ | -------- |
| themeColor `v1.1.11` | 主题色           | _string_  | `'rgba(16, 130, 254, 1)'` | 非必填   |
| theme  `v1.1.11`  | 主题      | _'dark'\|'light'_ | `'dark'`      | 非必填   |
| backgroundStyle  `v1.1.11`  | 背景样式      | _React.CSSProperties_ | -      | 非必填   |
| hiddenBigIcon  `v1.1.11`  | 隐藏大图标（白色主题下默认隐藏）      | _boolean_ | false      | 非必填   |

## 多语言列表

可被宿主项目覆盖

```ts
export default {
  lscf_functionTitle: '灯带长度设置',
  lscf_tips: '如果您在使用时对灯带进行过裁剪，可以通过调节实际长度来更好的设置灯带。',
  lscf_virtualDeviceTips: '虚拟设备缺少必要数据，无法设置灯带长度, 请使用真实设备',
  lscf_cardTitle: '实际长度',
  lscf_cardTitlePoints: '实际点数',
  lscf_confirm: '确定',
  lscf_cancel: '取消',
  lscf_unitMeter: '米',
  lscf_pointNum: '点数',
};
```

## TTT 能力

- App 版本：5.0.0 及以上

- "BaseKit": "3.4.0",
- "MiniKit": "3.2.2",
- "BizKit": "3.5.6",
- "DeviceKit": "3.5.1"
- "baseversion": "2.12.18"

## 7. 版本记录

### v1.1.11

- 对齐 RN 单位展示
- 新增 presetFunctionalData API，参数有：themeColor、theme、backgroundStyle、hiddenBigIcon

### v1.1.10

- 灯带展示段数改为 20 段

### v1.1.7

- 首个功能完整版本

## 注意事项 ⚠️

- 1. 裁剪功能页 appid： tyj0zkwgqubepk3r1h 此 Id 固定，跳转时需要确定 Id 是否正确
- 2. 裁剪功能页的：rayStripClipFunctional 此名称固定，确认配置是否正确
- 3. 请确认产品必须有相关灯带长度的 dp，如果没有此 DP 请隐藏进入此功能页的入口。
