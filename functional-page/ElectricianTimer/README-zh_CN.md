[English](./README.md) | 简体中文

# 电工定时功能页

用于电工品类定时功能页，支持普通定时、日出定时、日落定时、循环定时、随机定时、点动开关、倒计时等功能

## 使用说明

### 安装功能页

在项目的 global.config.ts 文件中加入以下代码

```ts
export const tuya = {
  ......
  functionalPages: {
    'ElectricianTimer': {
      appid: 'typtepohxfeukudmyi',
    },
  },
  ......
};
```

### 跳转功能页

#### 跳转定时综合列表页

```ts
const jumpUrl = `functional://ElectricianTimer/home?deviceId=${deviceId}`;
ty.navigateTo({
  url: jumpUrl,
});
```

#### 跳转云定时列表页面

```ts
const jumpUrl = `functional://ElectricianTimer/schedule?deviceId=${deviceId}`;
ty.navigateTo({
  url: jumpUrl,
});
```

#### 跳转循环定时列表页面

```ts
const jumpUrl = `functional://ElectricianTimer/cycle?deviceId=${deviceId}`;
ty.navigateTo({
  url: jumpUrl,
});
```

#### 跳转随机定时列表页面

```ts
const jumpUrl = `functional://ElectricianTimer/random?deviceId=${deviceId}`;
ty.navigateTo({
  url: jumpUrl,
});
```

#### 跳转倒时计列表页面

```ts
const jumpUrl = `functional://ElectricianTimer/countdown?deviceId=${deviceId}`;
ty.navigateTo({
  url: jumpUrl,
});
```

#### 跳转倒时计设置页面

```ts
const jumpUrl = `functional://ElectricianTimer/setCountdown?deviceId=${deviceId}`;
ty.navigateTo({
  url: jumpUrl,
});
```

#### 跳转点动定时列表页面

```ts
const jumpUrl = `functional://ElectricianTimer/inching?deviceId=${deviceId}`;
ty.navigateTo({
  url: jumpUrl,
});
```

#### 跳转点动定时设置页面

```ts
const jumpUrl = `functional://ElectricianTimer/inching/add?deviceId=${deviceId}`;
ty.navigateTo({
  url: jumpUrl,
});
```

#### 跳转天文定时列表页面

```ts
const jumpUrl = `functional://ElectricianTimer/astronomical?deviceId=${deviceId}`;
ty.navigateTo({
  url: jumpUrl,
});
```

#### 背景图设置

```ts
const jumpUrl = `functional://ElectricianTimer/schedule?deviceId=${deviceId}&bgImgUrl=encodeURIComponent(图片url地址)`;
ty.navigateTo({
  url: jumpUrl,
});
```


### 通用参数

| 名称                   | 类型     | 值范围     | 必选 | 说明                                                                                   |
| ---------------------- | -------- | ---------- | ---- | -------------------------------------------------------------------------------------- |
| deviceId               | string   | -          | 是   | 设备 ID                                                                                |
| switchCodes            | string | -          | 否   | 支持的开关，不设置则自动获取；多个请以英文“,”号隔开                                                           |
| countdownCodes         | string | -          | 否   | 支持的倒计时，注意，由于开关与倒计时是配对出现，所以配置此属性，需要同时配置支持的开关；多个请以英文“,”号隔开 |
| supportCountdown       | string   | n,y        | 否   | 是否支持的倒计时，默认为不支持                                                         |
| supportCycle           | string   | n,y        | 否   | 是否支持循环定时，不传则根据是否有 dp 功能决定是否支持                                 |
| supportRandom          | string   | n,y        | 否   | 是否支持随机定时，不传则根据是否有 dp 功能决定是否支持                                 |
| supportInching         | string   | n,y        | 否   | 是否支持点动定时，不传则根据是否有 dp 功能决定是否支持                                 |
| supportAstronomical    | string   | n,y        | 否   | 是否支持天文定时，在设备支持天文定时时此参数设置才有效                                 |
| cycleCode              | string   | -          | 否   | 自定义循环定时 dp code                                                                 |
| randomCode             | string   | -          | 否   | 自定义随机定时 dp code                                                                 |
| inchingCode            | string   | -          | 否   | 自定义点动定时 dp code                                                                 |
| is24Hour               | string   | n,y        | 否   | 是否为 24 小时制，y 表示是                                                             |
| category               | string   | -          | 否   | 云定时的分组 code，默认为 sdk_schedule                                                 |
| brand                  | string   | -          | 否   | 主题色，默认跟随宿主小程序主题。为 Hex 格式时，请传入 6 位有效数值，如： FFFFFF      |                                     |
| countdownSuccessAction | string   | hold,back  | 否   | 设置完成倒计时时的动作，hold 表示保持在倒计时页面，back 表示返回上一页，默认 hold      |
| bgImgUrl | string   | -  | 否   | 定时页面的背景图, 需要 encodeURIComponent     |

### 倒计时设置页面参数

| 名称   | 类型   | 值范围 | 必选 | 说明                                             |
| ------ | ------ | ------ | ---- | ------------------------------------------------ |
| dpCode | string | -      | 否   | 需要设置的倒计时 dp，不传时，则自动获取倒计时 dp |

## 依赖小程序库

基础库版本： 最低可用版本 `2.12.18`
Kit:

- BaseKit 2.1.2
- BizKit: 3.3.1
- Devicekit: 3.9.3
- MiniKit 3.2.1

## 注意事项

- 天文定时需要设备有本地具备定时能力，且产品需要开通天文定时高级能力；
- 需要支持云定时，请开通产品云定时高级能力；
- 倒计时、循环定时、随机定时需要产品具备相关的 dp 功能为前提条件，设置的支持和关闭才有效。
