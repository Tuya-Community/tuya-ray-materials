[English](README.md) | 简体中文[](README_zh.md)

# 项目名称：AI 像素屏文生图模板

## 1. 使用须知
使用该模板开发前， 需要对 [Ray](https://developer.tuya.com/cn/ray) 框架有基本的了解，建议先查阅 [Ray 开发文档](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panelmore-guide/index.html#0)

## 2. 快速上手

- 创建产品
- 创建项目
- 详细方案可参考 [AI 像素屏文生图方案](https://developer.tuya.com/cn/miniapp/solution-ai/ability/picture-solution/aiTextToImage/overview)
- 详细教程可参考 [AI 像素屏文生图模板教程](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/on-app-ai-text-to-image/index.html)


## 3. 能力依赖

- App 版本
  - 智能生活 v7.0.5 及以上版本
- Kit 依赖
  - BaseKit：v3.29.1
  - MiniKit：v3.12.0
  - DeviceKit：v4.6.1
  - BizKit：v4.10.0
  - HomeKit: 3.4.0
  - AIKit: 1.8.1
  - baseversion：v2.29.18
- 组件依赖
  - @ray-js/ray^1.7.56
  - @ray-js/panel-sdk^1.14.1
  - @ray-js/smart-ui^2.7.3
  - @ray-js/lamp-color-slider^1.1.7
  - @ray-js/lamp-saturation-slider^1.1.7
  - @ray-js/ray-error-catch^0.0.26
  - omggif^1.0.10
  - md5^1.0.10

- 功能页依赖

设备详情功能页：settings => tycryc71qaug8at6yt

## 4. 面板功能

- 端侧 AI 文生图：选择客户端下发的标签发送后, 客户端会调用本地 AI 大模型根据标签文本生成对应图片。
- 像素涂鸦：通过画布涂鸦组件进行内容绘制, 可保存生成绘制的图片。
- 图片上传与剪裁：支持用户通过选取相册内容或拍照获取图像之后进行图片剪裁处理。
- 蓝牙大数据传输：支持将图片内容通过分片透传方式下发给设备进行显示。
- 蓝牙像素屏调试: 介绍了蓝牙像素屏整体调试链路, 方便开发同学快速进入开发调试。


## 5. 功能实现

参见 [AI 像素屏文生图模板教程](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/on-app-ai-text-to-image/index.html)

## 6. 问题反馈

若有疑问，请访问链接，提交帖子反馈：https://tuyaos.com/viewforum.php?f=10

## 7. 许可

MIT