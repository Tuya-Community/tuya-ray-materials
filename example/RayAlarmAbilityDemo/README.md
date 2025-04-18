[English](README.md) | [简体中文](README_zh.md)

## Project Name: Alarm SDK Demo

## 1. Instructions

Before developing with this demo, you need a basic understanding of the Ray framework. It is recommended to first review the [Ray Development Documentation](https://developer.tuya.com/cn/miniapp/develop/ray/guide/overview).

## 2. Quick Start

- Create a temperature and humidity product under the sensor category, add DP ID 1, select the function point type as a temperature sensor, and set the data type of DP ID 1 to numeric with Celsius as the unit.
- Import this demo example file into the Tuya MiniApp IDE to run it.

## 3. Capability dependency

- App Version
  - Smart Life 4.5.0 and above
- TTT Dependencies
  - **HomeKit: 3.0.2**
  - BaseKit: 3.0.0
  - MiniKit: 3.0.0
  - DeviceKit: 3.0.0
  - BizKit: 3.0.1
  - baseversion: 2.10.29
- Product Dependencies
  - Sensor/Temperature and Humidity Sensor

| DP ID | Function Name | Identifier   | Data Transmission Type | Data Type | Function Attributes                              |
| ----- | ------------- | ------------ | ---------------------- | --------- | ------------------------------------------------ |
| 1     | Temperature   | temp_current | Report Only (ro)       | value     | Range: -200-600, Step: 1, Multiplier: 1, Unit: ℃ |

## 4. Panel function

This demo provides a simple example focusing on the temperature upper and lower limit alarm functionality of the temperature and humidity sensor. It mainly implements the following features:

- Adding and modifying temperature upper and lower limit alarms
- Enabling and disabling temperature upper and lower limit alarms
- Deleting temperature upper and lower limit alarms
- Displaying a list of temperature upper and lower limit alarms

_Note: This demo is for reference only. Specific features can be modified based on actual requirements._

## 5. Feature Implementation

For more details, refer to [Smart Device Model - Alarm Ability](https://developer.tuya.com/en/miniapp/solution-panel/ability/common/sdm/abilities/alarm/usage#custom-alarms).

## 6. Problem feedback

If you have any questions, please visit the link and submit a post for feedback: https://tuyaos.com/viewforum.php?f=10

## 7. License

[License Details](LICENSE)

## 8. Changelog

### [1.0.0] - 2025-04-18

First version
