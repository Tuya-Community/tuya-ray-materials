[English](./README.md) | 简体中文

# Ray 服务购买示例

## 项目名称

Ray 服务购买示例

## 使用须知

本项目是涂鸦小程序付费墙/应用内购买模板，使用前请确保：

- 已注册涂鸦开发者账号
- 已配置小程序应用并获取miniAppId
- 已开通应用内购买服务
- 了解Apple IAP和Google Play Console的支付流程

## 项目介绍

基于 [Ray 框架](https://developer.tuya.com/en/miniapp/develop/ray/guide/overview) 的涂鸦小程序**付费墙 / 应用内购买模板**。演示完整购买流程，包括 SKU 展示、IAP（Apple / Google）对接以及第三方支付渠道。

## 能力依赖

| 类别     | 技术                                                                                     |
| -------- | ---------------------------------------------------------------------------------------- |
| 框架     | [Ray](https://developer.tuya.com/en/miniapp/develop/ray/guide/overview)（`@ray-js/ray`） |
| 语言     | TypeScript                                                                               |
| 状态管理 | [@hookstate/core](https://hookstate.js.org/)                                             |
| UI 组件  | [@ray-js/smart-ui](https://developer.tuya.com/material/smartui)                          |
| 构建工具 | [@ray-js/cli](https://developer.tuya.com/en/miniapp/develop/ray/guide/overview)          |

## 功能

- 两套商品页（A / B）用于 A/B 测试不同购买布局
- 支持 Apple IAP、Google IAP，并做价格适配
- 第三方支付渠道（PayPal、Stripe、支付宝、微信支付等）
- 内置 Mock 模式，本地开发无需真实后端
- 国际化（英文与中文）

## 快速上手

```bash
# 安装依赖
yarn install

# 启动开发服务
yarn start

# 生产构建
yarn build

# 源码 Lint
yarn lint
```

## 项目结构

```
src/
├── app.tsx                  # 应用壳与全局生命周期
├── global.config.ts         # 应用级配置（basename、functionalPages.setting、窗口样式等）
├── routes.config.ts         # 页面路由定义
├── pages/
│   ├── home/                # 权益 / 落地页
│   ├── product-v1/          # 商品页变体 A（服务信息布局）
│   ├── product-v2/          # 商品页变体 B（功能展示 + SKU 列表）
│   └── payment/             # 支付 WebView / Mock 支付页
├── components/
│   ├── NavBarPlus/           # 自定义导航栏（随滚动切换标题）
│   ├── PaymentModal/         # 支付渠道选择弹窗
│   ├── Card/                 # 卡片容器
│   ├── FooterWrapper/        # 吸底区域包装
│   ├── PrimaryBtn/           # 主操作按钮
│   ├── HeyLogo/              # 品牌 Logo
│   └── Icon/                 # SVG 图标集
├── stores/
│   └── pay/                 # 支付 Store（PayStore.ts）与辅助模块（SKU 格式化、渠道、自动选中）
├── constants/
│   └── index.ts             # 业务常量与支付渠道配置
├── hooks/
│   ├── useSystemContext.ts  # 系统信息上下文（状态栏、主题、语言）
│   ├── usePageShow.ts       # 页面可见性生命周期 Hook
│   └── ...
├── utils/
│   ├── index.ts             # 通用工具（应用信息、存储、格式化、i18n 辅助）
│   ├── payment.ts           # IAP 支付辅助
│   ├── navigate.ts          # 导航工具
│   ├── currency.ts          # 货币符号映射
│   ├── config.ts            # 图片 CDN 配置
│   ├── iapPriceAdapter/     # iOS / Google IAP 价格适配
│   └── fetch/               # Highway 请求封装（含 Mock）
├── types/                   # TypeScript 类型定义
├── i18n/
│   └── strings.json         # 文案（en / zh）
└── static/                  # 图片、图标与全局样式
```

## 配置说明

接入真实服务前，请在 `src/constants/index.ts` 中修改以下常量：

| 常量            | 说明         | 默认值                 |
| --------------- | ------------ | ---------------------- |
| `CATEGORY_CODE` | 商品目录编码 | `"MOCK_CATEGORY_CODE"` |
| `miniAppId`     | 小程序 ID    | `"<YOUR-MINIAPP-ID>"`  |

当 `CATEGORY_CODE` 为 `"MOCK_CATEGORY_CODE"` 时，应用运行于 **Mock 模式**——接口返回本地 Mock 数据，支付页提供模拟成功/失败按钮。

如果你还没有「CATEGORY_CODE」和 「API 授权」，可通过涂鸦开发者平台 「技术支持」提交工单获取。

将 `src/utils/fetch/api.ts` 中的 `<HIGHWAY-PLACEHOLDER-*>` 替换为业务侧提供的 Highway 接口名。

在 `src/global.config.ts` 中将 `functionalPages.setting` 配置为实际的设置 / 订阅管理等功能页路径（模板占位：`/pages/setting/index`）。

## 页面与路由

| 路径                      | 页面      | 说明                                |
| ------------------------- | --------- | ----------------------------------- |
| `/pages/home/index`       | 首页      | 权益概览与跳转商品页                |
| `/pages/product-v1/index` | 商品页 V1 | 偏服务信息的购买页（默认选中月付）  |
| `/pages/product-v2/index` | 商品页 V2 | 功能展示 + SKU 列表（默认选中年付） |
| `/pages/payment/index`    | 支付页    | WebView 支付网关（或 Mock UI）      |

## 支付流程

```
进入页面
  └─> initProduct()
        ├─> initAppInfo()     （并行）
        ├─> initMallInfo()    （并行）
        └─> initIap()         （并行）
              └─> fetchSkuList()
                    └─> adaptIapPrice()
                          └─> autoSelectSku()

用户点击「购买」
  └─> buyNow()
        ├─ [支持 IAP] ─> buyByIap() ─> startIapPay()
        └─ [第三方]   ─> getPayment() ─> showPayChannel
                                  └─> payNow() ─> preOrder ─> prePay
                                        └─> goToPay()（WebView）
```

## 国际化（i18n）

文案位于 `src/i18n/strings.json`，包含 `en` 与 `zh` 两段。`getI18nHelper()` 提供 `t(key, options?)`，支持 `{{variable}}` 占位替换。

## 功能实现

### 核心功能

- SKU 商品管理：支持多规格商品展示
- IAP 支付：Apple App Store 和 Google Play 官方支付
- 第三方支付：集成 PayPal、Stripe、支付宝、微信支付等
- 订单管理：创建订单、查询订单状态
- 价格适配：根据地区自动调整货币和价格

### 扩展功能

- A/B 测试：支持两套商品页布局切换
- Mock 模式：开发阶段无需真实支付接口
- 国际化：支持多语言切换
- 响应式设计：适配不同设备屏幕

## 问题反馈

如果您在使用过程中遇到任何问题或有改进建议，请通过以下方式反馈：

- 涂鸦开发者社区: [社区讨论](https://developer.tuya.com/material/library_oHEKLjj0/component?code=ServicePurchase)

## 许可

本项目基于 [ISC](https://zh.wikipedia.org/wiki/ISC%E8%A8%B1%E5%8F%AF%E8%AD%89) 协议，请自由地享受和参与开源。

## 更新日志

### v0.0.1 (2026-03-26)

- 初始版本发布
- 实现 SKU 展示和基础购买功能
- 集成 Apple IAP 和 Google IAP
- 支持第三方支付渠道
- 添加 Mock 模式用于本地开发
- 实现国际化支持
