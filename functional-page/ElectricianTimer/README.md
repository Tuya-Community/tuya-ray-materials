English | [简体中文](./README-zh_CN.md)

# Electrician Timing Function Page

Used for the timing function page of electrical products, supporting normal timing, sunrise timing, sunset timing, cycle timing, random timing, inching switch, countdown and other functions.

## Usage

### Installation Function Page

Add the following code to the `global.config.ts` file of the project

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

### Jump to function page

#### Jump to the timed comprehensive list page

```ts
const jumpUrl = `functional://ElectricianTimer/home?deviceId=${deviceId}`;
ty.navigateTo({
  url: jumpUrl,
});
```

#### Jump to the cloud schedule list page

```ts
const jumpUrl = `functional://ElectricianTimer/schedule?deviceId=${deviceId}`;
ty.navigateTo({
  url: jumpUrl,
});
```

#### Jump to loop timing list page

```ts
const jumpUrl = `functional://ElectricianTimer/cycle?deviceId=${deviceId}`;
ty.navigateTo({
  url: jumpUrl,
});
```

#### Jump to random time list page

```ts
const jumpUrl = `functional://ElectricianTimer/random?deviceId=${deviceId}`;
ty.navigateTo({
  url: jumpUrl,
});
```

#### Jump to countdown list page

```ts
const jumpUrl = `functional://ElectricianTimer/countdown?deviceId=${deviceId}`;
ty.navigateTo({
  url: jumpUrl,
});
```

#### Jump to countdown timer setting page

```ts
const jumpUrl = `functional://ElectricianTimer/setCountdown?deviceId=${deviceId}`;
ty.navigateTo({
  url: jumpUrl,
});
```

#### Jump to the inching timing list page

```ts
const jumpUrl = `functional://ElectricianTimer/inching?deviceId=${deviceId}`;
ty.navigateTo({
  url: jumpUrl,
});
```

#### Jump to the inching timing setting page

```ts
const jumpUrl = `functional://ElectricianTimer/inching/add?deviceId=${deviceId}`;
ty.navigateTo({
  url: jumpUrl,
});
```

#### Jump to the astronomical timing list page

```ts
const jumpUrl = `functional://ElectricianTimer/astronomical?deviceId=${deviceId}`;
ty.navigateTo({
  url: jumpUrl,
});
```

#### Background Image Settings

```ts
const jumpUrl = `functional://ElectricianTimer/schedule?deviceId=${deviceId}&bgImgUrl=encodeURIComponent(ImageURLAddress)`;
ty.navigateTo({
  url: jumpUrl,
});
```


### General parameters

| Name                   | Type     | Value range | Required | Description                                                                                                                                                               |
| ---------------------- | -------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| deviceId               | string   | -           | Yes      | Device ID                                                                                                                                                                 |
| switchCodes            | string | -           | No       | Supported switches, automatically acquired if not configured. Please separate multiple switches with “,”                                                                                                              |
| countdownCodes         | string | -           | No       | Supported countdown. Note that since the switch and countdown appear in pairs, to configure this property, you need to configure the supported switch at the same time. Please separate multiple numbers with “,”   |
| supportCountdown       | string   | n,y         | No       | Whether the countdown is supported, the default is not supported                                                                                                          |
| supportCycle           | string   | n,y         | No       | Whether to support loop timing. If not passed, it will be determined whether to support it based on whether there is DP function.                                         |
| supportRandom          | string   | n,y         | No       | Whether to support random timing. If not passed, it will be determined based on whether the DP function is available.                                                     |
| supportInching         | string   | n,y         | No       | Whether to support inching timing, if not transmitted, it will be determined whether to support it based on whether there is DP function                                  |
| supportAstronomical    | string   | n,y         | No       | Whether to support astronomical timing. This parameter setting is valid only when the device supports astronomical timing.                                                |
| cycleCode              | string   | -           | No       | Custom loop timing dp code                                                                                                                                                |
| randomCode             | string   | -           | No       | Custom random timing dp code                                                                                                                                              |
| inchingCode            | string   | -           | No       | Customize the inching timing dp code                                                                                                                                      |
| is24Hour               | string   | n,y         | No       | Whether it is a 24-hour system, `y` means yes, `n` means no                                                                                                               |
| category               | string   | -           | No       | The group code of cloud scheduling, the default is `sdk_schedule`                                                                                                         |
| brand                  | string   | -           | No       | Theme color, by default follows the host miniApp theme color. In Hex format, please enter a 6-digit valid value, such as: FFFFFF                                                                                                           |
| countdownSuccessAction | string   | hold,back   | No       | Set the action when the countdown is completed. `hold` means staying on the countdown page, and `back` means returning to the previous page. The default value is `hold`. |
| bgImgUrl | string   | -  | 否   | Background image of the timing page by encodeURIComponent      |

### Countdown setting page parameters

| Name   | Type   | Value range | Required | Description                                                                                           |
| ------ | ------ | ----------- | -------- | ----------------------------------------------------------------------------------------------------- |
| dpCode | string | -           | No       | The countdown dp that needs to be set. If not passed, the countdown dp will be automatically obtained |


## Dependency on MiniApp library

Basic library version: Minimum available version `2.12.18`
Kit:
- BaseKit 2.1.2
- BizKit: 3.3.1
- Devicekit: 3.9.3
- MiniKit 3.2.1

## Precautions

- Astronomical timing requires the device to have local timing capabilities, and the product needs to enable the advanced astronomical timing capabilities;
- Cloud timing needs to be supported, so please enable the advanced cloud timing capabilities of the product;
- Countdown, loop timing, and random timing require the product to have the relevant dp function as a prerequisite, and the support and shutdown settings are effective.
